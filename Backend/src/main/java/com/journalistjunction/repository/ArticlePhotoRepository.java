package com.journalistjunction.repository;

import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticlePhotoRepository extends JpaRepository<ArticlePhoto, Long> {
}
