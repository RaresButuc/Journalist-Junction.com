package com.journalistjunction.service;

import com.journalistjunction.model.ChangePasswordLink;
import com.journalistjunction.model.ContributorInvite;
import com.journalistjunction.repository.ContributorInviteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@AllArgsConstructor
public class ContributionInviteService {

    private final ContributorInviteRepository contributorInviteRepository;

    public void addNewInvite(String uuid, Long articleId, String emailTo) {
        contributorInviteRepository.save(new ContributorInvite(0L, uuid, articleId, emailTo, false, LocalDateTime.now()));
    }

    public ContributorInvite getInviteByUUID(String uuid) {
        return contributorInviteRepository.findByUuid(uuid);
    }

    public boolean isExpiredByTime(String uuid) {
        ContributorInvite contributorInvite = contributorInviteRepository.findByUuid(uuid);
        boolean expirationState = contributorInvite.getCreatedDate().until(LocalDateTime.now(), ChronoUnit.MINUTES) > 2880;

        if (expirationState) {
            contributorInvite.setExpired(true);
            contributorInviteRepository.save(contributorInvite);
        }

        return expirationState;
    }

    public boolean isRequestExpired(String uuid) {
        return contributorInviteRepository.findByUuid(uuid).isExpired();
    }
}
