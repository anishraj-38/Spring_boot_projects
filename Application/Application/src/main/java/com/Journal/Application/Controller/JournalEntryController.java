package com.Journal.Application.Controller;


import com.Journal.Application.Entity.JournalEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("journal")
public class JournalEntryController {

    private Map<Long,JournalEntity> journalEntity = new HashMap<>();

    @GetMapping
    public List<JournalEntity> getAll(){
        return new ArrayList<>(journalEntity.values());
    }

    @PostMapping
    public boolean createEntry(@RequestBody JournalEntity  anish){
        journalEntity.put(anish.getId(),anish);
        return true;

    }

    @GetMapping("id/{myId}")
    public JournalEntity getJournalEntityById(@PathVariable Long myId){
        return journalEntity.get(myId);
    }

    @DeleteMapping("id/{myId}")
    public JournalEntity deleteJournalEntityById(@PathVariable Long myId){
        return journalEntity.remove(myId);
    }

    @PutMapping("id/{myId}")
    public JournalEntity updateJournalEntityById(@PathVariable Long id,@RequestBody JournalEntity anish){
        return journalEntity.put(id,anish);
    }

    }

