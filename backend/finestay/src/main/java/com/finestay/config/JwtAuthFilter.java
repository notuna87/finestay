package com.finestay.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 *   JWT 인증 필터
 * - 사용자가 보낸 요청에 JWT 토큰이 있는지 확인하고,
 * - 유효한 경우 SecurityContextHolder에 인증 정보를 등록한다.
 * - 모든 요청마다 한 번씩 실행됨 (OncePerRequestFilter).
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    // JwtUtil 주입 (토큰 검증용)
    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * 요청이 들어올 때마다 실행되는 필터 로직
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 요청 헤더에서 JWT 토큰 추출
        String token = jwtUtil.resolveToken(request);

        // 2. 토큰이 존재하고 유효하다면
        if (token != null && jwtUtil.validateToken(token)) {
            // 2-1. 토큰에서 사용자 이름(주체, subject) 꺼냄
            String username = jwtUtil.getUsernameFromToken(token);

            // 2-2. 인증 객체 생성 (비밀번호는 null, 권한은 빈 리스트) - 아래 추가설명참조
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());

            // 2-3. 요청 정보를 authentication 객체에 추가 - 아래 추가설명참조
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 2-4. Spring Security의 SecurityContext에 인증 정보 저장 - 아래 추가설명참조
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 3. 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }
}
