package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.dto.GameRequest;
import com.tulip.gamejournalapi.dto.GameResponse;
import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.Genre;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.GameRepository;
import com.tulip.gamejournalapi.repositories.GenreRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
public class GameService {

   private final GameRepository gameRepository;
   private final GenreRepository genreRepository;

   public GameService(GameRepository gameRepository, GenreRepository genreRepository) {
      this.gameRepository = gameRepository;
      this.genreRepository = genreRepository;
   }

   // Reusable GameResponse
   private GameResponse toGameResponse(Game game) {

      // Convert the Set<Genre> into a List<String> with just the genre names
      List<String> genreNames = game.getGenres().stream()
              .map(Genre::getName)
              .sorted()
              .toList();

      return new GameResponse(
              game.getId(),
              game.getName(),
              game.getCoverImageUrl(),
              game.getRating(),
              genreNames,
              game.getReview(),
              game.getReleaseYear(),
              game.getDescription()
      );
   }

   // Reusable helper to look up Genre objects
   private List<Genre> resolveGenres(Set<String> names) {
      if (names.isEmpty()) {
         return List.of();
      }

      List<Genre> genres = genreRepository.findByNameIn(names);
      // Catch any name that wasn't found in the db
      if (genres.size() != names.size()) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "One or more genres are unknown"
         );
      }
      return genres;
   }

   // Reusable Game setter, void so the caller knows the method updates the game it was given
   private void setGameProperties(Game game, GameRequest request) {
      List<Genre> selectedGenres = resolveGenres(request.genres());

      game.setName(request.name());
      game.setCoverImageUrl(request.coverImageUrl());
      game.setRating(request.rating());
      game.setReview(request.review());
      game.setReleaseYear(request.releaseYear());
      game.setDescription(request.description());

      // Clear the existing genres so if user unchecks a genre, it removes it from the game's genres
      game.getGenres().clear();
      game.getGenres().addAll(selectedGenres);
   }
   
   // Get list of games associated with user
   public List<GameResponse> getGames(int userId) {
      return gameRepository.findByUserId(userId)
              .stream()
              .map(this::toGameResponse)
              .toList();
   }

   // Getting a game by id
   @Transactional(readOnly = true)
   public GameResponse getGame(Long gameId, String username) {
      return gameRepository.findByIdAndUser_Username(gameId, username)
              .map(this::toGameResponse)
              .orElseThrow(() ->
                      new ResponseStatusException((HttpStatus.NOT_FOUND), "Game not found")
              );
   }

   // Creating a new game
   @Transactional
   public GameResponse createGame(User user, GameRequest gameRequest) {
      Game newGame = new Game();
      newGame.setUser(user);
      setGameProperties(newGame, gameRequest);

      return toGameResponse(gameRepository.save(newGame)) ;
   }

   // Updating a game
   @Transactional
   public GameResponse updateGame(Long id, String username, GameRequest gameRequest) {
      Game existingGame = gameRepository.findByIdAndUser_Username(id, username)
              .orElseThrow(() ->
                      new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found")
              );

      setGameProperties(existingGame, gameRequest);

      return toGameResponse(gameRepository.save(existingGame));
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
