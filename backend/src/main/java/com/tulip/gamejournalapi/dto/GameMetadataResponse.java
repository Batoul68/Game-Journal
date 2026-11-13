package com.tulip.gamejournalapi.dto;

import java.util.List;

public record GameMetadataResponse(
        Long igdbId,
        String name,
        String coverImageUrl,
        Integer releaseYear,
        List<String> genres,
        String summary,
        String storyline
) { }
