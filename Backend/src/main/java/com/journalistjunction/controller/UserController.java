package com.journalistjunction.controller;

import com.journalistjunction.DTO.ChangePasswordRequest;
import com.journalistjunction.auth.AuthenticationRequest;
import com.journalistjunction.auth.AuthenticationResponse;
import com.journalistjunction.auth.AuthenticationService;
import com.journalistjunction.auth.RegisterRequest;
import com.journalistjunction.model.Preference;
import com.journalistjunction.model.User;
import com.journalistjunction.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;

    private final AuthenticationService service;


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable("id") Long id) {
        return userService.getUserById(id);
    }

    @GetMapping(value = "/email/{email}")
    public User getUserByEmail(@PathVariable("email") String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping(value = "/issubscribed/{idCurrentUser}/{idSecondUser}")
    public boolean isCurrentUserSubscribed(@PathVariable("idCurrentUser") Long idCurrentUser, @PathVariable("idSecondUser") Long idSecondUser) {
        return userService.isUserSubscriber(idCurrentUser, idSecondUser);
    }

    @GetMapping("/subscount/{user}")
    public int userSubsCount(@PathVariable("user") Long user) {
        return userService.subscribersCount(user);
    }

    @GetMapping(value = "/get-profile-photo/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] getUserProfilePhoto(@PathVariable("id") Long id) {
        return userService.getUserProfilePhoto(id);
    }

    @GetMapping(value = "/get-background-photo/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] getUserBackgroundPhoto(@PathVariable("id") Long id) {
        return userService.getUserBackgroundPhoto(id);
    }

    @GetMapping(value = "/preferences")
    public List<Preference> getUserPreferences() {
        return userService.getUserPreferences();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PutMapping(value = "/set-profile-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadUserProfilePhoto(@RequestParam("file") MultipartFile file) throws IOException {
        userService.updateUserProfilePhoto(file);

        return ResponseEntity.ok("Image Successfully Posted!");
    }

    @PutMapping(value = "/set-background-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadUserBackgroundePhoto(@RequestParam("file") MultipartFile file) throws IOException {
        userService.updateUserBackgroundPhoto(file);

        return ResponseEntity.ok("Image Successfully Posted!");
    }

    @PutMapping(value = "/delete-profile-photo")
    public void deleteUserProfilePhoto() throws IOException {
        userService.deleteUserProfilePhoto();
    }

    @PutMapping(value = "/delete-background-photo")
    public void deleteUserBackgroundPhoto() throws IOException {
        userService.deleteUserBackgroundPhoto();
    }

    @PutMapping("/edit-user")
    public ResponseEntity<String> editUser(@RequestBody User user) {
        userService.updateUserById(user);

        return ResponseEntity.ok("New Profile Information Saved!");
    }

    @PutMapping("/{action}/{idCurrentUser}/{idSecondUser}")
    public ResponseEntity<String> subscribeOrUnsubscribe(@PathVariable("action") Long action, @PathVariable("idCurrentUser") Long idCurrentUser, @PathVariable("idSecondUser") Long idSecondUser) {
        userService.subscribeOrUnsubscribe(idCurrentUser, idSecondUser, action);

        return ResponseEntity.ok("");
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> setPassword(@PathVariable("id") Long id, @RequestBody ChangePasswordRequest changePasswordRequest) {
        userService.changePasswordAndVerifyOldPassword(id, changePasswordRequest.getNewPassword(), changePasswordRequest.getActualPassword());

        return ResponseEntity.ok("Your Password Was Successfully Updated!");
    }

    @PutMapping("/forgotten-password")
    public ResponseEntity<String> forgottenPassword(@RequestParam String email) {
        userService.forgottenPassword(email);

        return ResponseEntity.ok("Check Your Email For The `Password Update` Form!");
    }

    @PutMapping("/set-password")
    public ResponseEntity<String> setPassword(@RequestParam String email, @RequestParam String uuid, @RequestHeader String newPassword) {
        userService.setPassword(email, newPassword, uuid);

        return ResponseEntity.ok("Your Password Was Successfully Updated!");
    }

    @PutMapping(value = "/update-preferences/{id}")
    public void updateUserPreferences(@PathVariable("id") Long id) {
        userService.updateUserPreferences(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User ID#" + id + " Was Successfully Deleted!!");
    }
}
