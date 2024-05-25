package com.journalistjunction.repository;

import com.journalistjunction.model.PhotosClasses.UserBackgroundPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBackgroundPhotoRepository extends JpaRepository<UserBackgroundPhoto,Long> {
}
