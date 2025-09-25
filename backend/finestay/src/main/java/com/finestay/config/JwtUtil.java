package com.finestay.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // JWT 서명 비밀키가 너무 짧음(160bit), 최소 256bit — 여기에서 에러 발생
    // private static final String SECRET_KEY = "12345678901234567890";
    private static final String SECRET_KEY = "mysecretkeymysecretkeymysecretkey1234"; // 최소 256bit

    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간

    private final Key key;

    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());  // 시크릿 키를 Key 객체로 변환
    }

    // 토큰 생성
    public String createToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        System.out.println("토큰 발급 시간: " + now);
        System.out.println("토큰 만료 시간: " + expiryDate);

        return Jwts.builder()
                .setSubject(username) // 사용자 식별 정보
                .setIssuedAt(now) // 발급 시간
                .setExpiration(expiryDate)   // 만료 시간
                .signWith(key, SignatureAlgorithm.HS256)  // 서명 알고리즘 + 비밀키
                .compact();    // 최종 JWT 문자열 생성
    }

    // 토큰 유효성 검사 메서드
    // 클라이언트가 전달한 JWT 토큰을 파싱해서 올바른지 확인한다.
    // 서명이 유효하고(expiration 포함) 토큰 구조가 정상이라면 true 반환
    // 서명 불일치, 만료, 위조 등의 문제가 있으면 예외 발생 → false 반환
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)             // 토큰을 검증할 때 사용할 서명 키 설정
                    .build()
                    .parseClaimsJws(token);        // 토큰을 파싱 및 검증 (예외 발생 시 유효하지 않음)
            return true;                          // 예외가 없으면 정상 토큰
        } catch (JwtException | IllegalArgumentException e) {
            return false;                       // 잘못된 형식이거나 만료·위조된 토큰
        }
    }

    // 토큰에서 사용자 이름 추출
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)// 토큰 해석
                .getBody()
                .getSubject();
    }

    // JWT 토큰 추출 메서드 (요청 헤더에서 "Bearer {토큰}" 꺼냄)
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 제거
        }
        return null;
    }

}
