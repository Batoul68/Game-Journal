package com.tulip.gamejournalapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tulip.gamejournalapi.entities.Game;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Integer> {

   List<Game> findByUserId(Integer id);
}
