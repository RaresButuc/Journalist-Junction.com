package com.journalistjunction;

import com.journalistjunction.initDB.InitDbCategories;
import com.journalistjunction.initDB.InitDbLanguages;
import com.journalistjunction.initDB.InitDbLocations;
import com.journalistjunction.s3.S3Service;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

@SpringBootApplication
@AllArgsConstructor
public class MainApplication {
    InitDbCategories initDbCategories;
    InitDbLanguages initDbLanguages;
    InitDbLocations initDbLocations;

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    @PostConstruct
    public void seedDatabase() {
        initDbCategories.seedDBCategory();
        initDbLanguages.seedDBLanguage();
        initDbLocations.seedDBLocations();
    }
}