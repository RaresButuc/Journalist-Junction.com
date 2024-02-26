package com.journalistjunction.controller;

import com.journalistjunction.model.Location;
import com.journalistjunction.service.LocationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/location")
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public List<Location> getALlCountries() {
        return locationService.getAllLocations();
    }
}
