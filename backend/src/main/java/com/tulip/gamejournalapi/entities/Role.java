package com.tulip.gamejournalapi.entities;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int id;

   @Column(nullable = false, unique = true)
   private String name;

   @ManyToMany(mappedBy = "roles")
   private Set<User> users = new HashSet<>();

   public int getId() {
      return id;
   }

   public void setId(int id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public Set<User> getUsers() {
      return users;
   }

   public void setUsers(Set<User> users) {
      this.users = users;
   }


}
