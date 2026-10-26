package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.GameRepository;
import com.tulip.gamejournalapi.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public GameController(GameRepository repository, UserRepository userRepository) {
        this.gameRepository = repository;
        this.userRepository = userRepository;
    }

    // GET (read)
    @GetMapping
    public List<Game> getGames(Authentication authentication) {

        // Find games associated with logged-in user
        String username = authentication.getName();
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return gameRepository.findByUserId(user.getId());
    }

    // POST (create)
    @PostMapping
    public Game addGame(@Valid @RequestBody Game game) {
        return gameRepository.save(game);
    }
}
