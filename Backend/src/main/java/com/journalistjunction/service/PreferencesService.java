package com.journalistjunction.service;

import com.journalistjunction.model.Preference;
import com.journalistjunction.repository.PreferencesRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PreferencesService {

    private final PreferencesRepository preferencesRepository;

    public void addNewPreference(Preference preference) {
        preferencesRepository.save(preference);
    }
}
