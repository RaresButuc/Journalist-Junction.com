package com.journalistjunction.service;

import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.repository.ArticlePhotoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class ArticlePhotoService {

    private final ArticlePhotoRepository articlePhotoRepository;

    public ArticlePhoto getArticlePhotoById(Long id) {
        return articlePhotoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Photo Found!"));
    }

    public ArticlePhoto createArticlePhoto(ArticlePhoto articlePhoto) {
        articlePhotoRepository.save(articlePhoto);
        return articlePhoto;
    }
}
