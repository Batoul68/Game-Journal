package com.tulip.gamejournalapi.integration.igdb;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class IgdbClient {

   private final String clientId;
   private final String clientSecret;

   public IgdbClient(
           @Value("${TWITCH_CLIENT_ID}") String clientId,
           @Value("${TWITCH_CLIENT_SECRET}") String clientSecret
   ) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
   }
}
