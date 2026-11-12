package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.dto.GameRequest;
import com.tulip.gamejournalapi.dto.GameResponse;
import com.tulip.gamejournalapi.entities.Game;
import com.tulip.gamejournalapi.entities.Genre;
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
    private final UserRepository userRepository;
    private final GameService gameService;

    public GameController(UserRepository userRepository, GameService gameService) {
        this.userRepository = userRepository;
        this.gameService = gameService;
    }

    /**
     * Handles request to GET all games associated with logged-in user.
     *
     * @param authentication the current user's authentication supplied by Spring Security
     * @return the user's list of games, or an empty list if there are none
     * @throws UsernameNotFoundException if no user record exists for the authenticated username
     */
    @GetMapping
    public List<GameResponse> getGames(Authentication authentication) {

        String username = authentication.getName();
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return gameService.getGames(user.getId());
    }

    /**
     * Handles request to GET a specific game from the logged-in user's collection using the game's ID .
     * Responds with HTTP 404 if the user has no game with that ID
     *
     * @param gameId the ID of the game to retrieve, taken from the URL
     * @param authentication the current user's authentication supplied by Spring Security
     * @return the matching game if found
     */
    @GetMapping("/{id}")
    public GameResponse getGameById(@PathVariable("id") Long gameId, Authentication authentication) {

        return gameService.getGame(gameId, authentication.getName());
    }

    /**
     * Handles request to POST a new game to the logged-in user's collection.
     *
     * @param gameRequest the details of the game to create
     * @param authentication the current user's authentication supplied by Spring Security
     * @return the saved game's details, including generated game ID
     * @throws UsernameNotFoundException if no user record exists for the authenticated username
     */
    @PostMapping
    public GameResponse addGame( @Valid @RequestBody GameRequest gameRequest, Authentication authentication) {

        String username = authentication.getName();
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return gameService.createGame(user, gameRequest);
    }

    /**
     * Handles PUT request to update a game in the logged-in user's collection, specified by the game's ID.
     *
     * @param gameId the ID of the game to update, taken from the URL
     * @param authentication the current user's authentication supplied by Spring Security
     * @param gameRequest the complete set of editable game details
     * @return the game's details after the update is saved
     */
    @PutMapping("/{id}")
    public GameResponse updateGame(
            @PathVariable("id") Long gameId,
            Authentication authentication,
            @Valid @RequestBody GameRequest gameRequest
    ) {
        return gameService.updateGame(gameId, authentication.getName(), gameRequest);
    }

    /**
     * Handles DELETE request to delete a game in the logged-in user's collection, specified by the game's ID
     *
     * @param gameId the ID of the game to delete, taken from the URL
     * @param authentication the current user's authentication supplied by Spring Security
     * @return HTTP 204 No Content after the game is deleted
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable("id") Long gameId, Authentication authentication) {
        System.out.println("DELETE controller reached, game ID: "+ gameId);
        gameService.deleteGame(gameId, authentication.getName());

        return ResponseEntity.noContent().build();
    }
}
