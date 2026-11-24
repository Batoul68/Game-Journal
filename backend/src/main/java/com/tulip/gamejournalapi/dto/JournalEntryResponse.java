package com.tulip.gamejournalapi.dto;

import java.time.Instant;

public record JournalEntryResponse(
        Long id,
        Long gameId,
        String body,
        Instant createdAt,
        String imageUrl
) { }
