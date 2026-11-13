package com.tulip.gamejournalapi.integration.igdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record IgdbGenre(
        @JsonProperty("genres.name") String name
) { }
