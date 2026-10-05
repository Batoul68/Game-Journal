package com.tulip.gamejournalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tulip.gamejournalapi.model.Game;

public interface GameRepository extends JpaRepository<Game, Integer> {
}
