package com.ak.ChallengeApp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ChallengeController {

    private Challengeservices challengeservices;
    private final List<Challenge> challenges = new ArrayList<>();

    public ChallengeController(Challengeservices challengeservices) {
        this.challengeservices=challengeservices;
    }

    @GetMapping("/challenges")
    public List<Challenge> getChallenges() {
        return challenges;
    }

    @PostMapping("/challenges")
    public String addChallenges(@RequestBody Challenge c) {
        boolean isChallengeAdded = challengeservices.addChallenges(c);
        if (isChallengeAdded) {
            return "Challenges add successfully";
        }
        else{
            return "invalid";
        }
    }
}