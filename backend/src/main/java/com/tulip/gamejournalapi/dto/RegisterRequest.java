package com.tulip.gamejournalapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username cannot be empty")
        @Size(min = 3, message = "Username must be at least 3 characters")
        String username,

        @NotBlank(message = "Password cannot be empty")
        String password
) {}
