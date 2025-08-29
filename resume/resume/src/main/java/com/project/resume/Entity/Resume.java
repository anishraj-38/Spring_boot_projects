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
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;
    private String contentType;
    private long size;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String extractedText;

    private Instant uploadedAt;

    @ManyToOne(optional=true)
    private User user;


}
