package com.tulip.gamejournalapi.services;

import com.tulip.gamejournalapi.entities.Role;
import com.tulip.gamejournalapi.entities.User;
import com.tulip.gamejournalapi.repositories.RoleRepository;
import com.tulip.gamejournalapi.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

/**
 * Handle creating a new account
 */
@Service
public class RegistrationService {

   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;
   private final RoleRepository roleRepository;

   public RegistrationService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
      this.userRepository = userRepository;
      this.passwordEncoder = passwordEncoder;
      this.roleRepository = roleRepository;
   }

   /**
    * Creates a user account with an encoded password and the default {@code ROLE_USER} role.
    *
    * @param username the requested username
    * @param password the raw password to encode before saving
    * @throws ResponseStatusException with HTTP 409 if the username is already taken
    * @throws IllegalStateException if the default role is missing from the database
    */
   public void register(String username, String password) {

      // Check if username exists in database
      if (userRepository.findUserByUsername(username).isPresent()) {
         throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
      }

      // Create new user
      User user = new User();
      user.setUsername(username);
      user.setPassword(passwordEncoder.encode(password));

      // Default role = USER
      Role defaultRole = roleRepository.findByName("ROLE_USER")
              .orElseThrow(() -> new IllegalStateException("Default role is missing"));

      user.getRoles().add(defaultRole);
      userRepository.save(user);
   }
}
