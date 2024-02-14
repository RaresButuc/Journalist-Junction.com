package com.journalistjunction.service;

import com.journalistjunction.model.Photo;
import com.journalistjunction.repository.PhotoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;


    public List<Photo> getAllPhotos() {
        return photoRepository.findAll();
    }

    public void addPhoto(Photo photo) {
        photoRepository.save(photo);
    }

    public void deletePhotoById(Long id) {
        photoRepository.deleteById(id);
    }
}
