package com.finestay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long id;

    private String title;

    @Column(nullable = false)
    private String createdBy; // 작성자 정보 (로그인한 사용자 ID)

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

}
