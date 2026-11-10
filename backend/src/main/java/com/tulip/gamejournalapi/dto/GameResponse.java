package com.tulip.gamejournalapi.dto;

import java.math.BigDecimal;
import java.util.List;

public record GameResponse(
        Long id,
        String name,
        String coverImageUrl,
        BigDecimal rating,
        List<String> genres,
        String review,
        Integer releaseYear,
        String description
) { }
