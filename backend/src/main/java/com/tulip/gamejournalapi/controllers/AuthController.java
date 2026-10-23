package com.tulip.gamejournalapi.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

   @GetMapping("/api/auth/csrf")
   public CsrfToken csrf(CsrfToken csrfToken) {
      return csrfToken;
   }

   @GetMapping("/api/auth/me")
   public Map<String, String> me(Authentication authentication) {
      return Map.of("username", authentication.getName());
   }
}
