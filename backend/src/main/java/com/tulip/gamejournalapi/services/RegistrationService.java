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

   public void register(String username, String password) {

      // Check if username exists in database, throw 409 if exists
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
