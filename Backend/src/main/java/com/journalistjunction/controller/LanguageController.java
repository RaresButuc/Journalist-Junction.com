package com.journalistjunction.controller;

import java.util.*;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.AllArgsConstructor;
import com.journalistjunction.model.Language;
import com.journalistjunction.service.LanguageService;
import org.springframework.web.bind.annotation.*;


@RestController
@AllArgsConstructor
@RequestMapping(value = "/language")
public class LanguageController {
    private final LanguageService languageService;

    @GetMapping
    public List<Language> getAllLanguages() {
        return languageService.getAllLanguages();
    }

    @GetMapping("/{id}")
    public Language getLanguageById(@PathVariable("id") Long id) {
        return languageService.getLanguageById(id);
    }

    @PostMapping
    public void postLanguage(@RequestBody Language language) {
        languageService.addLanguage(language);
    }

    @PutMapping("/{id}")
    public void editLanguage(@PathVariable("id") Long id, @RequestBody Language language) {
        languageService.updateLanguageById(id, language);
    }

    @DeleteMapping("/{id}")
    public void deleteLanguage(@PathVariable("id") Long id) {
        languageService.deleteLanguage(id);
    }
}
