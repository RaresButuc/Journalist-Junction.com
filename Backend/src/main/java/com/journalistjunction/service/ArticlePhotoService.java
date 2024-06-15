package com.journalistjunction.service;

import com.journalistjunction.DTO.ChangeIsThumbnailStatusDTO;
import com.journalistjunction.model.Article;
import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.ArticlePhotoRepository;
import com.journalistjunction.repository.ArticleRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@AllArgsConstructor
public class ArticlePhotoService {

    private final ArticlePhotoRepository articlePhotoRepository;
    private final ArticleRepository articleRepository;

    public ArticlePhoto getArticlePhotoById(Long id) {
        return articlePhotoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Photo Found!"));
    }

    public ArticlePhoto createArticlePhoto(ArticlePhoto articlePhoto) {
        articlePhotoRepository.save(articlePhoto);
        return articlePhoto;
    }

    public void setPhotoAsThumbnailOrNot(Long id, List<ChangeIsThumbnailStatusDTO> decisions) {
        if (decisions.isEmpty()) {
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = articleRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        if (user.getArticlesOwned().stream().noneMatch(e -> Objects.equals(e.getId(), id))) {
            throw new IllegalStateException("No Article Found With This ID for " + user.getName());
        }

        for (ChangeIsThumbnailStatusDTO decision : decisions) {
            if (article.getPhotos().stream().anyMatch(e -> Objects.equals(e.getId(), decision.getId()))) {
                ArticlePhoto currentPhotoArticle = getArticlePhotoById(decision.getId());

                currentPhotoArticle.setThumbnail(decision.getNewStatusAsBoolean());
                articlePhotoRepository.save(currentPhotoArticle);
            } else {
                throw new IllegalStateException("An Error Has Occurred While Trying To Change The Thumbnail Of The Article. Please Try Again!");
            }
        }
    }

    public void dontDeleteThumbnailWithoutAddingOne(boolean isArticlePublished, boolean isCurrentThumbnailDeleted, boolean isAnyNewThumbnailSet) {
        if (isArticlePublished && isCurrentThumbnailDeleted && !isAnyNewThumbnailSet) {
            throw new IllegalStateException("You Can't Delete A Thumbnail Photo Without Uploading Or Choosing One, While The Article is Already Published!");
        }
    }

    public void dontUnsetAThumbnailWithoutChoosingOne(boolean isArticlePublished, boolean isCurrentThumbnailUnset, boolean isAnyNewThumbnailSet) {
        if (isArticlePublished && isCurrentThumbnailUnset && !isAnyNewThumbnailSet) {
            throw new IllegalStateException("You Can't Unset A Thumbnail Photo Without Uploading Or Choosing One, While The Article is Already Published!");
        }
    }
}
