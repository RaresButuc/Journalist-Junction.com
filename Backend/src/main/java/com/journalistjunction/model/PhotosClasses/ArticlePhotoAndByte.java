package com.journalistjunction.model.PhotosClasses;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class ArticlePhotoAndByte {

    @NotNull
    @NotBlank
    private ArticlePhoto articlePhoto;

    @NotNull
    @NotBlank
    private byte[] bytes;

}
