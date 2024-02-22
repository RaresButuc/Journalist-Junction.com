package com.journalistjunction.service;

import com.journalistjunction.model.Article;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.ArticleRepository;
import com.journalistjunction.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
        article.setPostTime(LocalDateTime.now());
        article.setViews(0L);
        return articleRepository.save(article);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElse(null);
    }

    public void updateArticleById(Long id, Article articleUpdater) {
        Article articleFromDb = articleRepository.findById(id).orElse(null);
        assert articleFromDb != null;

        articleFromDb.setTitle(articleUpdater.getTitle());
        articleFromDb.setThumbnailDescription(articleUpdater.getThumbnailDescription());
        articleFromDb.setBody(articleUpdater.getBody());
        articleFromDb.setPostTime(LocalDateTime.now());
        articleFromDb.setCategories(articleUpdater.getCategories());
        articleFromDb.setLocation(articleUpdater.getLocation());
        articleFromDb.setLanguage(articleUpdater.getLanguage());

        articleRepository.save(articleFromDb);
    }

    public void publicOrNonpublicArticle(Long id, String decision) {
        Article articleFromDb = articleRepository.findById(id).orElse(null);
        assert articleFromDb != null;

        articleFromDb.setPublished(Boolean.parseBoolean(decision));
        articleRepository.save(articleFromDb);

    }

    public void addOrDeleteContributor(Long idAd, String nameContributor, String decision) {
        Article articleFromDb = articleRepository.findById(idAd).orElse(null);
        User contributor = userRepository.findByName(nameContributor).orElse(null);
        assert articleFromDb != null;

        switch (decision) {
            case "add" -> {
                articleFromDb.getContributors().add(contributor);
            }
            case "delete" -> {
                articleFromDb.getContributors().remove(contributor);

                articleFromDb.getRejectedWorkers().add(contributor);
            }
        }
        articleRepository.save(articleFromDb);
    }

    public void removeRejection(Long idAd, Long idUser) {
        Article articleFromDb = articleRepository.findById(idAd).orElse(null);
        User user = userRepository.findById(idUser).orElse(null);
        assert articleFromDb != null;

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
        Article article = articleRepository.findById(id).orElse(null);
        assert article != null;

        LocalDateTime articlePostTime = article.getPostTime();
        String hourAndSeconds = articlePostTime.getHour() + ":" + articlePostTime.getSecond();
        String dayAndMonth = articlePostTime.getDayOfWeek().name() + ", " + articlePostTime.getDayOfMonth() + " " + articlePostTime.getMonth() + " " + articlePostTime.getYear();
        return hourAndSeconds + "/ " + dayAndMonth;
    }
}
