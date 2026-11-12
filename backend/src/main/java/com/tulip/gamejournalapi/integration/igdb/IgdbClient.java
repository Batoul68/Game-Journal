package com.tulip.gamejournalapi.integration.igdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.Instant;

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
}
