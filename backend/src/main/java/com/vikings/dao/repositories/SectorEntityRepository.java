package com.vikings.dao.repositories;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.vikings.dao.repositories.entity.SectorEntity;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface SectorEntityRepository extends ReactiveCrudRepository<SectorEntity, Long> {

  Flux<SectorEntity> findByUserId(Long userId);
	
	Mono<Void> deleteByUserId(Long userId);
	
}

