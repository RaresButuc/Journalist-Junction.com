package com.journalistjunction.controller;

import com.journalistjunction.model.Article;
import com.journalistjunction.service.ArticleService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok("Article ID#" + id + " Was Successfully Edited and Saved!");
    }

    @PutMapping("/{id}/{decision}")
    public ResponseEntity<String> publicOrNonPublicArticle(@PathVariable("id") Long id, @PathVariable("decision") String decision) {
        articleService.publicOrNonpublicArticle(id, decision);

        String message = decision.equals("true") ?
                "Article ID#" + id + " Was Successfully Published!" :
                "Article ID#" + id + " Was Successfully UnPublished!";
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{id}/{username}/{decision}")
    public ResponseEntity<String> addOrDeleteContributor(@PathVariable("id") Long id, @PathVariable("username") String username, @PathVariable("decision") String decision) {
        articleService.addOrDeleteContributor(id, username, decision);

        String message = decision.equals("add") ?
                "User " + username + " Was Successfully Set As a Contributor for Article ID#" + id :
                "User " + username + " Was Successfully Removed As a Contributor for Article ID#" + id;
        return ResponseEntity.ok(message);
    }

    @PutMapping("/removerejection/{id}/{userId}")
    public ResponseEntity<String> removeRejection(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        articleService.removeRejection(id, userId);
        return ResponseEntity.ok("Article ID#" + userId + "Was Removed from the `Rejected Contributors` List and Can Be Added Again as a Contributor!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable("id") Long id) {
        articleService.deleteArticleById(id);
        return ResponseEntity.ok("Article ID#" + id + "Was Successfully Deleted!");
    }
}
