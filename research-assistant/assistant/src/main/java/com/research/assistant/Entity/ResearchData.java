package com.research.assistant.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "research_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResearchData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 5000)
    private String content;

    private String operation;

    @Column(length = 5000)
    private String result;

    private LocalDateTime createdAt = LocalDateTime.now();
}
