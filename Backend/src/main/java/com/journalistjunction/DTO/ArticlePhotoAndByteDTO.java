package com.journalistjunction.DTO;

import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class ArticlePhotoAndByteDTO {

    @NotNull
    @NotBlank
    private ArticlePhoto articlePhoto;

    @NotNull
    @NotBlank
    private byte[] bytes;

}
