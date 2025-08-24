package com.Finance.tracker.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private double amount;
private String category;
private LocalDate date;

@ManyToOne
@JoinColumn(name="user_id")
private User user;


}
