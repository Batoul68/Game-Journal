package com.tulip.gamejournalapi.integration.igdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Component
public class IgdbClient {

   private final RestClient restClient = RestClient.create();

   private record TwitchTokenResponse(
           @JsonProperty("access_token") String accessToken,
           @JsonProperty("expires_in") long expiresIn
   ) {}

   private final String clientId;
   private final String clientSecret;

   public IgdbClient(
           @Value("${TWITCH_CLIENT_ID}") String clientId,
           @Value("${TWITCH_CLIENT_SECRET}") String clientSecret
   ) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
   }

   // Method that sends the request to https://id.twitch.tv/oauth2/token to get the access token
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
}
