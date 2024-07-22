package com.journalistjunction.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class ParentCommData {

    private Long parent_data_id;

    private String name;
}
