package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.dto.GameRequest;
import com.tulip.gamejournalapi.dto.GameResponse;
import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.GameRepository;
import com.tulip.gamejournalapi.repositories.UserRepository;
import com.tulip.gamejournalapi.services.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    private final GameService gameService;

    public GameController(GameRepository repository, UserRepository userRepository, GameService gameService) {
        this.gameRepository = repository;
        this.userRepository = userRepository;
        this.gameService = gameService;
    }

    // GET games
    @GetMapping
    public List<GameResponse> getGames(Authentication authentication) {

        // Find games associated with logged-in user
        String username = authentication.getName();
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return gameRepository.findByUserId(user.getId())
                .stream()
                .map(game -> new GameResponse(
                        game.getId(),
                        game.getName(),
                        game.getCoverImageUrl(),
                        game.getRating(),
                        game.getGenre(),
                        game.getReview()
                ))
                .toList();
    }

    // GET specific game by id
    @GetMapping("/{id}")
    public GameResponse getGameById(@PathVariable("id") Long gameId, Authentication authentication) {

        // Find game if associated with logged-in user
        String username = authentication.getName();

        return gameRepository.findByIdAndUser_Username(gameId, username)
                .map(game -> new GameResponse(
                        game.getId(),
                        game.getName(),
                        game.getCoverImageUrl(),
                        game.getRating(),
                        game.getGenre(),
                        game.getReview()
                ))
                .orElseThrow(() ->
                        new ResponseStatusException((HttpStatus.NOT_FOUND), "Game not found")
                );
    }

    // POST a game
    @PostMapping
    public GameResponse addGame(Authentication authentication, @Valid @RequestBody GameRequest gameRequest) {

        // Send user to create game
        String username = authentication.getName();
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Game savedGame =  gameService.createGame(
                user,
                gameRequest.name(),
                gameRequest.coverImageUrl(),
                gameRequest.rating(),
                gameRequest.genre(),
                gameRequest.review()
        );

        return new GameResponse(
                savedGame.getId(),
                savedGame.getName(),
                savedGame.getCoverImageUrl(),
                savedGame.getRating(),
                savedGame.getGenre(),
                savedGame.getReview()
        );
    }

    // PUT edit a game
    @PutMapping("/{id}")
    public GameResponse updateGame(
            @PathVariable("id") Long id,
            Authentication authentication,
            @Valid @RequestBody GameRequest request
    ) {
        Game updatedGame = gameService.updateGame(id, authentication.getName(), request);

        return new GameResponse(
                updatedGame.getId(),
                updatedGame.getName(),
                updatedGame.getCoverImageUrl(),
                updatedGame.getRating(),
                updatedGame.getGenre(),
                updatedGame.getReview()
        );
    }

    // DELETE a game
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable("id") Long id, Authentication authentication) {
        System.out.println("DELETE controller reached, game ID: "+ id);
        gameService.deleteGame(id, authentication.getName());

        return ResponseEntity.noContent().build();
    }
}
