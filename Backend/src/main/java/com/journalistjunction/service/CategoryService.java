package com.journalistjunction.service;

import com.journalistjunction.model.Category;
import com.journalistjunction.repository.CategoryRepository;

import java.util.List;

public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllTypesOfAds() {
        return categoryRepository.findAll();
    }

    public void addCategory(Category category) {
        categoryRepository.save(category);
    }

    public void deleteTypeOfAdById(Long id) {
        categoryRepository.deleteById(id);
    }
}
