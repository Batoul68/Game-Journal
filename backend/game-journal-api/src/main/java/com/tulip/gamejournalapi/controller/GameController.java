package com.tulip.gamejournalapi.controller;

import com.tulip.gamejournalapi.model.Game;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final List<Game> games = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(3);

    public GameController() {
        games.add(new Game(1L, "Resident Evil 4"));
        games.add(new Game(2L, "Ace Attorney"));
        games.add(new Game(3L, "Red Dead Redemption"));
    }

    @GetMapping
    public List<Game> getGames() {
        return games;
    }

    @PostMapping
    public Game addGame(@RequestBody Game game) {
        game.setId(idGenerator.incrementAndGet());
        games.add(game);
        return game;
    }
}
