package com.journalistjunction.repository;

import com.journalistjunction.model.ContributorInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContributorInviteRepository extends JpaRepository<ContributorInvite, Long> {

    ContributorInvite findByUuid(String uuid);

}
