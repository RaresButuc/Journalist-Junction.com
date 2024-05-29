package com.journalistjunction.controller;

import com.journalistjunction.service.ChangePasswordLinkService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/changepassword")
public class ChangePasswordLinkController {

    private final ChangePasswordLinkService changePasswordLinkService;

    @GetMapping("/isTimeExpired/{uuid}")
    public boolean isReqExpiredByTime(@PathVariable("uuid") String uuid) {
        return changePasswordLinkService.isExpiredByTime(uuid);
    }

    @GetMapping("/getEmail/{uuid}")
    public String getEmailByUuid(@PathVariable("uuid") String uuid) {
        return changePasswordLinkService.getEmailByUUID(uuid);
    }

    @GetMapping("/isRequestExpired/{uuid}")
    public boolean getRequestByUuid(@PathVariable("uuid") String uuid) {
        return changePasswordLinkService.isRequestExpired(uuid);
    }
}
