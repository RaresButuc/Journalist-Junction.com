package com.journalistjunction.service;

import com.journalistjunction.DTO.ArticlePhotoAndByteDTO;
import com.journalistjunction.DTO.FileDTO;
import com.journalistjunction.model.Article;
import com.journalistjunction.model.Category;
import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.model.PhotosClasses.Photo;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.ArticleRepository;
import com.journalistjunction.repository.UserRepository;
import com.journalistjunction.s3.S3Buckets;
import com.journalistjunction.s3.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ArticleService {

    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final ArticleRepository articleRepository;
    private final ArticlePhotoService articlePhotoService;


    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public List<Article> getPostedArticlesByCategory(String category) {
        List<Article> articles = new ArrayList<>(articleRepository.findAll().stream().filter(e -> e.isPublished() && e.getCategories().stream().anyMatch(i -> i.getNameOfCategory().equals(category))).toList());

        articles.sort(Comparator.comparing(Article::getPostTime));

        return articles;
    }

    public HashMap<String, List<Article>> getPostedArticlesByCategoryFrontPage() {
        HashMap<String, List<Article>> articlesByCateg = new HashMap<>();

        for (Category category : categoryService.getAllCategories()) {
            List<Article> articles = getPostedArticlesByCategory(category.getNameOfCategory()).stream().limit(5).toList();
            articles.sort(Comparator.comparing(Article::getPostTime));

            articlesByCateg.put(category.getNameOfCategory(), articles);
        }

        return articlesByCateg;
    }

    public List<Article> getAllPostedArticles() {
        return articleRepository.findAllByPublishedIsTrue();
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"));
    }

    public boolean getArticleIsPublished(Long id) {
        return getArticleById(id).isPublished();
    }


    public Article createArticle(Article article) {
        article.setPublished(false);
        article.setPostTime(null);
        article.setViews(0L);
        return articleRepository.save(article);
    }

    public Article updateArticleById(Long id, Article articleUpdater) {
        Article articleFromDb = articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        if (articleUpdater.isPublished()) {
            validateArticleFields(articleUpdater);
        }
        copyArticleFields(articleUpdater, articleFromDb);

        return articleRepository.save(articleFromDb);
    }

    public ArticlePhotoAndByteDTO getArticleThumbnail(Long id) {
        Article article = articleRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Article Found!"));
        List<ArticlePhoto> articlePhoto = article.getPhotos().stream().filter(ArticlePhoto::isThumbnail).toList();

        if (articlePhoto.size() != 1) {
            throw new IllegalStateException("An Error Has Occurred While TryingTo Process The Thumbnail Photo For This Article!");
        }

        byte[] photo = s3Service.getObject(s3Buckets.getCustomer(), articlePhoto.getFirst().getKey());

        return new ArticlePhotoAndByteDTO(articlePhoto.getFirst(), photo);
    }

    public List<ArticlePhotoAndByteDTO> getNonThumbnailArticlePhotos(Long id) {
        Article article = articleRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        List<ArticlePhotoAndByteDTO> photos = new ArrayList<>();
        for (ArticlePhoto articlePhoto : article.getPhotos().stream().filter(e -> !e.isThumbnail()).toList()) {
            byte[] photo = s3Service.getObject(s3Buckets.getCustomer(), articlePhoto.getKey());
            photos.add(new ArticlePhotoAndByteDTO(articlePhoto, photo));
        }

        return photos;
    }

    public List<ArticlePhotoAndByteDTO> getArticlePhotos(Long id) {
        Article article = articleRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        List<ArticlePhotoAndByteDTO> photos = new ArrayList<>();
        for (ArticlePhoto articlePhoto : article.getPhotos()) {
            byte[] photo = s3Service.getObject(s3Buckets.getCustomer(), articlePhoto.getKey());
            photos.add(new ArticlePhotoAndByteDTO(articlePhoto, photo));
        }

        return photos;
    }

    @Transactional
    public void uploadArticlePhotos(List<MultipartFile> files, Long id, List<FileDTO> filesDTO) throws IOException {
        if (files.isEmpty()) {
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User userFromDb = (User) auth.getPrincipal();
        Article article = articleRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        if (userFromDb.getArticlesOwned().stream().noneMatch(e -> Objects.equals(e.getId(), id))) {
            throw new IllegalStateException("No Article Found With This ID for " + userFromDb.getName());
        } else if (article.getPhotos().stream().anyMatch(ArticlePhoto::isThumbnail) && filesDTO.stream().anyMatch(FileDTO::getIsThumbnailAsBoolean)) {
            throw new IllegalStateException("Articles Can't Have More Than 1 Photo Set As Thumbnail! Please Choose Only One!");
        }

        if (article.getPhotos().size() + files.size() <= 10) {

            for (MultipartFile file : files) {
                String uuid = UUID.randomUUID().toString();
                String key = userFromDb.getId() + "/Article_" + id + "/" + uuid;
                FileDTO fileDTO = filesDTO.stream().filter(e -> e.getFileName().equals(file.getOriginalFilename())).findFirst().orElseThrow(() -> new NoSuchElementException("No Photo Found!"));

                ArticlePhoto newArticlePhoto = articlePhotoService.createArticlePhoto(new ArticlePhoto(s3Buckets.getCustomer(), key, fileDTO.getIsThumbnailAsBoolean(), article));

                article.getPhotos().add(newArticlePhoto);

                s3Service.putObject(s3Buckets.getCustomer(), key, file.getBytes());
            }

            articleRepository.save(article);
        } else {
            throw new IllegalStateException("Articles Can't Have More Than 10 Photos!");
        }
    }

    public void deleteArticlePhotos(List<ArticlePhoto> photos, Long id) {
        if (photos.isEmpty()) {
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User userFromDb = (User) auth.getPrincipal();
        Article article = articleRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        if (userFromDb.getArticlesOwned().stream().noneMatch(e -> Objects.equals(e.getId(), id))) {
            throw new IllegalStateException("No Article Found With This ID for " + userFromDb.getName());
        }

        List<String> keys = photos.stream().map(Photo::getKey).toList();

        List<ArticlePhoto> updatedPhotos = article.getPhotos().stream()
                .filter(photoInArticle -> photos.stream().noneMatch(photoToDelete -> photoInArticle.getId().equals(photoToDelete.getId())))
                .collect(Collectors.toList());

        article.setPhotos(updatedPhotos);

        articleRepository.save(article);
        s3Service.deleteMultipleObjects(s3Buckets.getCustomer(), keys);
    }

    private void copyArticleFields(Article source, Article destination) {
        destination.setTitle(source.getTitle());
        destination.setThumbnailDescription(source.getThumbnailDescription());
        destination.setBody(source.getBody());
        destination.setCategories(source.getCategories());
        destination.setLocation(source.getLocation());
        destination.setLanguage(source.getLanguage());
    }

    public void publishOrUnPublishArticle(Long id, String decision, Article articleUpdater) {
        Article articleFromDb = articleRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        validateArticle(articleFromDb, articleUpdater, decision);

        if (decision.equals("true")) {
            if (articleFromDb.getPostTime() == null) {
                articleFromDb.setPostTime(LocalDateTime.now());
            }
            copyArticleFields(articleUpdater, articleFromDb);
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
                article.getLanguage() == null ||
                article.getPhotos().stream().noneMatch(ArticlePhoto::isThumbnail)) {
            throw new IllegalStateException("All The Necessary Fields Must Be Completed! They Are Marked With ` * `");
        }
    }

    private void validateArticle(Article oldVersion, Article newVersion, String decision) {
        if (oldVersion.isPublished() && decision.equals("true")) {
            throw new IllegalStateException("Article Is Already Published!");
        } else if (!oldVersion.isPublished() && decision.equals("false")) {
            throw new IllegalStateException("Article is Already Not Published!");
        }

        if (!decision.equals("true") && !decision.equals("false")) {
            throw new IllegalArgumentException("Invalid decision value! Please provide a valid decision!");
        }

        if (decision.equals("true")) {
            validateArticleFields(newVersion);
        }
    }


    public void addOrDeleteContributor(Long idAd, String nameContributor, String decision) {
        Article articleFromDb = articleRepository.findById(idAd)
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"));
        User contributor = userRepository.findByName(nameContributor)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This UserName!!"));

        switch (decision) {
            case "add" -> {
                if (articleFromDb.getOwner() != contributor &&
                        !articleFromDb.getContributors().contains(contributor) &&
                        !articleFromDb.getRejectedWorkers().contains(contributor)) {
                    articleFromDb.getContributors().add(contributor);
                } else {
                    throw new IllegalStateException("User " + nameContributor + " cannot be added as a contributor!");
                }
            }
            case "delete" -> {
                if (articleFromDb.getOwner() != contributor &&
                        articleFromDb.getContributors().contains(contributor) &&
                        !articleFromDb.getRejectedWorkers().contains(contributor)) {
                    articleFromDb.getContributors().remove(contributor);
                    articleFromDb.getRejectedWorkers().add(contributor);
                } else {
                    throw new IllegalStateException("User " + nameContributor + " cannot be deleted as a contributor!");
                }
            }
            default -> throw new IllegalStateException("Invalid decision: " + decision);
        }
        articleRepository.save(articleFromDb);
    }


    public void removeRejection(Long idAd, Long idUser) {
        Article articleFromDb = articleRepository.findById(idAd)
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"));

        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"));

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
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"))
                .getPostTime();

        String hourAndSeconds = articlePostTime.getHour() + ":" + articlePostTime.getSecond();
        String dayAndMonth = articlePostTime.getDayOfWeek().name() + ", " + articlePostTime.getDayOfMonth() + " " + articlePostTime.getMonth() + " " + articlePostTime.getYear();
        return hourAndSeconds + "/ " + dayAndMonth;
    }

}
