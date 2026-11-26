package com.tulip.gamejournalapi.dto;

import com.tulip.gamejournalapi.entities.PlayMode;
import com.tulip.gamejournalapi.entities.PlayStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public record GameResponse(
        Long id,
        String name,
        String coverImageUrl,
        BigDecimal rating,
        List<String> genres,
        String review,
        Integer releaseYear,
        String description,
        Long parentGameId,
        PlayStatus playStatus,
        Set<PlayMode> playModes,
        Integer playTime
) { }
