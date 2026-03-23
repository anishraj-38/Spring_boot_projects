package com.research.assistant.Repository;

import com.research.assistant.Entity.ResearchData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearchRepository  extends JpaRepository<ResearchData,Long> {
}
