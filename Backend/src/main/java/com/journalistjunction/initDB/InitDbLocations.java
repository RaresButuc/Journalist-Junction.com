package com.journalistjunction.initDB;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.journalistjunction.model.Location;
import com.journalistjunction.repository.LocationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@AllArgsConstructor
public class InitDbLocations {

    private final LocationRepository locationRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public void seedDBLocations() {
        String apiUrl = "https://restcountries.com/v3.1/all";

        String response = restTemplate.getForObject(apiUrl, String.class);

        try {
            JsonNode jsonNode = objectMapper.readTree(response);

            List<Location> locations = new ArrayList<>();

            for (JsonNode node : jsonNode) {
                Location location = Location.builder()
                        .country(node.get("name").get("common").asText())
                        .cca2(node.get("cca2").asText())
                        .build();

                locations.add(location);
            }

            locationRepository.saveAllAndFlush(locations.stream().sorted(Comparator.comparing(Location::getCountry)).toList());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
