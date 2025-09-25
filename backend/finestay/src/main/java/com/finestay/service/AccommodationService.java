package com.finestay.service;

import com.finestay.entity.Accommodation;
import com.finestay.entity.Board;
import com.finestay.repository.AccommodationRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class AccommodationService {
    private final AccommodationRepository accommodationRepository;


    //CRUD => Crete
    public void register(Accommodation accommodation) {
        accommodationRepository.save(accommodation);
    }

    //CRUD => Read
    public Accommodation read(Long accommodationId){
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "숙소 찾았어: " + accommodationId));
        return  accommodation;
    }

    //CRUD => Read All
    public List<Accommodation> readAll(){
        List<Accommodation> accommodations = accommodationRepository.findAll();
        return accommodations;
    }
}
