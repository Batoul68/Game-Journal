package com.tulip.gamejournalapi.dto;

public record GameMetadataResponse(
        Long igdbId,
        String name,
        String coverImageUrl,
        Integer releaseYear,
        String summary,
        String storyline
) { }
