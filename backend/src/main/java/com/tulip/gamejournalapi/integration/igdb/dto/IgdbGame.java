package com.tulip.gamejournalapi.integration.igdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record IgdbGame(
        Long id,
        String name,
        IgdbCover cover,
        @JsonProperty("first_release_date") Long firstReleaseDate,
        List<IgdbGenre> genres,
        String summary,
        String storyline
) { }
