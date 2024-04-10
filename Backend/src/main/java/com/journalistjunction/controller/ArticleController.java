package com.journalistjunction.controller;

import com.journalistjunction.model.Article;
import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.model.PhotosClasses.ArticlePhotoAndByte;
import com.journalistjunction.service.ArticleService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public List<Article> getAllReadyToBePostedArticles() {
        return articleService.getAllPostedArticles();
    }

    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable("id") Long id) {
        return articleService.getArticleById(id);
    }

    @GetMapping("/date/{id}")
    public String getArticleDateInString(@PathVariable("id") Long id) {
        return articleService.localDateTimeToString(id);
    }

    @GetMapping("/user/{id}")
    public List<Article> getAllArticlesByUser(@PathVariable("id") Long id) {
        return articleService.getArticlesByUserId(id);
    }

    @PostMapping
    public Article createNewArticle(@RequestBody Article article) {
        return articleService.createArticle(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editArticle(@PathVariable("id") Long id, @RequestBody Article articleEdited) {
        articleService.updateArticleById(id, articleEdited);
        return ResponseEntity.ok("Modifications Successfully Saved!");
    }

    @PutMapping("/{id}/{decision}")
    public ResponseEntity<String> publicOrNonPublicArticle(@PathVariable("id") Long id, @PathVariable("decision") String decision, @RequestBody Article currentVersion) {
        articleService.publishOrUnPublishArticle(id, decision, currentVersion);

        String message = decision.equals("true") ?
                "Congratulations! Your Article Was Successfully Published!" :
                "Your Article Was Successfully UnPublished!";
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{id}/{username}/{decision}")
    public ResponseEntity<String> addOrDeleteContributor(@PathVariable("id") Long id, @PathVariable("username") String username, @PathVariable("decision") String decision) {
        articleService.addOrDeleteContributor(id, username, decision);

        return ResponseEntity.ok("");
    }

    @PutMapping("/removerejection/{id}/{userId}")
    public ResponseEntity<String> removeRejection(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        articleService.removeRejection(id, userId);
        return ResponseEntity.ok("This User Was Removed from the `Rejected Contributors` List!");
    }

    @GetMapping(value = "/get-article-photos/{id}")
    public List<ArticlePhotoAndByte> getArticlePhotos(@PathVariable("id") Long id) {
        return articleService.getArticlePhotos(id);
    }

    @PutMapping(value = "/upload-article-photos/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadArticlePhotos(@RequestParam("files") List<MultipartFile> files, @PathVariable("id") Long id) throws IOException {
        articleService.uploadArticlePhotos(files, id);

        return ResponseEntity.ok("Images Successfully Posted!");
    }

    @PutMapping(value = "/delete-article-photos/{id}")
    public ResponseEntity<String> deleteArticlePhotos(@RequestBody List<ArticlePhoto> photos, @PathVariable("id") Long id) {
        articleService.deleteArticlePhotos(photos, id);

        return ResponseEntity.ok("Images Successfully Deleted!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable("id") Long id) {
        articleService.deleteArticleById(id);
        return ResponseEntity.ok("Article ID#" + id + "Was Successfully Deleted!");
    }
}
