package com.journalistjunction.model.PhotosClasses;

import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public class Photo {

    @NotNull
    @NotBlank
    private String bucket;

    @NotNull
    @NotBlank
    private String key;

}
