package com.tulip.gamejournalapi.security;

import com.tulip.gamejournalapi.entities.User;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class SecurityUser implements UserDetails {

   private final User user;

   public SecurityUser(User user) {
      this.user = user;
   }

   @Override
   public @Nullable String getPassword() {
      return user.getPassword();
   }

   @Override
   public String getUsername() {
      return user.getUsername();
   }

   @Override
   public Collection<? extends GrantedAuthority> getAuthorities() {
      return user.getRoles()
              .stream()
              .map(SecurityRole::new)
              .collect(Collectors.toList());
   }
}
