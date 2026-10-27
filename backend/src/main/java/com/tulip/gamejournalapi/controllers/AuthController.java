package com.tulip.gamejournalapi.controllers;

import com.tulip.gamejournalapi.dto.RegisterRequest;
import com.tulip.gamejournalapi.services.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

   private RegistrationService registrationService;

   public AuthController(RegistrationService registrationService) {
      this.registrationService = registrationService;
   }

   @GetMapping("/csrf")
   public CsrfToken csrf(CsrfToken csrfToken) {
      return csrfToken;
   }

   @GetMapping("/me")
   public Map<String, String> me(Authentication authentication) {
      return Map.of("username", authentication.getName());
   }

   @PostMapping("/register")
   public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
      registrationService.register(
              request.username(),
              request.password()
      );
      return ResponseEntity.status(HttpStatus.CREATED).build();
   }
}
