package com.journalistjunction.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.journalistjunction.enums.Role;
import com.journalistjunction.model.PhotosClasses.UserBackgroundPhoto;
import com.journalistjunction.model.PhotosClasses.UserProfilePhoto;
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
    @Column(length = 10)
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

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private UserBackgroundPhoto profileBackgroundPhoto;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private UserProfilePhoto profilePhoto;

    @Embedded
    private SocialMedia socialMedia;

    @JsonIgnore
    @ManyToMany(mappedBy = "contributors")
    private List<Article> articlesContributed;

    @JsonIgnore
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    private List<Article> articlesOwned;

    @JsonIgnore
    @OneToMany
    private List<User> subscribers;

    @JsonIgnore
    @OneToMany
    private List<User> subscribedTo;

    @OneToMany(mappedBy = "to", fetch = FetchType.EAGER)
    private List<Notification> notifications;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Comment> comments;

    @JsonIgnore
    @ManyToMany
    private List<Comment> likedComments;

    @OneToMany(mappedBy = "user", orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Preference> preferences;

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
