package com.tulip.gamejournalapi.integration.igdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tulip.gamejournalapi.integration.igdb.dto.IgdbGame;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

/**
 * Handles getting the Twitch token and building the IGDB query, sending it, reading the response
 */
@Component
public class IgdbClient {

   // For requesting the access token
   private record TwitchTokenResponse(
           @JsonProperty("access_token") String accessToken,
           @JsonProperty("expires_in") long expiresIn
   ) {}

   // For saving the access token and using it
   private record CachedToken(
           String value,
           Instant expiresAt
   ) {}


   private final RestClient restClient = RestClient.create();

   private final String clientId;
   private final String clientSecret;

   private CachedToken cachedToken;

   public IgdbClient(
           @Value("${TWITCH_CLIENT_ID}") String clientId,
           @Value("${TWITCH_CLIENT_SECRET}") String clientSecret
   ) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
   }

   /**
    * Requests a new access token from https://id.twitch.tv/oauth2/token.
    * Need the access token for IGDB requests.
    *
    * @return the access token and its lifetime in seconds
    * @throws IllegalStateException if Twitch returns an empty response body, a missing or blank token,
    *    or a nonpositive lifetime (expired)
    */
   private TwitchTokenResponse requestAppToken() {
      MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
      form.add("client_id", clientId);
      form.add("client_secret", clientSecret);
      form.add("grant_type", "client_credentials");

      TwitchTokenResponse response = restClient.post()
              .uri("https://id.twitch.tv/oauth2/token")
              .contentType(MediaType.APPLICATION_FORM_URLENCODED)
              .body(form)
              .retrieve()
              .body(TwitchTokenResponse.class); // supply the type (TwitchTokenResponse.class), Spring's JSON converter creates instance of TwitchTokenResponse and assigns it to response

      if (response == null || response.accessToken() == null || response.accessToken().isBlank() || response.expiresIn() <= 0) {
         throw new IllegalStateException("Twitch returned an incomplete token response");
      }
      return response;
   }

   /**
    * Returns Twitch app access token for IGDB requests.
    * Reuses the cached token while it is valid and requests a new one
    * from Twitch when the cache is empty or the token has expired.
    *
    * @return the bearer access token to use in Authorization header
    */
   private synchronized String getAccessToken() {
      Instant now = Instant.now(); // used to compare the expiration to the current time

      if (cachedToken != null && now.isBefore(cachedToken.expiresAt())) {
         return cachedToken.value();
      }

      TwitchTokenResponse response = requestAppToken();
      Instant expiresAt = now.plusSeconds(response.expiresIn());

      cachedToken = new CachedToken(response.accessToken(), expiresAt);
      return cachedToken.value();
   }

   // Helper method to clean up title in searchByTitle()
   private @NonNull String cleanUpString(String str) {
      if (str == null) return "";
      str = str.trim().replaceAll("[\"!@#$%&*()_+=<>?{}\\[\\]|]", "");
      str = str.replaceAll("\\s+", " ");
      return str;
   }

   /**
    * Searches IGDB API for a game using its title.
    * Builds the query, sends it to the API, and reads the response
    *
    * @param title the title of the game to search
    * @return a list of matches for the game title, an empty list if there are no matches
    * @throws ResponseStatusException with HTTP 400 if no title is given
    */
   public List<IgdbGame> searchByTitle(String title) {

      // Clean up title
      String cleanTitle = cleanUpString(title);

      // Reject empty title to avoid unnecessary API call
      if (cleanTitle.isBlank()) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "Enter a game title to search"
         );
      }

      String query = """
              search "%s";
              fields id, name, cover.image_id, first_release_date, summary, storyline;
              limit 8;
              """.formatted(cleanTitle);

      List<IgdbGame> matches = restClient.post()
              .uri("https://api.igdb.com/v4/games")
              .header("Client-ID", clientId)
              .headers(headers -> headers.setBearerAuth(getAccessToken()))
              .contentType(MediaType.TEXT_PLAIN)
              .body(query)
              .retrieve()
              .body(new ParameterizedTypeReference<List<IgdbGame>>() { });

      return matches == null ? List.of() : matches;
   }
}
