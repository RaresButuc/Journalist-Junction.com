package com.journalistjunction.service;

import com.journalistjunction.model.Notification;
import com.journalistjunction.model.User;
import com.journalistjunction.repository.NotificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@AllArgsConstructor
public class NotificationService {

    private final UserService userService;
    private final NotificationRepository notificationRepository;

    public List<Notification> getAllNotificationsByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        return userService.getUserById(user.getId()).getNotifications();
    }

    public Long getUnreadNotificationsCounter() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        return userService.getUserById(user.getId()).getNotifications().stream().filter(e -> !e.isRead()).count();
    }

    public void setNotificationSeen(Long notificationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) auth.getPrincipal();

        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new NoSuchElementException("An Error Has Occurred!"));

        if (Objects.equals(user.getId(), notification.getTo().getId())) {
            notification.setRead(true);
            notificationRepository.save(notification);
        } else {
            throw new IllegalStateException("An Error Has Occurred! Please Try Again Later!");
        }


    }

    public void deleteNotificationById(Long id) {
        notificationRepository.deleteById(id);
    }
}
