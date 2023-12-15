package com.journalistjunction.service;

import com.journalistjunction.model.Article;
import com.journalistjunction.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public List<Article> getAllPostedArticles() {
        return articleRepository.findAllByReadyToBePostedIsTrue();
    }

    public void addArticle(Article article) {
        article.setReadyToBePosted(false);
        article.setPostTime(null);
        article.setViews(0L);
        articleRepository.save(article);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElse(null);
    }

    public void updateArticleById(Long id, Article articleUpdater) {
        Article articleFromDb = articleRepository.findById(id).orElse(null);
        assert articleFromDb != null;

        if (articleUpdater.isReadyToBePosted() && !articleFromDb.isReadyToBePosted()) {
            articleFromDb.setPostTime(LocalDateTime.now());
        }

        articleFromDb.setTitle(articleUpdater.getTitle());
        articleFromDb.setShortDescription(articleUpdater.getShortDescription());
        articleFromDb.setBody(articleUpdater.getBody());
        articleFromDb.setCategories(articleUpdater.getCategories());
        articleFromDb.setLocation(articleUpdater.getLocation());
        articleFromDb.setLanguage(articleUpdater.getLanguage());
        articleFromDb.setReadyToBePosted(articleUpdater.isReadyToBePosted());

        articleRepository.save(articleFromDb);
    }

    public void deleteArticleById(Long id) {
        articleRepository.deleteById(id);
    }

    public String localDateTimeToString(Long id) {
        Article article = articleRepository.findById(id).orElse(null);
        assert article != null;

        LocalDateTime articlePostTime = article.getPostTime();
        String hourAndSeconds = articlePostTime.getHour() + ":" + articlePostTime.getSecond();
        String dayAndMonth = articlePostTime.getDayOfWeek().name() +", "+ articlePostTime.getDayOfMonth() + " " + articlePostTime.getMonth() + " " + articlePostTime.getYear();
        return hourAndSeconds + "/ " + dayAndMonth;
    }
}
