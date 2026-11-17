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

      Game baseGame = requireBaseGame(baseGameId, user);
      Game targetGame = gameRepository.findByIdAndUser_Username(journalEntryRequest.targetGameId(), user.getUsername())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.NOT_FOUND, "Target game not found"
              ));
      Game parent = targetGame.getParentGame();

      // Was the base game selected?
      boolean isBaseGame = baseGame.getId().equals(targetGame.getId());

      // Or was a DLC selected?
      boolean isItsDlc = parent != null && baseGame.getId().equals(parent.getId());

      if (!isBaseGame && !isItsDlc) {
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
}
