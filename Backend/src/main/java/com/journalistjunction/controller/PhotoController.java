package com.journalistjunction.controller;

import com.journalistjunction.model.Notification;
import com.journalistjunction.model.Photo;
import com.journalistjunction.service.PhotoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/photo")
public class PhotoController {

    private final PhotoService photoService;

    @GetMapping
    public List<Photo> getAllPhotos() {
        return photoService.getAllPhotos();
    }

    @PostMapping
    public void postNewPhoto(@RequestBody Photo photo) {
        photoService.addPhoto(photo);
    }

    @DeleteMapping("/{id}")
    public void deletePhoto(@PathVariable("id") Long id) {
        photoService.deletePhotoById(id);
    }
}
