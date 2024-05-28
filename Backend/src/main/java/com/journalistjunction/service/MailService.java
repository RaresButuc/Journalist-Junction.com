package com.journalistjunction.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.journalistjunction.model.MailStructure;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
@AllArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendMail(String mail, MailStructure mailStructure) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setSubject(mailStructure.getSubject());
        simpleMailMessage.setText(mailStructure.getMessage());
        simpleMailMessage.setTo(mail);


        mailSender.send(simpleMailMessage);
    }

    public void welcomeMail(String mail, String username) {
        String message = """
                Hi %s,

                Congratulations on becoming a part of the largest community of journalists! 🌟

                We're thrilled to have you join us. As a member of Journalist Junction, you'll have access to an array of powerful tools and resources to help you thrive in the dynamic world of journalism.

                Here's what you can look forward to:
                - Exclusive insights from industry experts 🧠
                - Networking opportunities with fellow journalists from around the globe 🌍
                - Access to cutting-edge tools to enhance your journalistic endeavors 🛠️

                If you ever need assistance, don't hesitate to reach out to us at: team.journalistjunction@gmail.com. We're here to support you every step of the way.

                Best wishes,
                The Journalist Junction Team
                """;
        String formattedMessage = String.format(message, username);

        sendMail(mail, new MailStructure("Congratulations!", formattedMessage));
    }
}
