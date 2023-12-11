package com.journalistjunction.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.OneToMany;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class Notification {

    private Long idUser;

    private String message;
}
