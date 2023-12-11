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

    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable("id") Long id) {
        return articleService.getArticleById(id);
    }

    @PostMapping
    public void postNewArticle(Article article) {
        articleService.addArticle(article);
    }

    @PutMapping("/{id}")
    public void editArticle(@PathVariable("id") Long id, Article articleEdited) {
        articleService.updateArticleById(id, articleEdited);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable("id") Long id) {
        articleService.deleteArticleById(id);
    }
}
