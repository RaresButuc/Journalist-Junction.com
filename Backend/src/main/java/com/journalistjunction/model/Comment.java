package com.journalistjunction.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class Comment {

    @ManyToOne
    private User from;

    @Column(length = 1000)
    private String comment;

}
