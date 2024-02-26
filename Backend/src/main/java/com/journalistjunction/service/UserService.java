package com.journalistjunction.service;

import com.journalistjunction.model.User;
import com.journalistjunction.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean isUserSubscriber(Long idCurrentUser, Long idSecondUser) {
        User currentUser = userRepository.findById(idCurrentUser).orElse(null);
        User secondUser = userRepository.findById(idSecondUser).orElse(null);

        assert currentUser != null;
        assert secondUser != null;

        return secondUser.getSubscribers().stream().anyMatch(e -> Objects.equals(e.getId(), currentUser.getId()));
    }

    public boolean isUserIdAvailable(Long id) {
        return userRepository.existsById(id);
    }

    public void subscribeOrUnsubscribe(Long idCurrentUser, Long idSecondUser, String command) {
        User currentUser = userRepository.findById(idCurrentUser).orElse(null);
        User secondUser = userRepository.findById(idSecondUser).orElse(null);

        assert currentUser != null;
        assert secondUser != null;

        switch (command) {
            case "subscribe" -> {
                if (!isUserSubscriber(idCurrentUser, idSecondUser) && !idCurrentUser.equals(idSecondUser)) {
                    currentUser.getSubscribedTo().add(secondUser);
                    secondUser.getSubscribers().add(currentUser);
                }
            }
            case "unsubscribe" -> {
                if (isUserSubscriber(idCurrentUser, idSecondUser) && !idCurrentUser.equals(idSecondUser)) {
                    currentUser.getSubscribedTo().remove(secondUser);
                    secondUser.getSubscribers().remove(currentUser);
                }
            }
        }
        userRepository.save(currentUser);
        userRepository.save(secondUser);
    }

    public int subscribersCount(Long idUser) {
        return Objects.requireNonNull(userRepository.findById(idUser).orElse(null)).getSubscribers().size();
    }

    public void updateUserById(Long id, User updatedUser) {
        User userFromDb = userRepository.findById(id).orElse(null);
        assert userFromDb != null;
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
