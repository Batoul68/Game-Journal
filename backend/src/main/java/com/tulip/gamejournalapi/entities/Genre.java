package com.tulip.gamejournalapi.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "genres")
public class Genre {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;

   @Column(nullable = false, unique = true)
   private String name;

   protected Genre() {

   }

   public int getId() {
      return id;
   }

   public String getName() {
      return name;
   }

}
