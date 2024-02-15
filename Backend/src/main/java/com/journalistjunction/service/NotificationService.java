package com.journalistjunction.service;

import com.journalistjunction.model.Notification;
import com.journalistjunction.repository.NotificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;


    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public void addNotification(Notification notification) {
        notification.setPostTime(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    public void deleteNotificationById(Long id) {
        notificationRepository.deleteById(id);
    }
}
