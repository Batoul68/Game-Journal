package com.tulip.gamejournalapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class SecurityConfig {

   @Bean
   public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception{
      return http
              .cors(Customizer.withDefaults())
              .authorizeHttpRequests(auth -> auth
                      .requestMatchers("/api/auth/login", "/api/auth/csrf").permitAll()
                      .anyRequest().authenticated()
              )
              .formLogin(login -> login
                      .loginProcessingUrl("/api/auth/login")
                      .successHandler((request, response, authentication) ->
                              response.setStatus(204))
                      .failureHandler((request, response, exception) ->
                              response.setStatus(401))
              )
              .logout(logout -> logout
                      .logoutUrl("/api/auth/logout")
                      .logoutSuccessHandler((request, response, authentication) ->
                              response.setStatus(204))
              )
              .exceptionHandling(exceptions -> exceptions
                      .authenticationEntryPoint((request, response, authException) ->
                              response.setStatus(401))
              )
              .logout(LogoutConfigurer::permitAll)
              .build();
   }

   @Bean
   public UrlBasedCorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration config = new CorsConfiguration();

      config.addAllowedOrigin("http://localhost:5173");
      config.addAllowedHeader("*");
      config.addAllowedMethod("*");
      config.setAllowCredentials(true);

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", config);

      return source;
   }

   @Bean
   public UserDetailsService userDetailsService() {
      var uds = new InMemoryUserDetailsManager();

      var u1 = User.withUsername("melly")
              .password(passwordEncoder().encode("12345"))
              .roles("USER")
              .build();

      uds.createUser(u1);

      return uds;
   }

   @Bean
   public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
   }
}
