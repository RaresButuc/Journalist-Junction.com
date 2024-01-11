package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(length = 350)
    private String shortDescription;

    @Lob
    private String body;

    @ManyToMany
    @JoinTable
    private List<Category> categories;

    private LocalDateTime postTime;

    private String location;

    private String language;

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
    private List<Photo> photos;

    @JsonIgnore
    @OneToMany(mappedBy = "to")
    private List<Comment> comments;

    private Long views;
}

