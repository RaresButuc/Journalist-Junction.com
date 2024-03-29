package com.journalistjunction.repository;

import com.journalistjunction.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findAllByPublishedIsTrue();

    List<Article> findAllByOwnerId(Long id);
}
