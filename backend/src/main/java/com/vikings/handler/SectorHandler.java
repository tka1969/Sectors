package com.vikings.handler;

import static java.util.Map.entry;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;

import com.vikings.enums.FieldFlagEnum;
import com.vikings.utils.DataFieldMapping;


@Component
public class SectorHandler extends BaseHandler {
	private static final String DB_SCHEMA = "sectors";
	private static final String SECTOR_TABLE = "SECTOR";

	private static final Map<String, DataFieldMapping> tableMap = Map.ofEntries(
			entry("Id", DataFieldMapping.builder().name("Id").field("id").fieldFlags(FieldFlagEnum.IN_PRIMARY_KEY | FieldFlagEnum.OUT_RETURNS).type(Long.class).build()),
			entry("UserId", DataFieldMapping.builder().name("UserId").field("user_id").type(Long.class).build()),
			entry("SectorId", DataFieldMapping.builder().name("SectorId").field("sector_id").fieldFlags(FieldFlagEnum.OUT_RETURNS).type(Long.class).build())
	    );
	
	
	@Autowired
	public SectorHandler(DatabaseClient databaseClient) {
		super(databaseClient, SECTOR_TABLE, tableMap, tableMap);
	}
}
