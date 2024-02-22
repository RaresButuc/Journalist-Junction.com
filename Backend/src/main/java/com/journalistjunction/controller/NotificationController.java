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

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @PostMapping
    public void postNewNotification(@RequestBody Notification notification) {
        notificationService.addNotification(notification);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable("id") Long id) {
        notificationService.deleteNotificationById(id);
    }
}
