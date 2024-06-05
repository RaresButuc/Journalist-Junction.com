package com.journalistjunction.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class SocialMedia {

    @NotBlank
    private String facebook;

    @NotBlank
    private String instagram;

    @NotBlank
    private String x;

}
