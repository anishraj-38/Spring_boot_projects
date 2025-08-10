package com.voting.votingapp.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
public class Vote {
    @NonNull
    private Long pollId;
    private int optionIndex;
}
