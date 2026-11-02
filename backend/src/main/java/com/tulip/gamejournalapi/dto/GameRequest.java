package com.tulip.gamejournalapi.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record GameRequest(
        @NotBlank
        @Size(max = 200, message = "Game title cannot exceed 200 characters")
        String name,

        String coverImageUrl,

        @DecimalMin("0.0")
        @DecimalMax("10.0")
        @Digits(integer = 2, fraction = 1)
        BigDecimal rating,

        @Size(max = 50, message = "Genre cannot exceed 50 characters")
        String genre,

        String review
) { }
