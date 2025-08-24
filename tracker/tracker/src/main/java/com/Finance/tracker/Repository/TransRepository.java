package com.Finance.tracker.Repository;


import com.Finance.tracker.Model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;


public interface TransRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}
