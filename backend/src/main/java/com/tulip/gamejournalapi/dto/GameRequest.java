package com.tulip.gamejournalapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GameRequest(
        @NotBlank
        @Size(max = 200, message = "Game title cannot exceed 200 characters")
        String name
) { }
