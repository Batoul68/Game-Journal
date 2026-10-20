package com.tulip.gamejournalapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tulip.gamejournalapi.entities.Game;

public interface GameRepository extends JpaRepository<Game, Integer> {
}
