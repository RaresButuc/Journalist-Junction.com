package com.journalistjunction.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class PhotoAndByte {

    @NotNull
    @NotBlank
    private Photo photo;

    @NotNull
    @NotBlank
    private byte[] bytes;

}
