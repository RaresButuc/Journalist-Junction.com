package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn
    private User user;

    @ManyToOne
    @JsonBackReference("parent-reference")
    private Comment parent;

    @ManyToOne
    @JsonBackReference("main-reference")
    private Comment mainComment;

    @OneToMany(mappedBy = "parent", orphanRemoval = true)
    @JsonManagedReference("parent-reference")
    private List<Comment> parentChildren;

    @OneToMany(mappedBy = "mainComment", orphanRemoval = true)
    @JsonManagedReference("main-reference")
    private List<Comment> mainChildren;

    @ManyToOne
    @JoinColumn
    private Article article;

    @Embedded
    private ParentCommData parentCommData;

    @Column(length = 560)
    private String content;

    @ManyToMany
    private List<User> likers;

    @Column(name = "likes_count")
    private Long likes;

    private boolean edited;

    private LocalDateTime postTime;

    private String stringPostTime;

}
