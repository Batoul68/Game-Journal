package com.tulip.gamejournalapi.repositories;

import com.tulip.gamejournalapi.entities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
   List<Genre> findByNameIn(Collection<String> names);
}
