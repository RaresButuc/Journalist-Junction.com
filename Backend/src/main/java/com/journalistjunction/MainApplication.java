package com.journalistjunction;

import com.journalistjunction.initDB.InitDbCategories;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MainApplication {
    InitDbCategories initDbCategories;

    @Autowired
    public MainApplication(InitDbCategories initDbCategories) {
        this.initDbCategories = initDbCategories;
    }

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    @PostConstruct
    public void seedDatabase() {
        initDbCategories.seedDBCategory();
    }
}