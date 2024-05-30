package com.journalistjunction.repository;

import com.journalistjunction.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findAllByOwnerIdOrderByPostTimeDesc(Long id);

    List<Article> findAllByPublishedIsTrueOrderByPostTimeDesc();

    List<Article> findAllByPublishedIsTrueAndLocation_CountryOrderByPostTimeDesc(String country);

    List<Article> findAllByPublishedIsTrueAndLocation_CountryAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(String country,String language);

    List<Article> findAllByPublishedIsTrueAndLocation_CountryAndLanguage_LanguageNameEnglishAndTitleContainingIgnoreCaseOrderByPostTimeDesc(String country,String language,String input);

    List<Article> findAllByPublishedIsTrueAndTitleContainingIgnoreCaseOrderByPostTimeDesc(String input);

    List<Article> findAllByPublishedIsTrueAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(String language);

    List<Article> findAllByPublishedIsTrueAndAndTitleContainingIgnoreCaseAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(String input,String language);

    List<Article> findAllByPublishedIsTrueAndLocation_CountryAndTitleContainingIgnoreCaseOrderByPostTimeDesc(String country, String input);

    List<Article> findAllByPublishedIsTrueAndLocation_CountryAndTitleContainingIgnoreCaseAndLanguage_LanguageNameEnglishOrderByPostTimeDesc(String country, String input, String language);
}
