package com.journalistjunction.service;

import com.journalistjunction.model.Photo;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.UserRepository;
import com.journalistjunction.s3.S3Buckets;
import com.journalistjunction.s3.S3Service;
import lombok.AllArgsConstructor;
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

    public byte[] getUserProfileImage(Long id) {
        userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));

        return s3Service.getObject(s3Buckets.getCustomer(), "%s/%s_Profile_Image".formatted(id, id));
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

    public void updateUserById(Long id, User updatedUser) {
        if (updatedUser == null) {
            throw new IllegalArgumentException("Updated user data cannot be null");
        }

        User userFromDb = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));

        userFromDb.setName(updatedUser.getName());
        userFromDb.setEmail(updatedUser.getEmail());
        userFromDb.setPhoneNumber(updatedUser.getPhoneNumber());
        userFromDb.setLocation(updatedUser.getLocation());
        userFromDb.setShortAutoDescription(updatedUser.getShortAutoDescription());
        userRepository.save(userFromDb);
    }

    public void uploadUserProfileImage(Long id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));

        s3Service.putObject(s3Buckets.getCustomer(), "%s/%s_Profile_Image".formatted(id, id), file.getBytes());

        if (user.getProfilePhoto() != null) {
            user.setProfilePhoto(new Photo(0L, s3Buckets.getCustomer(), "%s/%s_Profile_Image".formatted(id, id), "%s's Profile Image".formatted(user.getName())));
        }

        userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }


}
