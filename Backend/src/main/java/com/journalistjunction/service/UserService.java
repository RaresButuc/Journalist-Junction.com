package com.journalistjunction.service;

import com.journalistjunction.model.User;
import com.journalistjunction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public void updateUserById(Long id, User updatedUser) {
        User userFromDb = userRepository.findById(id).orElse(null);
        assert userFromDb != null;
        userFromDb.setName(updatedUser.getName());
        userFromDb.setEmail(updatedUser.getEmail());
        userFromDb.setPhoneNumber(updatedUser.getPhoneNumber());
        userFromDb.setCountry(updatedUser.getCountry());
        userFromDb.setShortAutoDescription(updatedUser.getShortAutoDescription());
        userRepository.save(userFromDb);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

}
