package com.journalistjunction.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    private String actualPassword;
    private String newPassword;
}
