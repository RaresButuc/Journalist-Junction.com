package com.journalistjunction.service;

import com.journalistjunction.model.Article;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.ArticleRepository;
import com.journalistjunction.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public List<Article> getAllPostedArticles() {
        return articleRepository.findAllByPublishedIsTrue();
    }

    public Article createArticle(Article article) {
        article.setPublished(false);
        article.setPostTime(null);
        article.setViews(0L);
        return articleRepository.save(article);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));
    }

    public void updateArticleById(Long id, Article articleUpdater) {
        Article articleFromDb = articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));

        articleFromDb.setTitle(articleUpdater.getTitle());
        articleFromDb.setThumbnailDescription(articleUpdater.getThumbnailDescription());
        articleFromDb.setBody(articleUpdater.getBody());
        articleFromDb.setCategories(articleUpdater.getCategories());
        articleFromDb.setLocation(articleUpdater.getLocation());
        articleFromDb.setLanguage(articleUpdater.getLanguage());

        articleRepository.save(articleFromDb);
    }

    public void publicOrNonpublicArticle(Long id, String decision) {
        Article articleFromDb = articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));
        ;
        if (articleFromDb.getPostTime() == null) {
            articleFromDb.setPostTime(LocalDateTime.now());
        }
        articleFromDb.setPublished(Boolean.parseBoolean(decision));
        articleRepository.save(articleFromDb);

    }

    public void addOrDeleteContributor(Long idAd, String nameContributor, String decision) {
        Article articleFromDb = articleRepository.findById(idAd)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));
        User contributor = userRepository.findByName(nameContributor)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This UserName!!"));

        switch (decision) {
            case "add" -> {
                if (articleFromDb.getOwner() != contributor &&
                        !articleFromDb.getContributors().contains(contributor) &&
                        !articleFromDb.getRejectedWorkers().contains(contributor)) {
                    articleFromDb.getContributors().add(contributor);
                }
            }
            case "delete" -> {
                if (articleFromDb.getOwner() != contributor &&
                        articleFromDb.getContributors().contains(contributor) &&
                        !articleFromDb.getRejectedWorkers().contains(contributor)) {
                    articleFromDb.getContributors().remove(contributor);

                    articleFromDb.getRejectedWorkers().add(contributor);
                }
            }
            default -> throw new IllegalStateException("Invalid decision: " + decision);
        }
        articleRepository.save(articleFromDb);
    }

    public void removeRejection(Long idAd, Long idUser) {
        Article articleFromDb = articleRepository.findById(idAd)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));

        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This UserName!!"));

        articleFromDb.getRejectedWorkers().remove(user);
        articleRepository.save(articleFromDb);
    }

    public List<Article> getArticlesByUserId(Long id) {
        return articleRepository.findAllByOwnerId(id);
    }

    public void deleteArticleById(Long id) {
        articleRepository.deleteById(id);
    }

    public String localDateTimeToString(Long id) {
        LocalDateTime articlePostTime = articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"))
                .getPostTime();

        String hourAndSeconds = articlePostTime.getHour() + ":" + articlePostTime.getSecond();
        String dayAndMonth = articlePostTime.getDayOfWeek().name() + ", " + articlePostTime.getDayOfMonth() + " " + articlePostTime.getMonth() + " " + articlePostTime.getYear();
        return hourAndSeconds + "/ " + dayAndMonth;
    }
}
