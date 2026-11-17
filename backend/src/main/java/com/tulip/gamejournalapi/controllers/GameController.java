package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.dto.GameRequest;
import com.tulip.gamejournalapi.dto.GameResponse;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.UserRepository;
import com.tulip.gamejournalapi.services.GameService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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

    private final UserRepository userRepository;
    private final GameService gameService;

    public GameController(UserRepository userRepository, GameService gameService) {
        this.userRepository = userRepository;
        this.gameService = gameService;
    }

    /**
     * Helper methods to validate if user exists in user repository
     *
     * @param authentication the current user's authentication supplied by Spring Security
     * @return a validated user object
     * @throws UsernameNotFoundException if no user record exists for the authenticated username
     */
    private User validateUser(Authentication authentication) {
        return userRepository.findUserByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Handles request to GET all games associated with logged-in user.
     *
     * @param authentication the current user's authentication supplied by Spring Security
     * @return the user's list of games, or an empty list if there are none
     */
    @GetMapping
    public List<GameResponse> getGames(Authentication authentication) {
        return gameService.getGames(validateUser(authentication));
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
        return gameService.getGame(gameId, validateUser(authentication));
    }

    /**
     * Handles request to GET a specific game's dlcs from the logged-in user's collection using the parent game's ID .
     * Responds with HTTP 404 if the user has no parent game with that ID
     * Responds with HTTP 400 if the gameId belongs to a dlc and not a base game
     *
     * @param gameId the ID of the game to retrieve, taken from the URL
     * @param authentication the current user's authentication supplied by Spring Security
     * @return the matching dlc games if found
     */
    @GetMapping("/{id}/dlcs")
    public List<GameResponse> getDlcs(@PathVariable("id") Long gameId, Authentication authentication) {
        return gameService.getDlcs(gameId, validateUser(authentication));
    }

    /**
     * Handles request to POST a new game to the logged-in user's collection.
     *
     * @param gameRequest the details of the game to create
     * @param authentication the current user's authentication supplied by Spring Security
     * @return the saved game's details, including generated game ID
     */
    @PostMapping
    public GameResponse addGame( @Valid @RequestBody GameRequest gameRequest, Authentication authentication) {
        return gameService.createGame(validateUser(authentication), gameRequest);
    }

    /**
     * Handles request to POST a new dlc associated with parent gameId to the logged-in user's collection.
     *
     * @param gameId the ID of the parent game, taken from the URL
     * @param gameRequest the complete set of editable dlc game details
     * @param authentication the current user's authentication supplied by Spring Security
     * @return the saved dlc game's details, including generated game ID
     */
    @PostMapping("/{id}/dlcs")
    public GameResponse addDlc(
            @PathVariable("id") Long gameId,
            @Valid @RequestBody GameRequest gameRequest,
            Authentication authentication
    ) {
        return gameService.createDlc(gameId, validateUser(authentication), gameRequest);
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
        User user = validateUser(authentication);
        return gameService.updateGame(gameId, user.getUsername(), gameRequest);
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

        User user = validateUser(authentication);
        gameService.deleteGame(gameId, user.getUsername());

        return ResponseEntity.noContent().build();
    }

}
