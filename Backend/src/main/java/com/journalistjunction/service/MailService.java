package com.journalistjunction.service;

import com.journalistjunction.model.User;
import com.journalistjunction.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.journalistjunction.model.MailStructure;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

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

    public void articlePostedMail(String mail, String username, String title) {
        User user = userRepository.findByEmail(mail).orElseThrow(() -> new NoSuchElementException("No User Found!"));
        boolean isFirstArticle = user.getArticlesOwned().isEmpty() || user.getArticlesOwned().stream().anyMatch(e -> e.getTitle().equals(title)) && user.getArticlesOwned().size() == 1;

        String message = isFirstArticle ? """
                Hi %s,

                Congratulations on posting your first article: "%s"! 🌟

                We're thrilled to have you join us. As a member of Journalist Junction, you'll have access to an array of powerful tools and resources to help you thrive in the dynamic world of journalism.

                You can edit any aspect of your article efficiently and rapidly at any time.

                If you ever need assistance, don't hesitate to reach out to us at: team.journalistjunction@gmail.com. We're here to support you every step of the way.

                Best wishes,
                The Journalist Junction Team
                """ : """
                Hi %s,

                Congratulations on your article: "%s"! 🌟

                We're excited to share that countless people will now have access to your article. If you wish to make any modifications in the future, you can edit any aspect of your article efficiently and rapidly.

                Wishing you success in your upcoming projects!

                Best wishes,
                The Journalist Junction Team
                """;
        String formattedMessage = String.format(message, username, title);

        sendMail(mail, new MailStructure("New Article Posted!", formattedMessage));
    }
}
