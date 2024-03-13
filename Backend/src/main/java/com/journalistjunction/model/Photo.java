package com.journalistjunction.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class Photo {

    private String bucket;

    private String key;

    private String description;
}
