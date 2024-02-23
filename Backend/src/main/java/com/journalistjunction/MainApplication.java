package com.journalistjunction;

import com.journalistjunction.initDB.InitDbCategories;
import com.journalistjunction.initDB.InitDbLanguages;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@AllArgsConstructor
public class MainApplication {
    InitDbCategories initDbCategories;
    InitDbLanguages initDbLanguages;

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    @PostConstruct
    public void seedDatabase() {
        initDbCategories.seedDBCategory();
        initDbLanguages.seedDBLanguage();
    }
}