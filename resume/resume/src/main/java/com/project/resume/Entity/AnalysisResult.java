package com.project.resume.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class AnalysisResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    private Resume resume;

    private int atsScore;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String feedback;


    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String suggestedRolesJson;


    private Instant createdAt;

}
