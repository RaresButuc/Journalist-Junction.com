package com.journalistjunction.controller;

import com.journalistjunction.model.Article;
import com.journalistjunction.service.ArticleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void editArticle(@PathVariable("id") Long id, @RequestBody Article articleEdited) {
        articleService.updateArticleById(id, articleEdited);
    }

    @PutMapping("/{id}/{decision}")
    public void publicOrNonPublicArticle(@PathVariable("id") Long id, @PathVariable("decision") String decision) {
        articleService.publicOrNonpublicArticle(id, decision);
    }

    @PutMapping("/{id}/{username}/{decision}")
    public void addOrDeleteContributor(@PathVariable("id") Long id, @PathVariable("username") String username, @PathVariable("decision") String decision) {
        articleService.addOrDeleteContributor(id, username, decision);
    }

    @PutMapping("/removerejection/{id}/{userId}")
    public void removeRejection(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        articleService.removeRejection(id, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable("id") Long id) {
        articleService.deleteArticleById(id);
    }
}
