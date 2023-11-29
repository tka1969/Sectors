package com.vikings.configurations.router;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.RequestPredicates.DELETE;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RequestPredicates.PUT;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;
import static org.springframework.web.reactive.function.server.RequestPredicates.contentType;
import static org.springframework.web.reactive.function.server.RequestPredicates.path;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.vikings.handler.UserSectorHandler;

@Configuration
public class UserSectorRouter {
	@Bean
  public RouterFunction<ServerResponse> userSectorRoutes(UserSectorHandler sectorHandler) {

  	return 
	  	RouterFunctions
				.nest(path("/api/v1/usersector"),
	  			route(GET("/get/{id}").and(accept(APPLICATION_JSON)), sectorHandler::get)
	  				.andRoute(PUT("/update").and(accept(APPLICATION_JSON)).and(contentType(APPLICATION_JSON)), sectorHandler::update)
	  				.andRoute(POST("/query").and(accept(APPLICATION_JSON)).and(contentType(APPLICATION_JSON)), sectorHandler::query)
	  				.andRoute(DELETE("/delete/{id}"), sectorHandler::delete)
					)
				;
	}
}
