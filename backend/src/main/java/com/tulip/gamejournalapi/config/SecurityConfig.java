package com.tulip.gamejournalapi.config;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationServiceException;
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

   /**
    * Configures session-based authentication for Game Journal API.
    * /login, /csrf, /register are available before sign-in for new users.
    * Unauthenticated requests to protected endpoints receive HTTP 401.
    *
    * @param http the Spring Security builder used to configure filter chain
    * @return the configured security filter chain for the API
    * @throws Exception if the security filter chain can't be built
    */
   @Bean
   public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception{
      return http
              .cors(Customizer.withDefaults())
              .authorizeHttpRequests(auth -> auth
                      .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                      .requestMatchers("/api/auth/login", "/api/auth/csrf", "/api/auth/register").permitAll()
                      .anyRequest().authenticated()
              )
              .formLogin(login -> login
                      .loginProcessingUrl("/api/auth/login")
                      .successHandler((request, response, authentication) ->
                              response.setStatus(204))
                      .failureHandler((request, response, exception) -> {
                         if (exception instanceof AuthenticationServiceException) {
                            response.setStatus(500);
                         } else {
                            response.setStatus(401);
                         }
                      })
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

   /**
    * Allows the React frontend at {@code localhost:5173} to make
    * cross-origin requests with session cookies.
    *
    * @return the CORS configuration source that applies this policy to all backend paths
    */
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
   public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
   }
}
