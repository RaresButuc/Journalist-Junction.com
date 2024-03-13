package com.journalistjunction.auth;

import com.journalistjunction.enums.Role;
import com.journalistjunction.model.Location;
import com.journalistjunction.model.Photo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String name;

    private String phoneNumber;

    private Role role;

    private String email;

    private String password;

    private Location location;

    private String shortAutoDescription;

    private Photo profilePhoto;
}
