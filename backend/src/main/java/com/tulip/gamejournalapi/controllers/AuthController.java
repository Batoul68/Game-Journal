package com.tulip.gamejournalapi.controllers;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

   @GetMapping("/api/auth/csrf")
   public CsrfToken csrf(CsrfToken csrfToken) {
      return csrfToken;
   }
}
