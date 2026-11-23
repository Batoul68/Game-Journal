package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.dto.JournalEntryRequest;
import com.tulip.gamejournalapi.dto.JournalEntryResponse;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.UserRepository;
import com.tulip.gamejournalapi.services.JournalEntryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

   /**
    * Helper methods to validate if user exists in user repository
    *
    * @param authentication the current user's authentication supplied by Spring Security
    * @return a validated user object
    * @throws UsernameNotFoundException if no user record exists for the authenticated username
    */
   private User validateUser(Authentication authentication) {
      return userRepository.findUserByUsername(authentication.getName())
              .orElseThrow(() -> new UsernameNotFoundException("User not found"));
   }

   /**
    * Lists journal entries for the base game and its DLCs, newest first
    *
    * @param baseGameId the base game's ID from the URL
    * @param authentication the signed-in user's authentication provided by Spring Security
    * @return the journal entries, or an empty list if there are none
    */
   @GetMapping
   public List<JournalEntryResponse> getJournalEntries(@PathVariable("id") Long baseGameId, Authentication authentication) {
      return journalEntryService.getEntries(baseGameId, validateUser(authentication));
   }

   /**
    * Creates a journal entry for the base game or one of its DLCs with text and an optional image.
    * Responds with {@code 201 Created} on success.
    *
    * @param baseGameId the base game's ID from the URL
    * @param journalEntryRequest the selected title's ID and the entry text
    * @param image the uploaded image, or null if none was supplied
    * @param authentication the signed-in user's authentication provided by Spring Security
    * @return the saved journal entry, including its generated ID and creation time
    */
   @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   @ResponseStatus(HttpStatus.CREATED)
   public JournalEntryResponse addJournalEntry(
           @PathVariable("id") Long baseGameId,
           @Valid @RequestPart("entry") JournalEntryRequest journalEntryRequest,
           @RequestPart(value = "image", required = false) MultipartFile image,
           Authentication authentication
   ) {
      return journalEntryService.createEntry(baseGameId, validateUser(authentication), journalEntryRequest, image);
   }

   /**
    * Handles a request to update a journal entry.
    * Responds with {@code 200 OK} and the updated entry on success.
    *
    * @param baseGameId the base game's ID from the URL
    * @param entryId the journal entry's ID from the URL
    * @param journalEntryRequest the selected title's ID and updated text body
    * @param authentication the signed-in user
    * @return the updated journal entry
    */
   @PutMapping("/{entryId}")
   public JournalEntryResponse updateJournalEntry(
           @PathVariable("id") Long baseGameId,
           @PathVariable("entryId") Long entryId,
           @Valid @RequestBody JournalEntryRequest journalEntryRequest,
           Authentication authentication
   ) {
      return journalEntryService.updateEntry(
              baseGameId,
              entryId,
              validateUser(authentication),
              journalEntryRequest
      );
   }

   /**
    * Handles a request to delete a journal entry
    *
    * @param baseGameId the base game's ID from the URL
    * @param entryId the journal entry's ID from the URL
    * @param authentication the signed-in user
    * @return a {@code 204 No Content} response with an empty body
    */
   @DeleteMapping("/{entryId}")
   public ResponseEntity<Void> deleteJournalEntry(
           @PathVariable("id") Long baseGameId,
           @PathVariable("entryId") Long entryId,
           Authentication authentication
   ) {
      journalEntryService.deleteEntry(baseGameId, entryId, validateUser(authentication));

      return ResponseEntity.noContent().build();
   }
}
