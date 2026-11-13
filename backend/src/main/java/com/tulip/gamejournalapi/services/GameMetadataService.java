package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.dto.GameMetadataResponse;
import com.tulip.gamejournalapi.integration.igdb.IgdbClient;
import com.tulip.gamejournalapi.integration.igdb.dto.IgdbCover;
import com.tulip.gamejournalapi.integration.igdb.dto.IgdbGame;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;

@Service
public class GameMetadataService {

   private final IgdbClient igdbClient;

   public GameMetadataService(IgdbClient igdbClient) {
      this.igdbClient = igdbClient;
   }

   /**
    * Reusable helper that converts an IGDB search result into a game metadata API response.
    * Builds the cover URL from the image ID and extracts the release year in UTC.
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

      return new GameMetadataResponse(
              igdbGame.id(),
              igdbGame.name(),
              coverImageUrl,
              releaseYear,
              igdbGame.summary(),
              igdbGame.storyline()
      );
   }

   


}
