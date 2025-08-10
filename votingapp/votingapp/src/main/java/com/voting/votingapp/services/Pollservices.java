package com.voting.votingapp.services;

import com.voting.votingapp.Repository.PollRepository;
import com.voting.votingapp.model.OptionVote;
import com.voting.votingapp.model.Poll;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Optional;


@Service
public class Pollservices {

    private PollRepository pollRepository;
    public Pollservices(PollRepository pollRepository) {
        this.pollRepository = pollRepository;
    }

    public Poll createpoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }


    public Optional<Poll> getPollsById(Long id) {
        return pollRepository.findById(id);
    }

    public void vote(Long pollId, int optionIndex) {

        //Get Poll from DB
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        //Get All Options
        List<OptionVote> options = poll.getOptions();

        //If index vote is not valid
        if(optionIndex<0 ||optionIndex>=options.size()){
            throw new IllegalArgumentException("Invalid option index ");
        }


        // Get Selected Option
        OptionVote selectedOption=options.get(optionIndex);

        //Increment vote for selected option
        selectedOption.setVoteCount(selectedOption.getVoteCount()+1);

        //Save incremented option into the data
        pollRepository.save(poll);
    }
}
