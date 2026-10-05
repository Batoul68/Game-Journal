package com.tulip.gamejournalapi.controller;

import com.tulip.gamejournalapi.model.Game;
import com.tulip.gamejournalapi.repository.GameRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    public Game addGame(@RequestBody Game game) {
        return repository.save(game);
    }
}
