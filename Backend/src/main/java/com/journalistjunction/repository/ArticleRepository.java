package com.journalistjunction.repository;

import com.journalistjunction.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findAllByOwnerId(Long id);

    List<Article> findAllByPublishedIsTrue();

    List<Article> findAllByPublishedIsTrueAndBodyContainingIgnoreCase(String input);

    List<Article> findAllByBodyContainingIgnoreCase(String input);
}
