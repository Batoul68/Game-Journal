package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.entities.Genre;
import com.tulip.gamejournalapi.repositories.GenreRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

   private final GenreRepository genreRepository;

   public GenreController(GenreRepository genreRepository) {
      this.genreRepository = genreRepository;
   }

   /**
    * Handles GET request to retrieve all genres
    *
    * @return the list of genres
    */
   @GetMapping
   public List<String> getGenres() {
      return genreRepository.findAll(Sort.by("name")).stream()
              .map(Genre::getName)
              .toList();
   }
}
