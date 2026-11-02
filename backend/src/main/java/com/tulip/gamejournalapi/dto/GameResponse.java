package com.tulip.gamejournalapi.dto;

import java.math.BigDecimal;

public record GameResponse(
        Long id,
        String name,
        String coverImageUrl,
        BigDecimal rating,
        String genre,
        String review
) { }
