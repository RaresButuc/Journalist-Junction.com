package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "languages")
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String languageNameEnglish;

    private String languageNameNative;

    private String cca2;

    @OneToMany(mappedBy = "language")
    @JsonIgnore
    private List<Article> articles;
}