package com.tulip.gamejournalapi.integration.igdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record IgdbGame(
        Long id,
        String name,
        IgdbCover cover,
        @JsonProperty("first_release_date") Long firstReleaseDate,
        String summary,
        String storyline
) { }
