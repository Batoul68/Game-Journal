package com.tulip.gamejournalapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tulip.gamejournalapi.entities.Game;

import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Integer> {

   List<Game> findByUserId(Integer userId);

   Optional<Game> findByIdAndUser_Username (Long gameId, String username);
}
