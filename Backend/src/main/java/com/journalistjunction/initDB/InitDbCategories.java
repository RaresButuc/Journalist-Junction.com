package com.journalistjunction.initDB;

import com.journalistjunction.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.journalistjunction.model.Category;

import java.util.*;

@Service
public class InitDbCategories {
    private final CategoryRepository categoryRepository;

    @Autowired
    public InitDbCategories(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public void seedDBCategory() {
        Category fashion = Category.builder().nameOfCategory("fashion").build();
        Category travel = Category.builder().nameOfCategory("travel").build();
        Category sports = Category.builder().nameOfCategory("sports").build();
        Category crafts = Category.builder().nameOfCategory("crafts").build();
        Category health = Category.builder().nameOfCategory("health").build();
        Category books = Category.builder().nameOfCategory("books").build();
        Category music = Category.builder().nameOfCategory("music").build();
        Category tech = Category.builder().nameOfCategory("tech").build();
        Category home = Category.builder().nameOfCategory("home").build();
        Category art = Category.builder().nameOfCategory("art").build();

        categoryRepository.saveAllAndFlush(List.of(tech, fashion, travel, books, sports, home, art, music, crafts, health));
    }
}
