package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.journalistjunction.model.PhotosClasses.ArticlePhoto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean published;

    private String title;

    @Column(length = 350)
    private String thumbnailDescription;

    @Column(columnDefinition = "TEXT")
    private String body;

    @ManyToMany
    @JoinTable
    @Size(min = 1, max = 10)
    private List<Category> categories;

    private LocalDateTime postTime;

    @ManyToOne
    @JoinColumn
    private Location location;

    @ManyToOne
    @JoinColumn
    private Language language;

    @ManyToOne
    @JoinColumn
    private User owner;

    @ManyToMany
    @JoinTable
    private List<User> contributors;

    @ManyToMany
    @JoinTable
    private List<User> rejectedWorkers;

    @OneToMany
    @Size(max = 10)
    private List<ArticlePhoto> photos;

    @JsonIgnore
    @OneToMany(mappedBy = "to")
    private List<Comment> comments;

    private Long views;
}

