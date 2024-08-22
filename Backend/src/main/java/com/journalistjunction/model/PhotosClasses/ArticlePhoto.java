package com.journalistjunction.model.PhotosClasses;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.journalistjunction.model.Article;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "article_photos")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class ArticlePhoto extends Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @NotBlank
    private boolean isThumbnail;

    @NotNull
    @NotBlank
    @ManyToOne
    @JsonIgnore
    private Article article;

    public ArticlePhoto(String bucket, String key, boolean isThumbnail, Article article) {
        super(bucket, key);
        this.isThumbnail = isThumbnail;
        this.article = article;
    }

    @Override
    public String toString() {
        return "ArticlePhoto{" +
                "id=" + id +
                ", isThumbnail=" + isThumbnail +
                ", article=" + article +
                '}';
    }
}
