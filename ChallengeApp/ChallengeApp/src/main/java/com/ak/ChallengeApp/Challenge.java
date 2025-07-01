package com.ak.ChallengeApp;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String month;
    private String description;

    public Challenge(long id, String month , String description) {
        this.id=id;
        this.month=month;
        this.description = description;
    }


}

