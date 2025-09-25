package com.finestay.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration   // 설정 파일임을 나타냄
@RequiredArgsConstructor  // final 필드를 생성자 주입 받음
public class SecurityConfig {

    private final JwtUtil jwtUtil; // JWT 토큰을 만들고 검사하는 유틸 클래스

    // 비밀번호 암호화 설정 (빈 등록)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // 비밀번호를 안전하게 암호화해주는 클래스
    }

    // JWT 필터 빈 등록
    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        // 만든 JwtAuthFilter 객체를 빈으로 등록
        return new JwtAuthFilter(jwtUtil);
    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/auth/login").permitAll()
//                        .anyRequest().authenticated()
//                );
//
//        return http.build(); // 보안 필터 체인 생성
//    }



    // 스프링 시큐리티의 보안 설정을 정의하는 필터 체인
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // CSRF 보안 기능 끔

                /*
    세션 관리 정책 설정
    기본적으로 스프링 시큐리티는 로그인 성공 시 HttpSession에 인증 정보를 저장(Session 기반 인증).
    그러나 JWT 방식은 "Stateless" 인증(= 서버가 세션을 전혀 유지하지 않음)을 사용하므로
     매 요청마다 클라이언트가 JWT 토큰을 전송해야 하며, 서버는 세션에 아무것도 저장하지 않는다.
    따라서 SessionCreationPolicy.STATELESS 로 지정해야 세션을 만들지 않고,
     기존 세션을 절대 사용하지 않는다.

    종류 정리:
    - ALWAYS      : 항상 세션 생성
    - IF_REQUIRED : 필요할 때만 생성 (스프링 시큐리티 기본값)
    - NEVER       : 스프링 시큐리티는 세션을 생성하지 않지만, 다른 곳에서 세션이 있으면 사용
    - STATELESS   : 세션을 절대 생성하지 않고, 존재하더라도 사용하지 않음 (JWT 인증에 적합)
    */

                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()       // 로그인, 회원가입은 누구나 접근 가능
                        .requestMatchers("/api/accommo/**").permitAll()       // 로그인, 회원가입은 누구나 접근 가능
                        .requestMatchers("/api/members/**").permitAll()    // 회원 목록도 접근 허용
                        .requestMatchers("/api/boards/**").permitAll()    // 회원 목록도 접근 허용
                        .requestMatchers("/member/list").permitAll()  //추가
                        .requestMatchers("/board/list").permitAll()  //추가
                        .requestMatchers("/api/secure/**").authenticated() // 인증된 유저만 접근 가능
                        .anyRequest().authenticated()                           // 나머지 요청은 인증 필요
                )
                // 요청이 들어오면 먼저 JWT 필터를 실행해서 토큰 확인
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();  // 설정 완료된 보안 필터 체인 반환
    }

    /**
     * AuthenticationManager 빈을 애플리케이션 컨텍스트에 노출한다.
     *
     * ▷ 언제 필요한가?
     *   - 로그인 API에서 username/password를 검증해 JWT를 발급할 때(표준 인증 흐름 사용)
     *   - 민감 작업 전에 비밀번호 재확인을 수행할 때(재인증)
     *   - formLogin/httpBasic을 커스텀 로직에서 직접 트리거할 때
     *
     * ▷ 내부 동작(간단 요약)
     *   - AuthenticationConfiguration은 스프링 시큐리티가 자동 구성해 둔
     *     AuthenticationManager(보통 ProviderManager)를 보유한다.
     *   - 이 매니저는 등록된 AuthenticationProvider 목록(대표적으로 DaoAuthenticationProvider)을
     *     통해 다음을 수행:
     *       1) UserDetailsService.loadUserByUsername()로 사용자 조회
     *       2) PasswordEncoder.matches()로 비밀번호 비교
     *       3) 계정 상태(잠금/만료/비활성) 검사
     *     → 성공 시 권한(GrantedAuthority)을 포함한 Authentication을 반환,
     *       실패 시 BadCredentialsException 등 예외를 던짐.
     *
     * ▷ 주의사항
     *   - 이 빈 자체가 SecurityContextHolder에 인증을 저장하진 않는다.
     *     (로그인 성공 후 저장은 보통 필터/핸들러 또는 서비스 로직에서 수행)
     *   - 모든 요청을 JWT로 ‘검증만’ 처리하고, username/password 검증을 전혀 하지 않는 구조라면
     *     반드시 필요하진 않지만, 표준 보안 체크를 재사용하려면 등록을 권장.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // AuthenticationConfiguration이 구성해 둔 AuthenticationManager를 반환한다.
        // 서비스/컨트롤러에서 authenticationManager.authenticate(...)로 호출하여
        // 표준 인증 파이프라인(UserDetailsService + PasswordEncoder + 계정 상태 체크)을 사용한다.
        return config.getAuthenticationManager();   // 인증 매니저 반환
    }
}
