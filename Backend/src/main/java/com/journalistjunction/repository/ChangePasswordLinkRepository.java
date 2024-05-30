package com.journalistjunction.repository;

import com.journalistjunction.model.ChangePasswordLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChangePasswordLinkRepository extends JpaRepository<ChangePasswordLink, Long> {
    ChangePasswordLink findByUuid(String uuid);
}
