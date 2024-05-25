package com.journalistjunction.service;

import com.journalistjunction.model.PhotosClasses.UserBackgroundPhoto;
import com.journalistjunction.model.User;
import com.journalistjunction.model.PhotosClasses.UserProfilePhoto;
import com.journalistjunction.repository.UserBackgroundPhotoRepository;
import com.journalistjunction.repository.UserProfilePhotoRepository;
import com.journalistjunction.repository.UserRepository;
import com.journalistjunction.s3.S3Buckets;
import com.journalistjunction.s3.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    private final UserProfilePhotoRepository userProfilePhotoRepository;
    private final UserBackgroundPhotoRepository userBackgroundPhotoRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));
    }

    public boolean isUserSubscriber(Long idCurrentUser, Long idSecondUser) {
        User currentUser = userRepository.findById(idCurrentUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));
        User secondUser = userRepository.findById(idSecondUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));

        return secondUser.getSubscribers().stream().anyMatch(e -> Objects.equals(e.getId(), currentUser.getId()));
    }

    public byte[] getUserProfilePhoto(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));

        if (user.getProfilePhoto() == null) {
            return null;
        }

        return s3Service.getObject(s3Buckets.getCustomer(), "%s/%s_Profile_Image".formatted(id, id));
    }

    public byte[] getUserBackgroundPhoto(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));

        if (user.getProfileBackgroundPhoto() == null) {
            return null;
        }

        return s3Service.getObject(s3Buckets.getCustomer(), "%s/%s_Background_Image".formatted(id, id));
    }

    public void subscribeOrUnsubscribe(Long idCurrentUser, Long idSecondUser, String command) {
        User currentUser = userRepository.findById(idCurrentUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));
        User secondUser = userRepository.findById(idSecondUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));

        switch (command) {
            case "subscribe" -> {
                if (!isUserSubscriber(idCurrentUser, idSecondUser) && !idCurrentUser.equals(idSecondUser)) {
                    currentUser.getSubscribedTo().add(secondUser);
                    secondUser.getSubscribers().add(currentUser);
                } else {
                    throw new IllegalStateException("User is already subscribed or trying to subscribe to themselves!");
                }
            }
            case "unsubscribe" -> {
                if (isUserSubscriber(idCurrentUser, idSecondUser) && !idCurrentUser.equals(idSecondUser)) {
                    currentUser.getSubscribedTo().remove(secondUser);
                    secondUser.getSubscribers().remove(currentUser);
                } else {
                    throw new IllegalStateException("User is not subscribed or trying to unsubscribe from themselves!");
                }
            }
            default -> throw new IllegalStateException("Invalid command: " + command);
        }
        userRepository.save(currentUser);
        userRepository.save(secondUser);
    }

    public int subscribersCount(Long idUser) {
        return userRepository.findById(idUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"))
                .getSubscribers()
                .size();
    }

    public void updateUserById(User updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (updatedUser == null) {
            throw new IllegalArgumentException("Updated user data cannot be null");
        }

        User userFromDb = (User) auth.getPrincipal();

        if (userFromDb.getName().isBlank() || userFromDb.getPhoneNumber().isBlank() || userFromDb.getLocation().getCountry().isBlank() || userFromDb.getShortAutoDescription().isBlank()) {
            throw new IllegalArgumentException("All Fields Should Be Completed!");
        }
        userFromDb.setName(updatedUser.getName());
        userFromDb.setPhoneNumber(updatedUser.getPhoneNumber());
        userFromDb.setLocation(updatedUser.getLocation());
        userFromDb.setShortAutoDescription(updatedUser.getShortAutoDescription());
        userRepository.save(userFromDb);
    }

    public void updateUserProfilePhoto(MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        UserProfilePhoto userProfilePhoto = new UserProfilePhoto();

        if (user.getProfilePhoto() == null) {
            userProfilePhoto.setUser(user);
            userProfilePhoto.setBucket(s3Buckets.getCustomer());
            userProfilePhoto.setKey("%s/%s_Profile_Image".formatted(user.getId(), user.getId()));

            user.setProfilePhoto(userProfilePhoto);

            userProfilePhotoRepository.save(userProfilePhoto);
            userRepository.save(user);
        }

        s3Service.putObject(s3Buckets.getCustomer(), "%s/%s_Profile_Image".formatted(user.getId(), user.getId()), file.getBytes());
    }

    public void updateUserBackgroundPhoto(MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        UserBackgroundPhoto userBackgroundPhoto = new UserBackgroundPhoto();

        if (user.getProfileBackgroundPhoto() == null) {
            userBackgroundPhoto.setUser(user);
            userBackgroundPhoto.setBucket(s3Buckets.getCustomer());
            userBackgroundPhoto.setKey("%s/%s_Background_Image".formatted(user.getId(), user.getId()));

            user.setProfileBackgroundPhoto(userBackgroundPhoto);

            userBackgroundPhotoRepository.save(userBackgroundPhoto);
            userRepository.save(user);
        }

        s3Service.putObject(s3Buckets.getCustomer(), "%s/%s_Background_Image".formatted(user.getId(), user.getId()), file.getBytes());
    }

    public void deleteUserProfilePhoto() throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (user.getProfilePhoto() == null) {
            return;
        } else {
            user.setProfilePhoto(null);
            s3Service.deleteAnObject(s3Buckets.getCustomer(), "%s/%s_Profile_Image".formatted(user.getId(), user.getId()));
        }

        userRepository.save(user);
    }

    public void deleteUserBackgroundPhoto() throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (user.getProfileBackgroundPhoto() == null) {
            return;
        } else {
            user.setProfileBackgroundPhoto(null);
            s3Service.deleteAnObject(s3Buckets.getCustomer(), "%s/%s_Background_Image".formatted(user.getId(), user.getId()));
        }

        userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }


}
