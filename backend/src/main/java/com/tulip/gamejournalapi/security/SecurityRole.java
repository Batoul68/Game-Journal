package com.tulip.gamejournalapi.security;

import com.tulip.gamejournalapi.entities.Role;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;

public class SecurityRole implements GrantedAuthority {

   private final Role role;

   public SecurityRole(Role role) {
      this.role = role;
   }

   @Override
   public @Nullable String getAuthority() {
      return role.getName();
   }
}
