package com.tulip.gamejournalapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

   @Bean
   public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
   }

   @Bean
   public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
      UserDetails user = User.withUsername("tulip")
              .password(passwordEncoder.encode("password"))
              .roles("USER")
              .build();

      return new InMemoryUserDetailsManager(user);
   }

   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http    .cors(Customizer.withDefaults())
              .csrf(Customizer.withDefaults())
              .authorizeHttpRequests(auth -> auth
                      .requestMatchers(
                              "/api/auth/csrf",
                              "/api/auth/login",
                              "/error"
                      ).permitAll()
                      .anyRequest().authenticated()
              )

              .formLogin(form -> form
                      .loginProcessingUrl("/api/auth/login")
                      .successHandler((request, response, authentication) ->
                              response.setStatus(204)
                      )
                      .failureHandler((request, response, exception) ->
                              response.setStatus(401)
                      )
              )


              .logout(logout -> logout
                      .logoutUrl("/api/auth/logout")
                      .logoutSuccessHandler((request, response, authentication) ->
                              response.setStatus(204)
                      )
              )

              .exceptionHandling(exceptions -> exceptions
                      .authenticationEntryPoint((request, response, authException) ->
                              response.setStatus(401)
                      )
              )
              .requestCache(cache -> cache.disable());



      return http.build();
   }

   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();

      configuration.setAllowedOrigins(List.of(
              "http://localhost:5173",
              "http://127.0.0.1:5173"
      ));
      configuration.setAllowedMethods(List.of(
              "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
      ));
      configuration.setAllowedHeaders(List.of(
              "Content-Type", "X-CSRF-TOKEN"
      ));
      configuration.setAllowCredentials(true);

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);

      return source;
   }
}
