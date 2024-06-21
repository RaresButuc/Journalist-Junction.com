package com.journalistjunction.DTO;

import com.journalistjunction.model.Article;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticleAndThumbnailDTO {

    private Article article;

    private byte[] thumbnail;

}
