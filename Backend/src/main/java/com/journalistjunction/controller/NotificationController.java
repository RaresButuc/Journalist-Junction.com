package com.journalistjunction.controller;

import com.journalistjunction.model.Notification;
import com.journalistjunction.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping(value = "/user")
    public List<Notification> getAllNotificationsByUser() {
        return notificationService.getAllNotificationsByUser();
    }

    @GetMapping(value = "/seen-counter")
    public Long getUnreadNotificationsCounter() {
        return notificationService.getUnreadNotificationsCounter();
    }

    @PutMapping(value = "/set-seen/{id}")
    public void setNotificationsAsSeen(@PathVariable("id") Long id) {
        notificationService.setNotificationSeen(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable("id") Long id) {
        notificationService.deleteNotificationById(id);
    }
}
