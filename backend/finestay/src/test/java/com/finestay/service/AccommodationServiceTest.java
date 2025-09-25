package com.finestay.service;

import com.finestay.entity.Accommodation;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
class AccommodationServiceTest {
    @Autowired
    private AccommodationService accommodationService ;

    @Test
    public void testInsert() {
        Accommodation accommodation = new Accommodation();
        accommodation.setTitle("스테이 샌즈");
        accommodation.setLocation("강원 고성군");
        accommodation.setDescription("안녕하세요, 스테이샌즈 입니다.");
        accommodation.setPrice(250000);
        accommodation.setCoordinate("38.267412, 128.556178");
        accommodation.setMainExhibition(0);
        accommodation.setImg("\\img\\accomo\\staysands-sands\\staysands-sands_");
        accommodationService.register(accommodation);
    }

    @Test
    public  void testRead(){
        Long accommodationId = 1L;
        Accommodation team = accommodationService.read(accommodationId);
        log.info("team : " + team);
    }

}