package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.journalistjunction.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String name;

    private String email;

    private String password;

    private String phoneNumber;

    @JsonIgnore
    @ManyToMany(mappedBy = "contributors")
    private List<Article> articlesContributed;

    @JsonIgnore
    @OneToMany(mappedBy = "owner")
    private List<Article> articlesOwned;

    @JsonIgnore
    @ManyToMany(mappedBy = "rejectedWorkers")
    private List<Article> articlesRejected;

    @JsonIgnore
    @OneToMany
    private List<User> subscribers;

    @JsonIgnore
    @OneToMany
    private List<User> subscribedTo;

    @ElementCollection
    private List<Notification> notifications;
}
