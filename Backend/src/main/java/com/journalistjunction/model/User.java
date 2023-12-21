package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.journalistjunction.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String name;

    private String email;

    private String password;

    private String phoneNumber;

    private String country;

    private String shortAutoDescription;

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

    @JsonIgnore
    @OneToMany(mappedBy = "to")
    private List<Notification> notifications;

    @JsonIgnore
    @OneToMany(mappedBy = "from")
    private List<Comment> comments;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }
}
