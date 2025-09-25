package com.finestay.controller;

import com.finestay.dto.AccommodationDTO;
import com.finestay.dto.BoardDTO;
import com.finestay.entity.Accommodation;
import com.finestay.entity.Board;
import com.finestay.service.AccommodationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // REST 방식의 컨트롤러임을 선언
@RequestMapping("/api/accommo") // 이 컨트롤러는 /api/boards로 시작하는 요청 처리
@RequiredArgsConstructor // 생성자 자동 주입
@Log4j2
public class AccommodationController {

    private final AccommodationService accommodationService;

    private AccommodationDTO toDTO(Accommodation accommodation) {
        return new AccommodationDTO(
                accommodation.getId(),
                accommodation.getTitle(),
                accommodation.getLocation(),
                accommodation.getDescription(),
                accommodation.getPrice(),
                accommodation.getCoordinate(),
                accommodation.getMainExhibition(),
                accommodation.getImg()
        );
    }

    @GetMapping("/{id}")
    public AccommodationDTO read(@PathVariable Long id){
        return toDTO(accommodationService.read(id));
    }

    @GetMapping
    public List<AccommodationDTO> list() {
        return accommodationService.readAll()
                .stream()
                .map(this::toDTO)  // 엔티티 → DTO 변환
                .toList();
    }

}
