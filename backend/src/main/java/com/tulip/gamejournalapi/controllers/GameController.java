package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.repositories.GameRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository repository;

    public GameController(GameRepository repository) {
        this.repository = repository;
    }

    // GET (read)
    @GetMapping
    public List<Game> getGames() {
        return repository.findAll();
    }

    // POST (create)
    @PostMapping
    public Game addGame(@Valid @RequestBody Game game) {
        return repository.save(game);
    }
}
