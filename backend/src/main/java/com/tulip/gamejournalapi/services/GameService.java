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

/**
 * Manages games in a user's collection and converts saved games into API responses.
 */
@Service
public class GameService {

   private final GameRepository gameRepository;
   private final GenreRepository genreRepository;

   public GameService(GameRepository gameRepository, GenreRepository genreRepository) {
      this.gameRepository = gameRepository;
      this.genreRepository = genreRepository;
   }

   /**
    * Reusable helper that converts a game entity into an API response with its genre names in alphabetical order
    * and the parentGameId.
    *
    * @param game the game entity to convert
    * @return the game's details, including its genre names
    */
   private GameResponse toGameResponse(Game game) {

      // Convert the Set<Genre> into a List<String> with just the genre names
      List<String> genreNames = game.getGenres().stream()
              .map(Genre::getName)
              .sorted()
              .toList();

      // If there is no parent game, the game itself is the parent game
      Game parentGame = game.getParentGame();
      Long parentGameId = parentGame == null ? null : parentGame.getId();

      return new GameResponse(
              game.getId(),
              game.getName(),
              game.getCoverImageUrl(),
              game.getRating(),
              genreNames,
              game.getReview(),
              game.getReleaseYear(),
              game.getDescription(),
              parentGameId,
              game.getPlayStatus(),
              Set.copyOf(game.getPlayModes())
      );
   }

   /**
    * Reusable helper to look up Genre objects that match the requested names.
    *
    * @param names the distinct genre names to look up
    * @return the matching genre entities, or an empty list if no names were supplied
    * @throws ResponseStatusException with HTTP 400 if any name is unknown
    */
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

   /**
    * Reusable helper that applies the editable details in the request to the supplied game.
    * Replaces the full genre selection so genres omitted from the request are removed.
    * Void return so the caller knows the method updates the game it was given.
    *
    * @param game the game entity to modify
    * @param request the complete set of editable game details
    * @throws ResponseStatusException with HTTP 400 if any genre name is unknown from resolveGenres() call
    */
   private void setGameProperties(Game game, GameRequest request) {
      List<Genre> selectedGenres = resolveGenres(request.genres());

      game.setName(request.name());
      game.setCoverImageUrl(request.coverImageUrl());
      game.setRating(request.rating());
      game.setReview(request.review());
      game.setReleaseYear(request.releaseYear());
      game.setDescription(request.description());

      // Clear the existing genres
      game.getGenres().clear();
      game.getGenres().addAll(selectedGenres);

      if (request.playStatus() != null) {
         game.setPlayStatus(request.playStatus());
      }

      if (request.playModes() != null) {
         game.getPlayModes().clear();
         game.getPlayModes().addAll(request.playModes());
      }
   }

   /**
    * Returns all the base games in the specified user's collection.
    *
    * @param user the user whose collection to retrieve
    * @return the user's base games, or an empty list if the collection has no games
    */
   public List<GameResponse> getGames(User user) {
      return gameRepository.findAllByUser_IdAndParentGameIsNull(user.getId())
              .stream()
              .map(this::toGameResponse)
              .toList();
   }

   /**
    * Retrieves a game by ID from the specified user's collection.
    *
    * @param gameId the database ID of the game to retrieve
    * @param user the user whose collection to search
    * @return the matching game's details
    * @throws ResponseStatusException with HTTP 404 if the user has no game with that ID
    */
   @Transactional(readOnly = true)
   public GameResponse getGame(Long gameId, User user) {
      return gameRepository.findByIdAndUser_Username(gameId, user.getUsername())
              .map(this::toGameResponse)
              .orElseThrow(() ->
                      new ResponseStatusException((HttpStatus.NOT_FOUND), "Game not found")
              );
   }

   /**
    * Retrieves dlcs associated with the parent game's gameId from the specified user's collection.
    *
    * @param gameId the database ID of the parent game the dlcs belong to
    * @param user the user whose collection to search
    * @return the matching dlc games' details
    * @throws ResponseStatusException with HTTP 404 if the user has no parent game with that ID
    *                                 with HTTP 400 if the parentGame is not a base game
    */
   @Transactional(readOnly = true)
   public List<GameResponse> getDlcs(Long gameId, User user) {

      Game parentGame = gameRepository.findByIdAndUser_Username(gameId, user.getUsername())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.NOT_FOUND, "Base game not found"
              ));

      if (parentGame.getParentGame() != null) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "DLC must belong to a base game"
         );
      }

      return gameRepository.findAllByUser_IdAndParentGame_Id(user.getId(), gameId)
              .stream()
              .map(this::toGameResponse)
              .toList();
   }

   /**
    * Saves a new game in the specified user's collection.
    * Responds with HTTP 400 if any requested genre is unknown.
    *
    * @param user the user who will own the game
    * @param gameRequest the details of the game to create
    * @return the saved game's details, including its generated ID
    */
   @Transactional
   public GameResponse createGame(User user, GameRequest gameRequest) {
      Game newGame = new Game();
      newGame.setUser(user);
      setGameProperties(newGame, gameRequest);

      return toGameResponse(gameRepository.save(newGame)) ;
   }

   /**
    * Saves a new game in the specified user's collection.
    * Responds with HTTP 400 if any requested genre is unknown.
    *
    * @param user the user who will own the dlc game
    * @param gameRequest the details of the dlc game to create
    * @return the saved dlc game's details, including its generated ID
    * @throws ResponseStatusException with HTTP 404 if the gameId isn't found
    *                                 with HTTP 400 if the parentGame isn't a base game
    */
   @Transactional
   public GameResponse createDlc(Long gameId, User user, GameRequest gameRequest) {
      Game parentGame = gameRepository.findByIdAndUser_Username(gameId, user.getUsername())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.NOT_FOUND, "Base game not found"
         ));

      // DLC can't be associated with another DLC
      if (parentGame.getParentGame() != null) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "DLC must belong to a base game"
         );
      }

      Game newGame = new Game();
      newGame.setUser(user);

      setGameProperties(newGame, gameRequest);

      newGame.setParentGame(parentGame);

      return toGameResponse(gameRepository.save(newGame)) ;
   }

   /**
    * Updates the editable details of a game in the specified user's collection.
    * Responds with HTTP 400 if any requested genre is unknown.
    *
    * @param gameId the database ID of the game to update
    * @param username the username of the user whose collection to search
    * @param gameRequest the complete set of editable game details
    * @return the game's details after the update is saved
    * @throws ResponseStatusException with HTTP 404 if the user has no game with that ID
    */
   @Transactional
   public GameResponse updateGame(Long gameId, String username, GameRequest gameRequest) {
      Game existingGame = gameRepository.findByIdAndUser_Username(gameId, username)
              .orElseThrow(() ->
                      new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found")
              );

      setGameProperties(existingGame, gameRequest);

      return toGameResponse(gameRepository.save(existingGame));
   }

   /**
    * Deletes a game from the specified user's collection.
    *
    * @param gameId the database ID of the game to delete
    * @param username the username of the user whose collection to search
    * @throws ResponseStatusException with HTTP 404 if the user has no game with that ID
    */
   public void deleteGame(Long gameId, String username) {
      Game game = gameRepository.findByIdAndUser_Username(gameId, username)
              .orElseThrow(() ->
                      new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found")
              );

      gameRepository.delete(game);
   }

}
