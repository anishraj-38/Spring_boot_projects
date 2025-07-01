package com.ak.ChallengeApp;


import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.*;

@Service
public class Challengeservices {
    private List<Challenge> challenge = new ArrayList<>();
    public Challengeservices() {
        Challenge c = new Challenge(1L, "Jan", "Hardworking");
        challenge.add(c);
    }

    public List<Challenge> getAllChallenge(){
        return challenge;
    }
    @PostMapping("/challenges")
    public boolean addChallenges(Challenge c) {
        if(c!=null){
            challenge.add(c);
            return true;
        }
        else{
            return false;
        }

    }
}
