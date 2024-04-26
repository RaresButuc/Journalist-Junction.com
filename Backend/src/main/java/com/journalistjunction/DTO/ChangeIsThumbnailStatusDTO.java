package com.journalistjunction.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChangeIsThumbnailStatusDTO {

    private Long id;
    private String newStatus;

    public boolean getNewStatusAsBoolean() {
        return Boolean.parseBoolean(newStatus);
    }

}
