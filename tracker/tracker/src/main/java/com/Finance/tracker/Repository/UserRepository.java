package com.Finance.tracker.Repository;

import com.Finance.tracker.Model.Transaction;
import com.Finance.tracker.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface UserRepository extends JpaRepository<User,Long> {

}
