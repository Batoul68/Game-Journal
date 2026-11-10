package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.dto.GameRequest;
import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.GameRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Service
public class GameService {

   private final GameRepository gameRepository;

   public GameService(GameRepository gameRepository) {
      this.gameRepository = gameRepository;
   }

   // Creating a new game
   public Game createGame(
           User user,
           String name,
           String coverImageUrl,
           BigDecimal rating,
           String genre,
           String review,
           Integer releaseYear,
           String description
   ) {
      Game newGame = new Game();
      newGame.setUser(user);
      newGame.setName(name);
      newGame.setCoverImageUrl(coverImageUrl);
      newGame.setRating(rating);
      newGame.setGenre(genre);
      newGame.setReview(review);
      newGame.setReleaseYear(releaseYear);
      newGame.setDescription(description);

      return gameRepository.save(newGame);
   }

   // Updating a game
   @Transactional
   public Game updateGame(Long id, String username, GameRequest request) {
      Game game = gameRepository.findByIdAndUser_Username(id, username)
              .orElseThrow(() ->
                      new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found")
              );

      game.setName(request.name());
      game.setCoverImageUrl(request.coverImageUrl());
      game.setRating(request.rating());
      game.setGenre(request.genre());
      game.setReview(request.review());
      game.setReleaseYear(request.releaseYear());
      game.setDescription(request.description());

      return gameRepository.save(game);
   }

   // Deleting a game
   public void deleteGame(Long id, String username) {
      Game game = gameRepository.findByIdAndUser_Username(id, username)
              .orElseThrow(() ->
                      new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found")
              );

      gameRepository.delete(game);
   }
}
