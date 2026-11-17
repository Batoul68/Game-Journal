package com.tulip.gamejournalapi.dto;

import jakarta.validation.constraints.NotNull;

public record JournalEntryRequest(
        @NotNull Long targetGameId,
        @NotNull String body
) { }
