package com.Finance.tracker.Controller;

import com.Finance.tracker.Model.Transaction;
import com.Finance.tracker.Service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")

public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public List<Transaction> getUserTransactions(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ){
        return transactionService.getTransactionForUser(userId
        , LocalDate.parse(startDate),
                LocalDate.parse(endDate)
        );
    }

}
