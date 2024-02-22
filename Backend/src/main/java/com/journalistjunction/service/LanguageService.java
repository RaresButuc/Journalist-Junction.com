package com.journalistjunction.service;

import com.journalistjunction.model.Article;
import com.journalistjunction.model.Language;
import com.journalistjunction.repository.LanguageRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LanguageService {
    private final LanguageRepository languageRepository;

    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }

    public Language getLanguageById(Long id) {
        return languageRepository.findById(id).orElse(null);
    }

    public void addLanguage(Language language) {
        languageRepository.save(language);
    }

    public void updateLanguageById(Long id, Language newLanguage) {
        Language language = languageRepository.findById(id).orElse(null);
        assert language != null;

        language.setLanguage(newLanguage.getLanguage());

        languageRepository.save(language);
    }

    public void deleteLanguage(Long id) {
        languageRepository.deleteById(id);
    }
}
