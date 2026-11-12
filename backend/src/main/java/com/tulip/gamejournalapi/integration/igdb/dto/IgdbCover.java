package com.tulip.gamejournalapi.integration.igdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record IgdbCover(
        @JsonProperty("image_id") String imageId
) { }
