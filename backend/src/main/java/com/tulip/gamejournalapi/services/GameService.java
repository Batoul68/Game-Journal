package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.GameRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GameService {

   private final GameRepository gameRepository;

   public GameService(GameRepository gameRepository) {
      this.gameRepository = gameRepository;
   }

   // Creating a new game
   public Game createGame(User user, String name) {
      Game newGame = new Game();
      newGame.setUser(user);
      newGame.setName(name);

      return gameRepository.save(newGame);
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
