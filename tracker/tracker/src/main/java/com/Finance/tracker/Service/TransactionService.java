package com.Finance.tracker.Service;

import com.Finance.tracker.Model.Transaction;
import com.Finance.tracker.Repository.TransRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransRepository transRepository;

    public TransactionService(TransRepository transRepository) {
        this.transRepository = transRepository;
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transRepository.save(transaction);
    }

    public List<Transaction> getTransactionForUser(Long userId, LocalDate start, LocalDate end){
        return transRepository.findByUserIdAndDateBetween(userId,start,end);
    }
}

