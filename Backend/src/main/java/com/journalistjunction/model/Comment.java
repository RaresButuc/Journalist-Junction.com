package com.journalistjunction.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Arrays;
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
    private Comment parent;

    @OneToMany(mappedBy = "parent")
    private List<Comment> children;

    @ManyToOne
    @JoinColumn
    private Article article;

    @Column(length = 560)
    private String content;

    @ManyToMany
    private List<User> likers;

    @Column(name = "likes_count")
    private Long likes;

    @Column(name = "replies_count")
    private Long repliesCount;

    private boolean edited;

    private LocalDateTime postTime;

    private String stringPostTime;

}
