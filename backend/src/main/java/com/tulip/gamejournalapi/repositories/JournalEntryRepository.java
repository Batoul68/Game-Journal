package com.tulip.gamejournalapi.repositories;

import com.tulip.gamejournalapi.entities.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

   List<JournalEntry> findAllByGame_IdInOrderByCreatedAtDescIdDesc(Collection<Long> gameIds);

   Optional<JournalEntry> findByIdAndGame_User_Username(Long entryId, String username);

}
