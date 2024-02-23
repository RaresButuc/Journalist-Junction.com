package com.journalistjunction.initDB;

import com.journalistjunction.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.journalistjunction.model.Category;

import java.util.*;

@Service
@AllArgsConstructor
public class InitDbCategories {

    private final CategoryRepository categoryRepository;

    public void seedDBCategory() {
        List<Category> categories = List.of(
                Category.builder().nameOfCategory("fashion").build(),
                Category.builder().nameOfCategory("travel").build(),
                Category.builder().nameOfCategory("sports").build(),
                Category.builder().nameOfCategory("crafts").build(),
                Category.builder().nameOfCategory("health").build(),
                Category.builder().nameOfCategory("books").build(),
                Category.builder().nameOfCategory("music").build(),
                Category.builder().nameOfCategory("tech").build(),
                Category.builder().nameOfCategory("home").build(),
                Category.builder().nameOfCategory("art").build()
        );

        categoryRepository.saveAllAndFlush(categories);
    }
}
