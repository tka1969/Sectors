package com.vikings.dao.repositories.entity;

import java.util.List;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.springframework.data.annotation.Id;
//import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;


@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
@lombok.Builder
@lombok.Getter
@lombok.Setter
@lombok.ToString(callSuper=true)
@Entity
@Table(name = UserSectorEntity.TABLE_NAME, schema = UserSectorEntity.SCHEMA_NAME)
public class UserSectorEntity implements Persistable<Long> {
	public static final String TABLE_NAME = "USERSECTOR";
	public static final String SCHEMA_NAME = "sectors";
	
	@lombok.Builder.Default
	@JsonInclude(JsonInclude.Include.NON_NULL)
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", unique=true, nullable=false)
	private Long id = 0L;
	

	@lombok.Builder.Default
	@JsonInclude(JsonInclude.Include.NON_NULL)
	@Column(name = "username")
	private String username = null;
	
	@lombok.Builder.Default
	@JsonInclude(JsonInclude.Include.NON_NULL)
	@Column(name = "is_terms_agreed")
	private boolean isTermsAgreed = false;

	//@JsonInclude(JsonInclude.Include.NON_NULL)
	//@Transient
	//private List<SectorEntity> sectors;
	
	//public Long getId() {
		//return id;
	//}
	
	
	
  @JsonIgnore
	@Override
	public boolean isNew() {
		return (id == null || id.longValue() == 0L);
	}	
}
