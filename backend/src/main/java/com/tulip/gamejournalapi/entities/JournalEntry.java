package com.tulip.gamejournalapi.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "journal_entries")
public class JournalEntry {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @ManyToOne(fetch = FetchType.LAZY, optional = false)
   @JoinColumn(name = "game_id", nullable = false)
   private Game game;

   @Column(nullable = false, columnDefinition = "text")
   private String body;

   @Column(name = "created_at", nullable = false)
   private Instant createdAt;

   public Long getId() {
      return id;
   }

   public Game getGame() {
      return game;
   }

   public void setGame(Game game) {
      this.game = game;
   }

   public String getBody() {
      return body;
   }

   public void setBody(String body) {
      this.body = body;
   }

   public Instant getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(Instant createdAt) {
      this.createdAt = createdAt;
   }
}
