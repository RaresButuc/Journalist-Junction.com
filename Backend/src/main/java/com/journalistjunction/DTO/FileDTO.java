package com.journalistjunction.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FileDTO {

    private String fileName;
    private String isThumbnail;

    public boolean getIsThumbnailAsBoolean() {
        return Boolean.parseBoolean(isThumbnail);
    }

    @Override
    public String toString() {
        return "FileDTO{" +
                "fileName='" + fileName + '\'' +
                ", isThumbnail='" + isThumbnail + '\'' +
                '}';
    }

}
