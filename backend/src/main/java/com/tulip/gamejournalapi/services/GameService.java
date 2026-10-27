package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.GameRepository;
import org.springframework.stereotype.Service;

@Service
public class GameService {

   private final GameRepository gameRepository;

   public GameService(GameRepository gameRepository) {
      this.gameRepository = gameRepository;
   }

   public Game createGame(User user, String name) {
      Game newGame = new Game();
      newGame.setUser(user);
      newGame.setName(name);

      return gameRepository.save(newGame);
   }
}
