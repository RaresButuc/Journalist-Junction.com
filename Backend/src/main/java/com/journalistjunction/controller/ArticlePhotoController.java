package com.journalistjunction.controller;

import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import com.journalistjunction.service.ArticlePhotoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/article-photo")
public class ArticlePhotoController {

    private final ArticlePhotoService articlePhotoService;

    @GetMapping("/{id}")
    public ArticlePhoto getArticleById(@PathVariable("id") Long id) {
        return articlePhotoService.getArticlePhotoById(id);
    }
}
