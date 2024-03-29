package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.journalistjunction.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotNull
    @NotBlank
    @Enumerated(EnumType.STRING)
    private Role role;

    @NotNull
    @NotBlank
    private String name;

    @NotNull
    @NotBlank
    private String email;

    @NotNull
    @NotBlank
    private String password;

    @NotNull
    @NotBlank
    private String phoneNumber;

    @NotNull
    @NotBlank
    @ManyToOne
    @JoinColumn
    private Location location;

    @NotNull
    @NotBlank
    @Column(length = 500)
    private String shortAutoDescription;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "bucket", column = @Column(name = "background_bucket")),
            @AttributeOverride(name = "description", column = @Column(name = "background_description")),
            @AttributeOverride(name = "key", column = @Column(name = "background_key"))
    })
    private Photo profileBackgroundPhoto;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "bucket", column = @Column(name = "profile_bucket")),
            @AttributeOverride(name = "description", column = @Column(name = "profile_description")),
            @AttributeOverride(name = "key", column = @Column(name = "profile_key"))
    })
    private Photo profilePhoto;

    @JsonIgnore
    @ManyToMany(mappedBy = "contributors")
    private List<Article> articlesContributed;

    @JsonIgnore
    @OneToMany(mappedBy = "owner",fetch = FetchType.EAGER)
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
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
