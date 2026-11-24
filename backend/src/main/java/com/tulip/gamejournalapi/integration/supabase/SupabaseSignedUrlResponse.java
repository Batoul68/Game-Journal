package com.tulip.gamejournalapi.integration.supabase;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SupabaseSignedUrlResponse(@JsonProperty("signedURL") String signedUrl) {
}
