package com.journalistjunction.controller;

import com.journalistjunction.auth.AuthenticationRequest;
import com.journalistjunction.auth.AuthenticationResponse;
import com.journalistjunction.auth.AuthenticationService;
import com.journalistjunction.auth.RegisterRequest;
import com.journalistjunction.model.User;
import com.journalistjunction.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(value = "/subscount/{user}")
    public int userSubsCount(@PathVariable("user") Long user) {
        return userService.subscribersCount(user);
    }

    @GetMapping(value = "/available/{user}")
    public boolean userIdExists(@PathVariable("user") Long user) {
        return userService.isUserIdAvailable(user);
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


    @PutMapping("/{id}")
    public ResponseEntity<String> editUser(@PathVariable("id") Long id, @RequestBody User user) {
        userService.updateUserById(id, user);
        return ResponseEntity.ok("User ID#" + id + " Was Successfully Edited and Saved!");
    }

    @PutMapping("/{action}/{idCurrentUser}/{idSecondUser}")
    public ResponseEntity<String> subscribeOrUnsubscribe(@PathVariable("action") String action, @PathVariable("idCurrentUser") Long idCurrentUser, @PathVariable("idSecondUser") Long idSecondUser) {
        userService.subscribeOrUnsubscribe(idCurrentUser, idSecondUser, action);

        return ResponseEntity.ok("");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User ID#" + id + " Was Successfully Deleted!!");
    }
}
