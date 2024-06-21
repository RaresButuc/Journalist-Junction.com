package com.journalistjunction.service;

import com.journalistjunction.DTO.ArticleAndThumbnailDTO;
import com.journalistjunction.DTO.ArticlePhotoAndByteDTO;
import com.journalistjunction.DTO.FileDTO;
import com.journalistjunction.DTO.HomePageArticles;
import com.journalistjunction.model.Article;
import com.journalistjunction.model.Category;
import com.journalistjunction.model.ContributorInvite;
import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.model.PhotosClasses.Photo;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.ArticleRepository;
import com.journalistjunction.repository.UserRepository;
import com.journalistjunction.s3.S3Buckets;
import com.journalistjunction.s3.S3Service;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class ArticleService {

    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final MailService mailService;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final ArticleRepository articleRepository;
    private final ArticlePhotoService articlePhotoService;
    private final ContributionInviteService contributionInviteService;


    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public List<HomePageArticles> getPostedArticlesByCategoryFrontPage() {
        List<HomePageArticles> articlesHomePage = new ArrayList<>();

        for (Category category : categoryService.getAllCategories()) {
            Stream<Article> filteredByCategory = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category.getNameOfCategory());
            boolean isLongerThan5 = filteredByCategory.toList().size() > 5;
            List<ArticleAndThumbnailDTO> articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category.getNameOfCategory())
                    .sorted(Comparator.comparing(Article::getPostTime).reversed())
                    .limit(5)
                    .map(e -> new ArticleAndThumbnailDTO(e, getArticleThumbnail(e.getId()).getBytes()))
                    .collect(Collectors.toList());

            articlesHomePage.add(new HomePageArticles(category.getNameOfCategory(), articles, isLongerThan5));
        }

        return articlesHomePage;
    }

    public Page<ArticleAndThumbnailDTO> getAllPostedArticlesByInputAndCategory(String input, String category, String country, String language, int currentPage, int itemsPerPage) {

        PageRequest pageRequest = PageRequest.of(currentPage, itemsPerPage);
        List<Article> articles;

        if (category.equals("null")) {
            if (country.equals("null")) {
                if (input.equals("null")) {
                    if (language.equals("null")) {
                        articles = articleRepository.findAllByPublishedIsTrueOrderByPostTimeDesc();
                    } else {
                        articles = articleRepository.findAllByPublishedIsTrueAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(language);
                    }
                } else {
                    if (language.equals("null")) {
                        articles = articleRepository.findAllByPublishedIsTrueAndTitleContainingIgnoreCaseOrderByPostTimeDesc(input);
                    } else {
                        articles = articleRepository.findAllByPublishedIsTrueAndAndTitleContainingIgnoreCaseAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(input, language);
                    }
                }
            } else {
                if (input.equals("null")) {
                    if (language.equals("null")) {
                        articles = articleRepository.findAllByPublishedIsTrueAndLocation_CountryOrderByPostTimeDesc(country);
                    } else {
                        articles = articleRepository.findAllByPublishedIsTrueAndLocation_CountryAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(country, language);
                    }
                } else {
                    if (language.equals("null")) {
                        articles = articleRepository.findAllByPublishedIsTrueAndLocation_CountryAndTitleContainingIgnoreCaseOrderByPostTimeDesc(country, input);
                    } else {
                        articles = articleRepository.findAllByPublishedIsTrueAndLocation_CountryAndTitleContainingIgnoreCaseAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(country, input, language);
                    }
                }
            }
        } else {
            if (country.equals("null")) {
                if (input.equals("null")) {
                    if (language.equals("null")) {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .collect(Collectors.toList());
                    } else {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .filter(e -> e.getLanguage().getLanguageNameEnglish().equals(language))
                                .collect(Collectors.toList());
                    }
                } else {
                    if (language.equals("null")) {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .filter(e -> e.getTitle().toLowerCase().contains(input.toLowerCase()))
                                .collect(Collectors.toList());
                    } else {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .filter(e -> e.getLanguage().getLanguageNameEnglish().equals(language) && e.getTitle().toLowerCase().contains(input.toLowerCase()))
                                .collect(Collectors.toList());
                    }
                }
            } else {
                if (input.equals("null")) {
                    if (language.equals("null")) {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .filter(e -> e.getLocation().getCountry().equals(country))
                                .collect(Collectors.toList());
                    } else {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .filter(e -> e.getLocation().getCountry().equals(country) && e.getLanguage().getLanguageNameEnglish().equals(language))
                                .collect(Collectors.toList());
                    }
                } else {
                    if (language.equals("null")) {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .filter(e -> e.getLocation().getCountry().equals(country) && e.getTitle().toLowerCase().contains(input.toLowerCase()))
                                .collect(Collectors.toList());
                    } else {
                        articles = getArticlesByIsPublishedAndCategory(articleRepository.findAll(), category)
                                .filter(e -> e.getLocation().getCountry().equals(country) && e.getTitle().toLowerCase().contains(input.toLowerCase()) && e.getLanguage().getLanguageNameEnglish().equals(language))
                                .collect(Collectors.toList());
                    }
                }
            }
        }

        List<ArticleAndThumbnailDTO> sublist = articles.subList(
                        (int) pageRequest.getOffset(),
                        Math.min((int) pageRequest.getOffset() + pageRequest.getPageSize(), articles.size())
                )
                .stream()
                .map(e -> new ArticleAndThumbnailDTO(e, getArticleThumbnail(e.getId()).getBytes())).toList();

        return new PageImpl<>(sublist, pageRequest, articles.size());
    }

    public Stream<Article> getArticlesByIsPublishedAndCategory(List<Article> articles, String category) {
        return articles
                .stream()
                .filter(e -> e.isPublished() && e.getCategories().stream()
                        .anyMatch(i -> i.getNameOfCategory().equals(category)))
                .sorted(Comparator.comparing(Article::getPostTime).reversed());
    }

    public Article getArticleById(Long articleId) {
        return articleRepository.findById(articleId)
                .orElseThrow(() -> new NoSuchElementException("No Article Found!"));
    }

    public List<ArticleAndThumbnailDTO> getOwnedAndContributedArticlesByUserId(Long userId) {
        return Stream.concat(
                        getArticlesByOwnerId(userId).stream(),
                        getArticlesByContributorId(userId).stream()
                )
                .sorted(Comparator.comparing((ArticleAndThumbnailDTO p) -> p.getArticle().getPostTime()).reversed())
                .toList();
    }


    public List<ArticleAndThumbnailDTO> getArticlesByOwnerId(Long userId) {
        return articleRepository.findAllByOwnerIdOrderByPostTimeDesc(userId)
                .stream()
                .map(e -> new ArticleAndThumbnailDTO(e, getArticleThumbnail(e.getId()).getBytes()))
                .toList();
    }

    public List<ArticleAndThumbnailDTO> getArticlesByContributorId(Long userId) {
        return articleRepository.findAllByContributorsIdOrderByPostTimeDesc(userId)
                .stream()
                .map(e -> new ArticleAndThumbnailDTO(e, getArticleThumbnail(e.getId()).getBytes()))
                .toList();
    }

    public boolean getArticleIsPublished(Long articleId) {
        return getArticleById(articleId).isPublished();
    }


    public Article createArticle(Article article) {
        article.setPublished(false);
        article.setRePublished(false);
        article.setPostTime(null);
        article.setViews(0L);
        return articleRepository.save(article);
    }

    public Article updateArticleById(Long articleId, Article articleUpdater) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = getArticleById(articleId);

        if (Objects.equals(article.getOwner().getId(), user.getId()) || article.getContributors().stream().anyMatch(e -> Objects.equals(e.getId(), user.getId()))) {
            if (articleUpdater.isPublished()) {
                validateArticleFields(articleUpdater);
            }
            copyArticleFields(articleUpdater, article);

            return articleRepository.save(article);
        }
        throw new IllegalStateException("You Can't Update An Article If You Are Not The Owner or A Contributor Of It!");
    }

    public ArticlePhotoAndByteDTO getArticleThumbnail(Long articleId) {
        Article article = getArticleById(articleId);
        List<ArticlePhoto> articlePhoto = article.getPhotos().stream().filter(ArticlePhoto::isThumbnail).toList();

        if (articlePhoto.size() != 1) {
            return null;
        }

        byte[] photo = s3Service.getObject(s3Buckets.getCustomer(), articlePhoto.getFirst().getKey());

        return new ArticlePhotoAndByteDTO(articlePhoto.getFirst(), photo);
    }

    public List<ArticlePhotoAndByteDTO> getNonThumbnailArticlePhotos(Long articleId) {
        Article article = getArticleById(articleId);

        List<ArticlePhotoAndByteDTO> photos = new ArrayList<>();
        for (ArticlePhoto articlePhoto : article.getPhotos().stream().filter(e -> !e.isThumbnail()).toList()) {
            byte[] photo = s3Service.getObject(s3Buckets.getCustomer(), articlePhoto.getKey());
            photos.add(new ArticlePhotoAndByteDTO(articlePhoto, photo));
        }

        return photos;
    }

    public List<ArticlePhotoAndByteDTO> getArticlePhotos(Long articleId) {
        Article article = getArticleById(articleId);

        List<ArticlePhotoAndByteDTO> photos = new ArrayList<>();
        for (ArticlePhoto articlePhoto : article.getPhotos()) {
            byte[] photo = s3Service.getObject(s3Buckets.getCustomer(), articlePhoto.getKey());
            photos.add(new ArticlePhotoAndByteDTO(articlePhoto, photo));
        }

        return photos;
    }

    @Transactional
    public void uploadArticlePhotos(List<MultipartFile> files, Long articleId, List<FileDTO> filesDTO) throws
            IOException {
        if (files.isEmpty()) {
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = getArticleById(articleId);

        if (!Objects.equals(article.getOwner().getId(), user.getId()) || article.getContributors().stream().anyMatch(e -> Objects.equals(e.getId(), user.getId()))) {
            throw new IllegalStateException("You Can't Update An Article If You Are Not The Owner or A Contributor Of It!");
        } else if (article.getPhotos().stream().anyMatch(ArticlePhoto::isThumbnail) && filesDTO.stream().anyMatch(FileDTO::getIsThumbnailAsBoolean)) {
            throw new IllegalStateException("Articles Can't Have More Than 1 Photo Set As Thumbnail! Please Choose Only One!");
        }

        if (article.getPhotos().size() + files.size() <= 10) {

            for (MultipartFile file : files) {
                String uuid = UUID.randomUUID().toString();
                String key = user.getId() + "/Article_" + articleId + "/" + uuid;
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

    public void deleteArticlePhotos(List<ArticlePhoto> photos, Long articleId) {
        if (photos.isEmpty()) {
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = getArticleById(articleId);

        if (!Objects.equals(article.getOwner().getId(), user.getId()) || article.getContributors().stream().anyMatch(e -> Objects.equals(e.getId(), user.getId()))) {
            throw new IllegalStateException("You Can't Update An Article If You Are Not The Owner or A Contributor Of It!");
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

    public void publishOrUnPublishArticle(Long articleId, String decision, Article articleUpdater) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = getArticleById(articleId);

        if (Objects.equals(article.getOwner().getId(), user.getId())) {
            validateArticle(article, articleUpdater, decision);

            if (decision.equals("true")) {
                if (article.getPostTime() == null) {
                    article.setPostTime(LocalDateTime.now());
                }

                copyArticleFields(articleUpdater, article);
                article.setPublished(true);
                if (!article.isRePublished()) {
                    mailService.articlePostedMail(article.getOwner().getEmail(), article.getOwner().getName(), article.getTitle());
                }
            } else if (decision.equals("false")) {
                article.setPublished(false);
                if (!article.isRePublished()) {
                    article.setRePublished(true);
                }
            }

            articleRepository.save(article);
        } else {
            throw new IllegalStateException("Only The Owner Of The Article Can Choose Whether To Publish Or UnPublish An Article!");
        }
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

    public void sendContributionEmailInvite(String email, Long articleId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            User user = (User) auth.getPrincipal();
            Article article = getArticleById(articleId);
            User newContributor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new NoSuchElementException("No User Was Found With This Email! Please Try Again!"));

            if (!article.getOwner().getId().equals(user.getId())) {
                throw new IllegalStateException("Only The Owner Of The Article Can Send Contributing Invites!");
            }

            if (user.getId().equals(newContributor.getId())) {
                throw new IllegalStateException("You Can't Send Contributor Invite To Yourself!");
            } else if (article.getContributors().stream().anyMatch(e -> e.getId().equals(newContributor.getId()))) {
                throw new IllegalStateException("You Can't Send Contributor Invite To A Current Contributor Of This Article!");
            }

            mailService.sendContributorInvite(user.getName(), user.getId(), articleId, email);
        } catch (MessagingException e) {
            throw new IllegalStateException("An Unexpected Error Has Occurred!");
        }
    }

    public boolean isUserContributor(Long articleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = getArticleById(articleId);

        return article.getContributors().stream().anyMatch(e -> Objects.equals(e.getId(), user.getId()));
    }

    public boolean isUserOwner(Long articleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = getArticleById(articleId);

        return Objects.equals(article.getOwner().getId(), user.getId());
    }

    public String verifyContribInviteAndAdd(String uuid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = auth.getPrincipal().equals("anonymousUser") ? null : (User) auth.getPrincipal();

        ContributorInvite contributionInvite = contributionInviteService.getInviteByUUID(uuid);

        Article article = getArticleById(contributionInvite.getArticleId());
        String articleOwner = article.getOwner().getName();
        String articleEmail = article.getOwner().getEmail();

        String successMessage = """
                Congratulations!
                                
                You Are Now A Contributor For %s's Article!
                                    
                Check Your 'Post New Article Page', on 'Contributed' Section For The Newest Added Article And Start Working On It!""".formatted(articleOwner);

        if (!contributionInvite.isExpired() || !contributionInviteService.isExpiredByTime(uuid)) {
            if (user == null || contributionInvite.getEmailTo().equals(user.getEmail())) {
                addOrDeleteContributor(contributionInvite.getArticleId(), contributionInvite.getEmailTo(), 1L);
                return successMessage;
            } else {
                throw new IllegalStateException(successMessage);
            }
        }

        throw new IllegalStateException("""
                This Invite Link Has Expired!
                                    
                For A New One Please Contact %s.
                """.formatted(articleEmail));
    }

    public void addOrDeleteContributor(Long articleId, String emailContributor, Long decision) {
        Article article = getArticleById(articleId);

        User contributor = userRepository.findByEmail(emailContributor)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This UserName!!"));

        if (decision == 1) {
            if (article.getOwner() != contributor &&
                    !article.getContributors().contains(contributor)) {
                article.getContributors().add(contributor);
            } else {
                throw new IllegalStateException("User " + contributor.getName() + " cannot be added as a contributor!");
            }
        } else if (decision == 0) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            User user = auth.getPrincipal().equals("anonymousUser") ? null : (User) auth.getPrincipal();

            if (article.getOwner() != contributor &&
                    article.getContributors().contains(contributor) &&
                    Objects.equals(article.getOwner().getId(), Objects.requireNonNull(user).getId())) {
                article.getContributors().remove(contributor);
            } else {
                throw new IllegalStateException("User " + contributor.getName() + " cannot be deleted as a contributor!");
            }
        } else {
            throw new IllegalStateException("Invalid decision: " + decision);
        }
        articleRepository.save(article);
    }

    public void increaseArticleViewCount(Long articleId) {
        Article article = getArticleById(articleId);

        article.setViews(article.getViews() + 1);

        articleRepository.save(article);
    }

    public void deleteArticleById(Long articleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();

        if (Objects.equals(getArticleById(articleId).getOwner().getId(), user.getId())) {
            articleRepository.deleteById(articleId);
        }
    }

    public String localDateTimeToString(Long articleId) {
        LocalDateTime articlePostTime = getArticleById(articleId).getPostTime();

        String hourAndSeconds = articlePostTime.getHour() + ":" + articlePostTime.getSecond();
        String dayAndMonth = articlePostTime.getDayOfWeek().name() + ", " + articlePostTime.getDayOfMonth() + " " + articlePostTime.getMonth() + " " + articlePostTime.getYear();
        return hourAndSeconds + " / " + dayAndMonth;
    }

}
