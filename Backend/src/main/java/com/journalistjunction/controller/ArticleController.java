package com.journalistjunction.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.journalistjunction.DTO.ArticleAndThumbnailDTO;
import com.journalistjunction.DTO.ArticlePhotoAndByteDTO;
import com.journalistjunction.DTO.FileDTO;
import com.journalistjunction.DTO.HomePageArticles;
import com.journalistjunction.model.Article;
import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.service.ArticleService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/article")
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/posted")
    public Page<ArticleAndThumbnailDTO> getNewestPostedArticleByCategory(
            @RequestParam(name = "currentpage") int currentPage,
            @RequestParam(name = "itemsperpage") int itemsPerPage,
            @RequestParam(name = "input", required = false) String input,
            @RequestParam(name = "country", required = false) String country,
            @RequestParam(name = "language", required = false) String language,
            @RequestParam(name = "category", required = false) String category
    ) {
        return articleService.getAllPostedArticlesByInputAndCategory(input, category, country, language, currentPage, itemsPerPage);
    }

    @GetMapping("/trending")
    public List<ArticleAndThumbnailDTO> getTrendingArticlesyCategory(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "time", required = false) Long time
    ) {
        return articleService.getTrendingArticlesByCategory(category, time);
    }

    @GetMapping("/front-page-articles")
    public List<HomePageArticles> getNewestPostedArticleFrontPage() {
        return articleService.getPostedArticlesByCategoryFrontPage();
    }

    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable("id") Long id) {
        return articleService.getArticleById(id);
    }

    @GetMapping("/date/{id}")
    public String getArticleDateInString(@PathVariable("id") Long id) {
        return articleService.localDateTimeToString(id);
    }

    @GetMapping("/ispublished/{id}")
    public boolean isArticlePublished(@PathVariable("id") Long id) {
        return articleService.getArticleIsPublished(id);

    }

    @GetMapping("/user/all/{id}")
    public List<ArticleAndThumbnailDTO> getAllArticlesByUser(@PathVariable("id") Long id) {
        return articleService.getOwnedAndContributedArticlesByUserId(id);
    }

    @GetMapping("/user/owned/{id}")
    public List<ArticleAndThumbnailDTO> getOwnedArticlesByUser(@PathVariable("id") Long id) {
        return articleService.getArticlesByOwnerId(id);
    }

    @GetMapping("/user/contributor/{id}")
    public List<ArticleAndThumbnailDTO> getContributedArticlesByUser(@PathVariable("id") Long id) {
        return articleService.getArticlesByContributorId(id);
    }

    @GetMapping(value = "/get-article-thumbnail/{id}")
    public ArticlePhotoAndByteDTO getArticleThumbnail(@PathVariable("id") Long id) {
        return articleService.getArticleThumbnail(id);
    }

    @GetMapping(value = "/get-nonThumbnail-article-photos/{id}")
    public List<ArticlePhotoAndByteDTO> getNonThumbnailArticlePhotos(@PathVariable("id") Long id) {
        return articleService.getNonThumbnailArticlePhotos(id);
    }

    @GetMapping(value = "/get-article-photos/{id}")
    public List<ArticlePhotoAndByteDTO> getArticlePhotos(@PathVariable("id") Long id) {
        return articleService.getArticlePhotos(id);
    }

    @GetMapping("/user/invite-contributor/{email}/{articleId}")
    public ResponseEntity<String> inviteContributorByEmail(@PathVariable("email") String email, @PathVariable("articleId") Long articleId) {
        articleService.sendContributionEmailInvite(email, articleId);
        return ResponseEntity.ok("The Contribution Invitation Was Sent To %s!".formatted(email));
    }

    @GetMapping("/user/verify-contributor/{articleId}")
    public boolean isUserContributor(@PathVariable("articleId") Long articleId) {
        return articleService.isUserContributor(articleId);
    }

    @GetMapping("/user/verify-owner/{articleId}")
    public boolean isUserOwner(@PathVariable("articleId") Long articleId) {
        return articleService.isUserOwner(articleId);
    }

    @PostMapping
    public Article createNewArticle(@RequestBody Article article) throws MessagingException {
        return articleService.createArticle(article);
    }

    @PutMapping("/{id}")
    public Article editArticle(@PathVariable("id") Long id, @RequestBody Article articleEdited) {
        return articleService.updateArticleById(id, articleEdited);
    }

    @PutMapping("/{id}/{decision}")
    public ResponseEntity<String> publicOrNonPublicArticle(@PathVariable("id") Long id, @PathVariable("decision") String decision, @RequestBody Article currentVersion) throws MessagingException {
        articleService.publishOrUnPublishArticle(id, decision, currentVersion);

        String message = decision.equals("true") ?
                "Congratulations! Your Article Was Successfully Published!" :
                "Your Article Was Successfully UnPublished!";
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{id}/{username}/{decision}")
    public ResponseEntity<String> addOrDeleteContributor(@PathVariable("id") Long id, @PathVariable("username") String username, @PathVariable("decision") Long decision) {
        articleService.addOrDeleteContributor(id, username, decision);

        return ResponseEntity.ok("");
    }


    @PutMapping(value = "/upload-article-photos/{id}")
    public ResponseEntity<String> uploadArticlePhotos(@RequestParam("files") List<MultipartFile> photos, @PathVariable("id") Long id, @RequestParam("fileDTOList") List<String> fileDTOList) throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        List<String> DTOsConfirmed = new ArrayList<>(fileDTOList.isEmpty() ? Collections.emptyList() :
                fileDTOList.size() == 1 ||
                        (fileDTOList.get(0).startsWith("{") && !fileDTOList.get(0).endsWith("{") &&
                                !fileDTOList.get(1).startsWith("{") && fileDTOList.get(1).endsWith("}")) ?
                        Collections.singletonList(fileDTOList.get(0) + "," + fileDTOList.get(1)) :
                        fileDTOList);

        List<FileDTO> filesDTO = DTOsConfirmed.stream().map(e -> {
            try {
                return mapper.readValue(e, FileDTO.class);
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }).toList();

        articleService.uploadArticlePhotos(photos, id, filesDTO);

        return ResponseEntity.ok("Images Successfully Posted!");
    }

    @PutMapping(value = "/delete-article-photos/{id}")
    public ResponseEntity<String> deleteArticlePhotos(@RequestBody List<ArticlePhoto> photos, @PathVariable("id") Long id) {
        articleService.deleteArticlePhotos(photos, id);

        return ResponseEntity.ok("Images Successfully Deleted!");
    }

    @PutMapping(value = "/add-view/{id}")
    public void increaseViewCount(@PathVariable("id") Long id) {
        articleService.increaseArticleViewCount(id);
    }

    @PutMapping("/user/add-contributor/{uuid}")
    public String addUserAsContributor(@PathVariable("uuid") String uuid) {
        return articleService.verifyContribInviteAndAdd(uuid);
    }

    @DeleteMapping("/delete/{id}")
    public Long deleteArticle(@PathVariable("id") Long id) {
        return articleService.deleteArticleById(id);
    }
}
