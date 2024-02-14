package com.journalistjunction.controller;

import com.journalistjunction.model.Article;
import com.journalistjunction.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/article")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

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
    public void postNewArticle(@RequestBody Article article) {
        articleService.addArticle(article);
    }

    @PutMapping("/{id}")
    public void editArticle(@PathVariable("id") Long id, @RequestBody Article articleEdited) {
        articleService.updateArticleById(id, articleEdited);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable("id") Long id) {
        articleService.deleteArticleById(id);
    }
}
