package com.tulip.gamejournalapi.integration.supabase;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class SupabaseStorageClient {

   private final RestClient restClient;
   private final String bucket;
   private final String storageBaseUrl;

   public SupabaseStorageClient(
           @Value("${app.storage.supabase.url}") String projectUrl,
           @Value("${app.storage.supabase.secret-key}") String secretKey,
           @Value("${app.storage.supabase.bucket}") String bucket
   ) {
      this.storageBaseUrl = projectUrl + "/storage/v1";
      this.restClient = RestClient.builder()
              .baseUrl(storageBaseUrl)
              .defaultHeader("apikey", secretKey)
              .build();

      this.bucket = bucket;
   }

   /**
    * Uploads validated image bytes to Supabase Storage using a generated key
    *
    * @param imageBytes the contents of the validated image
    * @param contentType the image's detected media type, either JPEG or PNG
    * @return the storage key identifying the uploaded image
    * @throws ResponseStatusException with HTTP 400 if the media type is unsupported
    *                                 with HTTP 502 if the upload request fails
    */
   public String uploadImage(byte[] imageBytes, MediaType contentType) {
      String extension;

      if (MediaType.IMAGE_JPEG.equals(contentType)) {
         extension = ".jpg";
      } else if (MediaType.IMAGE_PNG.equals(contentType)) {
         extension = ".png";
      } else {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "Choose a JPEG or PNG image"
         );
      }

      String imageKey = "entries/" + UUID.randomUUID() + extension;

      try {
         restClient.post()
                 .uri("/object/{bucket}/{imageKey}", bucket, imageKey)
                 .contentType(contentType)
                 .body(imageBytes)
                 .retrieve()
                 .toBodilessEntity();
      } catch (RestClientException exception) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_GATEWAY, "Could not upload the journal image", exception
         );
      }

      return imageKey;
   }

   /**
    * Creates a temporary viewing URL for an image in the configured bucket.
    *
    * @param imageKey the stored key identifying the image
    * @return the complete signed URL, valid for one hour
    * @throws ResponseStatusException with HTTP 502 if Supabase fails to return a usable signed URL
    */
   public String createSignedImageUrl(String imageKey) {
      try {
         SupabaseSignedUrlResponse response = restClient.post()
                 .uri("/object/sign/{bucket}/{imageKey}", bucket, imageKey)
                 .contentType(MediaType.APPLICATION_JSON)
                 .body(Map.of("expiresIn", 3600))
                 .retrieve()
                 .body(SupabaseSignedUrlResponse.class);

         if (response == null || response.signedUrl() == null || response.signedUrl().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "Image storage returned no viewing URL"
            );
         }

         return storageBaseUrl + response.signedUrl();
      } catch (RestClientException exception) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_GATEWAY, "Could not create an image viewing URL", exception
         );
      }
   }

   /**
    * Deletes an image from the configured Supabase bucket
    *
    * @param imageKey the stored key identifying the image to delete
    * @throws ResponseStatusException with HTTP 502 if the storage request fails
    */
   public void deleteImage(String imageKey) {
      try {
         restClient.method(HttpMethod.DELETE)
                 .uri("/object/{bucket}", bucket)
                 .contentType(MediaType.APPLICATION_JSON)
                 .body(Map.of("prefixes", List.of(imageKey)))
                 .retrieve()
                 .toBodilessEntity();
      } catch (RestClientException exception) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_GATEWAY, "Could not delete the journal image", exception
         );
      }
   }


}
