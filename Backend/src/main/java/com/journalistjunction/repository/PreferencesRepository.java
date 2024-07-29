package com.journalistjunction.repository;

import com.journalistjunction.model.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferencesRepository extends JpaRepository<Preference, Long> {
}
