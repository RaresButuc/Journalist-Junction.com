package com.journalistjunction.model;

import jakarta.persistence.*;
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

    private boolean readyToBePosted;

    private String title;

    private String shortDescription;

    @Lob
    private String body;

    @ManyToMany
    private List<Category> categories;

    private LocalDateTime postTime;

    private String location;

    private String language;

    @ManyToOne
    private User owner;

    @ManyToMany
    private List<User> contributors;

    @ManyToMany
    private List<User> rejectedWorkers;

    @OneToMany
    private List<Photo> photos;

    @OneToMany(mappedBy = "to")
    private List<Comment> comments;

    private Long views;
}

