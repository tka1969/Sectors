package com.vikings.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;


@Configuration
@EnableWebFlux
public class CorsGlobalConfiguration implements WebFluxConfigurer {
  
	@Override
  public void addCorsMappings(CorsRegistry corsRegistry) {
      corsRegistry.addMapping("/api/**")
        .allowedOrigins("*")
        .allowedMethods("*") //GET, PUT, POST, DELETE, OPTIONS")
        .allowedHeaders("*")
        .maxAge(3600);
  }
        
}
