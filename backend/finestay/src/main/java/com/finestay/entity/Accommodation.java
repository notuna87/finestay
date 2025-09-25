package com.finestay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accommodation")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Accommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="accommodation_id")
    private Long id;

    private String title;

    private String location;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    private int price;

    private String coordinate;

    private int mainExhibition;

    private String img;
}
