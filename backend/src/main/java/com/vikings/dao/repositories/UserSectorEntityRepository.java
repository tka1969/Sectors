package com.vikings.dao.repositories;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import com.vikings.dao.repositories.entity.UserSectorEntity;

public interface UserSectorEntityRepository extends ReactiveCrudRepository<UserSectorEntity, Long> {

}
