package com.tulip.gamejournalapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record JournalEntryRequest(
        @NotNull Long targetGameId,
        @NotBlank String body,
        String title
) { }
