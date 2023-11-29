package com.vikings.dao.repositories.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;


@lombok.Getter
@lombok.Setter
@lombok.ToString(callSuper=true)
@Entity
@Table(name = SectorEntity.TABLE_NAME, schema = SectorEntity.SCHEMA_NAME)
public class SectorEntity implements Persistable<Long> {
	public static final String TABLE_NAME = "SECTOR";
	public static final String SCHEMA_NAME = "sectors";
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", unique=true, nullable=false)
	private Long id;
	
	@Column(name = "user_id")
	private Long userId;
	
	@Column(name = "sector_id")
	private Long sectorId;
	
  @JsonIgnore
	@Override
	public boolean isNew() {
		return (id == null || id.longValue() == 0L);
	}
	
}
