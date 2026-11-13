package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.dto.GameMetadataResponse;
import com.tulip.gamejournalapi.integration.igdb.IgdbClient;
import com.tulip.gamejournalapi.integration.igdb.dto.IgdbCover;
import com.tulip.gamejournalapi.integration.igdb.dto.IgdbGame;
import com.tulip.gamejournalapi.integration.igdb.dto.IgdbGenre;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class GameMetadataService {

   private final IgdbClient igdbClient;

   public GameMetadataService(IgdbClient igdbClient) {
      this.igdbClient = igdbClient;
   }

   /**
    * Reusable helper that converts an IGDB search result into a game metadata API response.
    * Builds the cover URL from the image ID, extracts the release year in UTC,
    * and extract the list of genres.
    *
    * @param igdbGame the IGDB search result to convert
    * @return the game's metadata, with {@code null} for a missing cover URL or release year
    */
   private GameMetadataResponse toGameMetadataResponse(IgdbGame igdbGame) {

      IgdbCover cover = igdbGame.cover();
      String coverImageUrl = null;

      if (cover != null && cover.imageId() != null && !cover.imageId().isBlank()) {
         coverImageUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/" +
                 cover.imageId() + ".jpg";
      }

      Integer releaseYear = null;

      if (igdbGame.firstReleaseDate() != null) {
         Instant instant = Instant.ofEpochSecond(igdbGame.firstReleaseDate());
         releaseYear = instant.atZone(ZoneOffset.UTC).getYear();
      }

      List<String> genreNames = igdbGame.genres() == null
              ? List.of()
              : igdbGame.genres()
                  .stream()
                  .map(IgdbGenre::name)
                  .toList();

      return new GameMetadataResponse(
              igdbGame.id(),
              igdbGame.name(),
              coverImageUrl,
              releaseYear,
              genreNames,
              igdbGame.summary(),
              igdbGame.storyline()
      );
   }

   /**
    * Searches IGDB by title and converts the matches into game metadata responses.
    *
    * @param title the title of the game to search for
    * @return the matching game metadata, or an empty list if no games match
    * @throws org.springframework.web.server.ResponseStatusException with HTTP 400 if the title is blank after cleanup
    */
   public List<GameMetadataResponse> searchByTitle(String title) {

      // Separate variable to inspect raw results before mapping
      List<IgdbGame> igdbMatches = igdbClient.searchByTitle(title);

      return igdbMatches
              .stream()
              .map(this::toGameMetadataResponse)
              .toList();
   }
}


