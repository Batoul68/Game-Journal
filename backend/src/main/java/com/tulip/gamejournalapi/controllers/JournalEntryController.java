package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.dto.JournalEntryResponse;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.UserRepository;
import com.tulip.gamejournalapi.services.JournalEntryService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/games/{id}/journal-entries")
public class JournalEntryController {

   private final JournalEntryService journalEntryService;
   private final UserRepository userRepository;

   public JournalEntryController(JournalEntryService journalEntryService, UserRepository userRepository) {
      this.journalEntryService = journalEntryService;
      this.userRepository = userRepository;
   }

   @GetMapping
   public List<JournalEntryResponse> getJournalEntries(@PathVariable("id") Long gameId, Authentication authentication) {

      String username = authentication.getName();
      User user = userRepository.findUserByUsername(username)
              .orElseThrow(() -> new UsernameNotFoundException("User not found"));

      return journalEntryService.getEntries(gameId, user);
   }
}
