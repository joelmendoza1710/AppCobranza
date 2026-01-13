package com.AppCobranza.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String dni;
    private String address;
    private String phone;

    // Changed from Integer to Double to allow intermediate insertions (e.g. 1.5)
    private Double routeOrder;

    private Double latitude;
    private Double longitude;

    private String rifas; // Optional raffle number
    private String adjuntosUrl; // Photo URLs

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user; // Ideally this should be replaced by 'Route' entity

    @Column(name = "ruta_id")
    private Long rutaId; // Linking to Route table loosely for now
}
