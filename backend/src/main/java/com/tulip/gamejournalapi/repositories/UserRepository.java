package com.tulip.gamejournalapi.repositories;

import com.tulip.gamejournalapi.entities.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

   @Query("""
    SELECT u FROM User u WHERE u.username = :username
""")
   @EntityGraph(attributePaths = "roles")
   Optional<User> findUserByUsername(String username);
}
