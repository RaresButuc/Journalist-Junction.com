package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String country;

    private String cca2;

    @JsonIgnore
    @OneToMany(mappedBy = "location")
    private List<User> users;

    @JsonIgnore
    @OneToMany(mappedBy = "location")
    private List<Article> articles;
}
