package com.journalistjunction.controller;

import com.journalistjunction.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.journalistjunction.model.MailStructure;

@RequiredArgsConstructor
@RestController
@RequestMapping("/mail")
public class MailController {

    private final MailService mailService;

    @PostMapping("/send/{mail}")
    public String sendMail(@PathVariable String mail, @RequestBody MailStructure mailStructure) {
        mailService.sendMail(mail, mailStructure);
        return "The Mail Was Sent Successfully!";
    }

    @PostMapping("/welcome/{mail}/{username}")
    public void sendMail(@PathVariable String mail, @PathVariable String username) {
        mailService.welcomeMail(mail, username);
    }
}
