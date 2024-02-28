package com.journalistjunction.service;

import com.journalistjunction.model.User;
import com.journalistjunction.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This ID!"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This Email!"));
    }

    public boolean isUserSubscriber(Long idCurrentUser, Long idSecondUser) {
        User currentUser = userRepository.findById(idCurrentUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This ID!"));
        User secondUser = userRepository.findById(idSecondUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This ID!"));

        return secondUser.getSubscribers().stream().anyMatch(e -> Objects.equals(e.getId(), currentUser.getId()));
    }

    public void subscribeOrUnsubscribe(Long idCurrentUser, Long idSecondUser, String command) {
        User currentUser = userRepository.findById(idCurrentUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This ID!"));
        User secondUser = userRepository.findById(idSecondUser)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This ID!"));

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
                .orElseThrow(() -> new NoSuchElementException("No User Found With This ID!"))
                .getSubscribers()
                .size();
    }

    public void updateUserById(Long id, User updatedUser) {
        if (updatedUser == null) {
            throw new IllegalArgumentException("Updated user data cannot be null");
        }

        User userFromDb = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No User Found With This ID!"));

        userFromDb.setName(updatedUser.getName());
        userFromDb.setEmail(updatedUser.getEmail());
        userFromDb.setPhoneNumber(updatedUser.getPhoneNumber());
        userFromDb.setLocation(updatedUser.getLocation());
        userFromDb.setShortAutoDescription(updatedUser.getShortAutoDescription());
        userRepository.save(userFromDb);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

}
