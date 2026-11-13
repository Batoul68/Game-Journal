package com.tulip.gamejournalapi.dto;

import java.util.List;

public record GameMetadataResponse(
        Long igdbId,
        String name,
        String coverImageUrl,
        Integer releaseYear,
        List<String> genreNames,
        String summary,
        String storyline
) { }
