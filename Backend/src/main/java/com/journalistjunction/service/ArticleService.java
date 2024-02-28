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

//    public void updateArticleById(Long id, Article articleUpdater) {
//        Article articleFromDb = articleRepository.findById(id)
//                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));
//
//        if (articleFromDb.isPublished() &&
//                articleUpdater.getTitle() == null ||
//                articleUpdater.getTitle().isEmpty() ||
//                articleUpdater.getThumbnailDescription() == null ||
//                articleUpdater.getThumbnailDescription().isEmpty() ||
//                articleUpdater.getBody() == null ||
//                articleUpdater.getBody().isEmpty() ||
//                articleUpdater.getCategories() == null ||
//                articleUpdater.getCategories().isEmpty() ||
//                articleUpdater.getLocation() == null ||
//                articleUpdater.getLanguage() == null) {
//            throw new IllegalStateException("All the necessary fields must be completed! They are Marked With ` * `");
//        }
//
//        articleFromDb.setTitle(articleUpdater.getTitle());
//        articleFromDb.setThumbnailDescription(articleUpdater.getThumbnailDescription());
//        articleFromDb.setBody(articleUpdater.getBody());
//        articleFromDb.setCategories(articleUpdater.getCategories());
//        articleFromDb.setLocation(articleUpdater.getLocation());
//        articleFromDb.setLanguage(articleUpdater.getLanguage());
//
//        articleRepository.save(articleFromDb);
//    }

    public void updateArticleById(Long id, Article articleUpdater) {
        Article articleFromDb = articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));

        copyArticleFields(articleUpdater, articleFromDb);

        articleRepository.save(articleFromDb);
    }

    private void copyArticleFields(Article source, Article destination) {
        destination.setTitle(source.getTitle());
        destination.setThumbnailDescription(source.getThumbnailDescription());
        destination.setBody(source.getBody());
        destination.setCategories(source.getCategories());
        destination.setLocation(source.getLocation());
        destination.setLanguage(source.getLanguage());
    }
    ///////////////////////////////////////////////////////////////////////////////////

//    public void publishOrUnPublishArticle(Long id, String decision, Article currentVersion) {
//        Article articleFromDb = articleRepository.findById(id)
//                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));
//
//        if (articleFromDb.isPublished()) {
//            throw new IllegalStateException("Article is already published!");
//        }
//
//        if (decision.equals("true") &&
//                articleFromDb.getTitle() == null ||
//                articleFromDb.getTitle().isEmpty() ||
//                articleFromDb.getThumbnailDescription() == null ||
//                articleFromDb.getThumbnailDescription().isEmpty() ||
//                articleFromDb.getBody() == null ||
//                articleFromDb.getBody().isEmpty() ||
//                articleFromDb.getCategories() == null ||
//                articleFromDb.getCategories().isEmpty() ||
//                articleFromDb.getLocation() == null ||
//                articleFromDb.getLanguage() == null) {
//            throw new IllegalStateException("All the necessary fields must be completed! They are Marked With ` * `");
//        }
//
//        if (!decision.equals("true") && !decision.equals("false")) {
//            throw new IllegalArgumentException("Invalid decision value! Please provide a valid decision!");
//        }
//
//        if (articleFromDb.getPostTime() == null) {
//            articleFromDb.setPostTime(LocalDateTime.now());
//        }
//
//        articleFromDb.setTitle(currentVersion.getTitle());
//        articleFromDb.setThumbnailDescription(currentVersion.getThumbnailDescription());
//        articleFromDb.setBody(currentVersion.getBody());
//        articleFromDb.setCategories(currentVersion.getCategories());
//        articleFromDb.setLocation(currentVersion.getLocation());
//        articleFromDb.setLanguage(currentVersion.getLanguage());
//        articleFromDb.setPublished(Boolean.parseBoolean(decision));
//        articleRepository.save(articleFromDb);
//    }

    public void publishOrUnPublishArticle(Long id, String decision, Article currentVersion) {
        Article articleFromDb = articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found With This ID!"));

        if (decision.equals("true")) {
            validateArticle(articleFromDb, decision);
            articleFromDb.setPostTime(LocalDateTime.now());
            copyArticleFields(currentVersion, articleFromDb);
            articleFromDb.setPublished(true);
        } else {
            articleFromDb.setPublished(false);
        }

        articleRepository.save(articleFromDb);
    }

    private void validateArticleFields(Article article) {
        if (article.getTitle() == null ||
                article.getTitle().isEmpty() ||
                article.getThumbnailDescription() == null ||
                article.getThumbnailDescription().isEmpty() ||
                article.getBody() == null ||
                article.getBody().isEmpty() ||
                article.getCategories() == null ||
                article.getCategories().isEmpty() ||
                article.getLocation() == null ||
                article.getLanguage() == null) {
            throw new IllegalStateException("All the necessary fields must be completed! They are Marked With ` * `");
        }
    }

    private void validateArticle(Article article, String decision) {
        if (article.isPublished()) {
            throw new IllegalStateException("Article is already published!");
        }

        if (!decision.equals("true") && !decision.equals("false")) {
            throw new IllegalArgumentException("Invalid decision value! Please provide a valid decision!");
        }

        if (decision.equals("true")) {
            validateArticleFields(article);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////


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
