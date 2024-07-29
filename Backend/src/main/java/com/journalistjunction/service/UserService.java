package com.journalistjunction.service;

import com.journalistjunction.model.Article;
import com.journalistjunction.model.ChangePasswordLink;
import com.journalistjunction.model.PhotosClasses.UserBackgroundPhoto;
import com.journalistjunction.model.Preference;
import com.journalistjunction.model.User;
import com.journalistjunction.model.PhotosClasses.UserProfilePhoto;
import com.journalistjunction.repository.*;
import com.journalistjunction.s3.S3Buckets;
import com.journalistjunction.s3.S3Service;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    private final MailService mailService;
    private final ArticleService articleService;
    private final PasswordEncoder passwordEncoder;
    private final PreferencesRepository preferencesRepository;
    private final ChangePasswordLinkService changePasswordLinkService;
    private final UserProfilePhotoRepository userProfilePhotoRepository;
    private final ChangePasswordLinkRepository changePasswordLinkRepository;
    private final UserBackgroundPhotoRepository userBackgroundPhotoRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("No User Found!"));
    }

    public boolean isUserSubscriber(Long idCurrentUser, Long idSecondUser) {
        User currentUser = getUserById(idCurrentUser);
        User secondUser = getUserById(idSecondUser);

        return secondUser.getSubscribers().stream().anyMatch(e -> Objects.equals(e.getId(), currentUser.getId()));
    }

    public byte[] getUserProfilePhoto(Long userId) {
        User user = getUserById(userId);

        if (user.getProfilePhoto() == null) {
            return null;
        }

        return s3Service.getObject(s3Buckets.getCustomer(), "%s/%s_Profile_Image".formatted(userId, userId));
    }

    public byte[] getUserBackgroundPhoto(Long userId) {
        User user = getUserById(userId);

        if (user.getProfileBackgroundPhoto() == null) {
            return null;
        }

        return s3Service.getObject(s3Buckets.getCustomer(), "%s/%s_Background_Image".formatted(userId, userId));
    }

    public List<Preference> getUserPreferences() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();

        return user.getPreferences().stream().sorted((a, b) -> b.getCategoryReadCounter().compareTo(a.getCategoryReadCounter())).toList();
    }

    public void updateUserPreferences(Long articleId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();
        Article article = articleService.getArticleById(articleId);

        article.getCategories().forEach(e -> {
            boolean isPreferenceAlready = user.getPreferences().stream().anyMatch(i -> i.getCategory().equals(e.getNameOfCategory()));
            if (isPreferenceAlready) {
                Optional<Preference> preferenceOptional = user.getPreferences().stream().filter(f -> f.getCategory().equals(e.getNameOfCategory())).findFirst();

                if (preferenceOptional.isPresent()) {
                    Preference preference = preferenceOptional.get();
                    preference.setCategoryReadCounter(preference.getCategoryReadCounter() + 1);
                    preferencesRepository.save(preference);
                }
            } else {
                preferencesRepository.save(new Preference(0L, e.getNameOfCategory(), 1L, user));
            }
        });
        userRepository.save(user);
    }

    public void forgottenPassword(String email) {
        try {
            mailService.sendSetPasswordEmail(email);
        } catch (MessagingException e) {
            throw new IllegalStateException("An Unexpected Error Has Occurred!");
        }
    }

    public void setPassword(String email, String newPassword, String uuid) {
        User user = getUserByEmail(email);
        ChangePasswordLink changePasswordLink = changePasswordLinkRepository.findByUuid(uuid);

        if (changePasswordLink.getEmail().equals(email) && !changePasswordLinkService.isExpiredByTime(uuid) && !changePasswordLink.isExpired()) {
            changePasswordLink.setExpired(true);
            user.setPassword(passwordEncoder.encode(newPassword));

            userRepository.save(user);
            changePasswordLinkRepository.save(changePasswordLink);

        } else {
            throw new IllegalStateException("Error! Request a 'New Password Change Request' by Email and Try again!");
        }
    }

    public void subscribeOrUnsubscribe(Long idCurrentUser, Long idSecondUser, Long command) {
        User currentUser = getUserById(idCurrentUser);
        User secondUser = getUserById(idSecondUser);

        if (command == 1L) {
            if (!isUserSubscriber(idCurrentUser, idSecondUser) && !idCurrentUser.equals(idSecondUser)) {
                currentUser.getSubscribedTo().add(secondUser);
                secondUser.getSubscribers().add(currentUser);
            } else {
                throw new IllegalStateException("User is already subscribed or trying to subscribe to themselves!");
            }
        } else if (command == 0L) {
            if (isUserSubscriber(idCurrentUser, idSecondUser) && !idCurrentUser.equals(idSecondUser)) {
                currentUser.getSubscribedTo().remove(secondUser);
                secondUser.getSubscribers().remove(currentUser);
            } else {
                throw new IllegalStateException("User is not subscribed or trying to unsubscribe from themselves!");
            }
        } else {
            throw new IllegalArgumentException("Invalid command!");
        }

        userRepository.save(currentUser);
        userRepository.save(secondUser);
    }

    public int subscribersCount(Long userId) {
        return getUserById(userId)
                .getSubscribers()
                .size();
    }

    public void updateUserById(User updatedUser) {
        if (updatedUser == null) {
            throw new IllegalArgumentException("Updated user data cannot be null");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();

        if (updatedUser.getName().isBlank() || updatedUser.getPhoneNumber().isBlank() || updatedUser.getLocation().getId() == null || updatedUser.getShortAutoDescription().isBlank()) {
            throw new IllegalArgumentException("All Fields Should Be Completed!");
        }
        user.setName(updatedUser.getName());
        user.setLocation(updatedUser.getLocation());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setSocialMedia(updatedUser.getSocialMedia());
        user.setShortAutoDescription(updatedUser.getShortAutoDescription());
        userRepository.save(user);
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

    public void changePasswordAndVerifyOldPassword(Long userId, String newPassword, String actualPassword) {
        User user = getUserById(userId);

        if (passwordEncoder.matches(actualPassword, user.getPassword()) && !passwordEncoder.matches(newPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else if (!passwordEncoder.matches(actualPassword, user.getPassword())) {
            throw new IllegalStateException("Fill The `Current Password` Input Correctly By Typing Your Actual Password!");
        } else if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalStateException("The New Password Shouldn't Be The Same As The Actual One!");
        } else {
            throw new IllegalStateException("An Error Has Occurred! Refresh The Page And Try Again");
        }
    }

    public void deleteUserById(Long userId) {
        userRepository.deleteById(userId);
    }
}
