package com.journalistjunction.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class Photo {

    @NotNull
    @NotBlank
    private String bucket;

    @NotNull
    @NotBlank
    private String key;

}
