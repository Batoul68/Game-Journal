package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.integration.supabase.SupabaseStorageClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.MemoryCacheImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;

@Service
public class JournalImageService {

   private static final long MAX_FILE_BYTES = 5L * 1024 * 1024;
   private static final long MAX_IMAGE_PIXELS = 20_000_000L;

   private final SupabaseStorageClient storageClient;

   public JournalImageService(SupabaseStorageClient storageClient) {
      this.storageClient = storageClient;
   }

   /**
    * Helper method to check that the bytes from an image contain a decodable JPEG or PNG within
    * the configured pixel limit.
    *
    * @param imageBytes the uploaded file's contents
    * @return the media type detected from the image contents
    * @throws IOException if reading or decoding the image fails
    * @throws ResponseStatusException with HTTP 400 if the format is unsupported or the image exceeds the pixel limit
    */
   private MediaType validateImageBytes(byte[] imageBytes) throws IOException {
      try (MemoryCacheImageInputStream input =
                   new MemoryCacheImageInputStream(new ByteArrayInputStream(imageBytes))) {

         Iterator<ImageReader> readers = ImageIO.getImageReaders(input);

         if (!readers.hasNext()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Choose a valid JPEG or PNG image"
            );
         }

         ImageReader reader = readers.next();

         try {
            reader.setInput(input);

            String format = reader.getFormatName();
            MediaType contentType;

            if ("JPEG".equalsIgnoreCase(format)) {
               contentType = MediaType.IMAGE_JPEG;
            } else if ("PNG".equalsIgnoreCase(format)) {
               contentType = MediaType.IMAGE_PNG;
            } else {
               throw new ResponseStatusException(
                       HttpStatus.BAD_REQUEST, "Choose a JPEG or PNG image"
               );
            }

            long pixels = (long) reader.getWidth(0) * reader.getHeight(0);

            if (pixels > MAX_IMAGE_PIXELS) {
               throw new ResponseStatusException(
                       HttpStatus.BAD_REQUEST, "Image must contain no more than 20 million pixels"
               );
            }

            reader.read(0);

            return contentType;
         } finally {
            reader.dispose();
         }
      }
   }

   /**
    * Validates a journal image and uploads it to Supabase Storage.
    *
    * @param image the uploaded JPEG or PNG file
    * @return the storage key identifying the uploaded image
    * @throws ResponseStatusException with HTTP 400 if the file is empty, unreadable, unsupported, or exceeds byte limit
    *                                 with HTTP 502 if the storage request fails
    */
   public String uploadImage(MultipartFile image) {
      if (image == null || image.isEmpty()) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "Choose an image to upload"
         );
      }

      if (image.getSize() > MAX_FILE_BYTES) {
         throw new ResponseStatusException(
                 HttpStatus.CONTENT_TOO_LARGE, "Image must be 5 MiB or smaller"
         );
      }

      try {
         byte[] imageBytes = image.getBytes();
         MediaType contentType = validateImageBytes(imageBytes);

         return storageClient.uploadImage(imageBytes, contentType);

      } catch (IOException exception) {
         throw new ResponseStatusException(
                 HttpStatus.BAD_REQUEST, "Could not read a valid image"
         );
      }
   }

   /**
    * Creates a temporary viewing URL for a saved journal image
    *
    * @param imageKey the saved image key or null for an entry without an image
    * @return the signed image URL, or null if the entry has no image
    * @throws ResponseStatusException with HTTP 502 if URL creation fails
    */
   public String getImageUrl(String imageKey) {
      if (imageKey == null || imageKey.isBlank()) {
         return null;
      }

      return storageClient.createSignedImageUrl(imageKey);

   }

   /**
    * Deletes a previously uploaded journal image
    *
    * @param imageKey the stored key identifying the image
    * @throws ResponseStatusException with HTTP 502 if deletion fails
    */
   public void deleteImage (String imageKey) {
      storageClient.deleteImage(imageKey);
   }
}
