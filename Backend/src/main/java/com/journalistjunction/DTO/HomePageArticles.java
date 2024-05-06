package com.journalistjunction.DTO;

import com.journalistjunction.model.Article;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HomePageArticles {
    String category;

    List<Article> articles;

    boolean isListLongerThan5;
}
