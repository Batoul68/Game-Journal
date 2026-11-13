package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.dto.GameMetadataResponse;
import com.tulip.gamejournalapi.services.GameMetadataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/game-metadata/search")
public class GameMetadataController {

   private final GameMetadataService gameMetadataService;

   public GameMetadataController(GameMetadataService gameMetadataService) {
      this.gameMetadataService = gameMetadataService;
   }

   /**
    * Handles GET request to search IGDB by title.
    * Responds with HTTP 400 if no title is given.
    *
    * @param title the game to search for
    * @return the matching game metadata, or an empty list if no games match
    */
   @GetMapping
   public List<GameMetadataResponse> getGameByTitle(String title) {
      return gameMetadataService.searchByTitle(title);
   }
}
