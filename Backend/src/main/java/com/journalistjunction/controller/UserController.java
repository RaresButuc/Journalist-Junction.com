package com.journalistjunction.controller;

import com.journalistjunction.model.User;
import com.journalistjunction.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable("id") Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public void postNewUser(User user) {
        userService.addUser(user);
    }

    @PutMapping("/{id}")
    public void editUser(@PathVariable("id") Long id, User user) {
        userService.updateUserById(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.deleteUserById(id);
    }
}
