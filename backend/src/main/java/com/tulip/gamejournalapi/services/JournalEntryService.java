package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.dto.JournalEntryRequest;
import com.tulip.gamejournalapi.dto.JournalEntryResponse;
import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.JournalEntry;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.GameRepository;
import com.tulip.gamejournalapi.repositories.JournalEntryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class JournalEntryService {

   private final GameRepository gameRepository;
   private final JournalEntryRepository journalEntryRepository;

   public JournalEntryService(GameRepository gameRepository, JournalEntryRepository journalEntryRepository) {
      this.gameRepository = gameRepository;
      this.journalEntryRepository = journalEntryRepository;
   }

   /**
    * Helper method to convert a journal entry into an API response with the associated game's id
    *
    * @param entry a journal entry to convert
    * @return the journal entry's details as an API response
    */
   private JournalEntryResponse toJournalEntryResponse(JournalEntry entry) {
      return new JournalEntryResponse(
              entry.getId(),
              entry.getGame().getId(),
              entry.getBody(),
              entry.getCreatedAt()
      );
   }

   /**
    * Helper method to make sure the game provided is a base game and exists in the user's collection
    *
    * @param baseGameId the id of the base game whose journal is open
    * @param user the signed-in user who owns the base game
    * @return the base game if it is a base game and exists
    * @throws ResponseStatusException with HTTP 404 if base game is not found
    *                                 with HTTP 400 if the base game is a DLC
    */
   private Game requireBaseGame(Long baseGameId, User user) {
      Game baseGame = gameRepository.findByIdAndUser_Username(baseGameId, user.getUsername())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.NOT_FOUND, "Base game not found"
              ));

      if (baseGame.getParentGame() != null) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "Use the base game's id in the URL"
         );
      }

      return baseGame;
   }

   /**
    * Helper method to check whether a title is the base game of one of its DLCs
    *
    * @param baseGame the base game whose journal is open
    * @param checkGame the title to check
    * @return true if the title is the base game or one of its DLCs, otherwise false
    */
   private boolean belongsToJournal(Game baseGame, Game checkGame) {
      Game parent = checkGame.getParentGame();

      // Was the base game selected?
      boolean isBaseGame = baseGame.getId().equals(checkGame.getId());

      // Or was a DLC selected?
      boolean isItsDlc = parent != null && baseGame.getId().equals(parent.getId());

      return isBaseGame || isItsDlc;
   }

   /**
    * Helper method that finds a journal entry owned by the signed-in user and verifies that it
    * belongs to the base game's journal.
    *
    * @param entryId the ID of the existing journal entry
    * @param baseGame the base game whose journal is open
    * @param user the signed-in user
    * @return the entry associated with the base game or one of its DLCs
    * @throws ResponseStatusException with HTTP 404 if the entry is absent from the user's collection or belongs to another game's journal
    */
   private JournalEntry requireJournalEntry(Long entryId, Game baseGame, User user) {

      // Find the entry
      JournalEntry entry = journalEntryRepository.findByIdAndGame_User_Username(entryId, user.getUsername())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.NOT_FOUND, "Journal entry not found"
              ));

      // Check if the entry's game is the base game or one of its DLCs
      if (!belongsToJournal(baseGame, entry.getGame())) {
         throw new ResponseStatusException(
                 HttpStatus.NOT_FOUND, "Journal entry not found"
         );
      }

      return entry;
   }

   /**
    * Retrieves the list of journal entries for a base game and its DLCs
    *
    * @param baseGameId the id of the base game whose journal is open
    * @param user the signed-in user who owns the base game
    * @return the list of journal entries for the base game and its DLCs, or an empty list if there are none
    */
   @Transactional(readOnly = true)
   public List<JournalEntryResponse> getEntries(Long baseGameId, User user) {
      Game baseGame = requireBaseGame(baseGameId, user);

      List<Long> titleIds = new ArrayList<>();
      titleIds.add(baseGame.getId());

      gameRepository.findAllByUser_IdAndParentGame_Id(user.getId(), baseGame.getId())
              .forEach(dlc -> titleIds.add(dlc.getId()));

      return journalEntryRepository
              .findAllByGame_IdInOrderByCreatedAtDescIdDesc(titleIds)
              .stream()
              .map(this::toJournalEntryResponse)
              .toList();
   }

   /**
    * Creates a new journal entry for the base game or one of its DLCs
    *
    * @param baseGameId the ID of the base game whose journal is open
    * @param user the signed-in user who owns the base game and target game
    * @param journalEntryRequest the target game's ID and entry text
    * @return the saved journal entry, including its generated ID and creation time
    * @throws ResponseStatusException with HTTP 404 if either game doesn't exist in the user collection.
    *                                 with HTTP 400 if base game is a DLC or the target game is outside the base game and its DLCs.
    */
   @Transactional
   public JournalEntryResponse createEntry(
           Long baseGameId,
           User user,
           JournalEntryRequest journalEntryRequest
   ) {

      // Check if game is base game and owned by user
      Game baseGame = requireBaseGame(baseGameId, user);
      Game targetGame = gameRepository.findByIdAndUser_Username(journalEntryRequest.targetGameId(), user.getUsername())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.NOT_FOUND, "Target game not found"
              ));

      // Check if targetGame is base game or one of its DLCs
      if (!belongsToJournal(baseGame, targetGame)) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "Choose this game or one of its DLCs"
         );
      }

      JournalEntry entry = new JournalEntry();
      entry.setGame(targetGame);
      entry.setBody(journalEntryRequest.body().strip());
      entry.setCreatedAt(Instant.now());

      return toJournalEntryResponse(journalEntryRepository.save(entry));
   }

   @Transactional
   public JournalEntryResponse updateEntry(
           Long baseGameId,
           Long entryId,
           User user,
           JournalEntryRequest journalEntryRequest
   ) {
      Game baseGame = requireBaseGame(baseGameId, user);
      JournalEntry entry = requireJournalEntry(entryId, baseGame, user);

      Game targetGame = gameRepository.findByIdAndUser_Username(journalEntryRequest.targetGameId(), user.getUsername())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.NOT_FOUND, "Target game not found"
              ));

      if (!belongsToJournal(baseGame, targetGame)) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "Choose this game or one of its DLCs"
         );
      }

      entry.setGame(targetGame);
      entry.setBody(journalEntryRequest.body().strip());

      return toJournalEntryResponse(journalEntryRepository.save(entry));
   }

   @Transactional
   public void deleteEntry(Long baseGameId, Long entryId, User user) {
      Game baseGame = requireBaseGame(baseGameId, user);
      JournalEntry entry = requireJournalEntry(entryId, baseGame, user);

      journalEntryRepository.delete(entry);
   }
}
