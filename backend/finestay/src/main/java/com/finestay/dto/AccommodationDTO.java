package com.finestay.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // getter, setter, toString, equals, hashCode 자동 생성
@NoArgsConstructor // 기본 생성자 생성
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자 생성
public class AccommodationDTO {
    private Long id; // 아이디

    private String title; // 제목

    private String location; // 주소 ex)제주 제주시

    private String description; // 설명

    private int price; // 가격

    private String coordinate; // 카카오지도용 좌표

    private int mainExhibition; // 전시되어있는곳 0~4

    private String img; // 이미지 주소
}
