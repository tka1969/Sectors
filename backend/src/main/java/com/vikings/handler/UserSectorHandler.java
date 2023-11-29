package com.vikings.handler;

import static java.util.Map.entry;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.BodyInserters.fromPublisher;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.vikings.enums.FieldFlagEnum;
import com.vikings.utils.DataFieldMapping;
import com.vikings.utils.EnclosingScope;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Component
public class UserSectorHandler extends BaseHandler {
	private static final String DB_SCHEMA = "sectors";
	private static final String USERSECTOR_TABLE = "USERSECTOR";
	private static final String SECTOR_TABLE = "SECTOR";

	private static final Map<String, DataFieldMapping> tableMap = Map.ofEntries(
			entry("Id", DataFieldMapping.builder().name("Id").field("id").fieldFlags(FieldFlagEnum.IN_PRIMARY_KEY | FieldFlagEnum.OUT_RETURNS).type(Long.class).build()),
	    entry("Username", DataFieldMapping.builder().name("Username").field("username").type(String.class).build()),
	    entry("IsTermsAgreed", DataFieldMapping.builder().name("IsTermsAgreed").field("is_terms_agreed").type(boolean.class).build())
	    );
	
	@Autowired
	public UserSectorHandler(DatabaseClient databaseClient) {
		super(databaseClient, USERSECTOR_TABLE, tableMap, tableMap);
	}
	
	
	
	
	/*
	MySQL
	
	UPDATE sectors.USERSECTOR l, sectors.SECTOR b
  SET l.row_status = 'D',
      b.row_status = 'D'
WHERE b.user_id = l.id
AND l.id = 1;
	*/
	
	/*
	PostgreSQL
	
	WITH
	update1(tbl, id, user_id) AS (
	   UPDATE sectors.usersector set row_status = 'D' WHERE id=1
	   RETURNING 'usersector', id, 0
	),
	update2(tbl, id, user_id) AS (
	   UPDATE sectors.sector set row_status = 'D' WHERE user_id=1
	   RETURNING 'sector', id, user_id
	)
	SELECT tbl, id, user_id FROM update1
	UNION ALL
	SELECT tbl, id, user_id FROM update2
	;
	*/
	
	
	public Flux<String> delete(Long id) {
		
		StringBuffer deleteSql = new StringBuffer();
		
		deleteSql.append("WITH ");
		deleteSql.append("update1(tbl, id, user_id) AS ( ");
	  deleteSql.append("UPDATE sectors.usersector set row_status = 'D' WHERE id = :Id ");
	  deleteSql.append("RETURNING 'usersector', id, 0 ");
	  deleteSql.append("), ");
	  deleteSql.append("update2(tbl, id, user_id) AS ( ");
	  deleteSql.append("UPDATE sectors.sector set row_status = 'D' WHERE user_id = :Id ");
	  deleteSql.append("RETURNING 'sector', id, user_id ");
	  deleteSql.append(") ");
	  deleteSql.append("SELECT tbl, id, user_id FROM update1 ");
	  deleteSql.append("UNION ALL ");
	  deleteSql.append("SELECT tbl, id, user_id FROM update2 ");
		
		DatabaseClient.GenericExecuteSpec sqlexec = getDatabaseClient().sql(deleteSql.toString())
				.bind("Id", id);
		
		EnclosingScope<Integer> reportCount = new EnclosingScope<Integer>(0);
		
		Flux<String> result = sqlexec
				.map((row, rowMetadata) -> {
					StringBuffer responseJSON = new StringBuffer(1024*10);
		
					if (reportCount.getMember() > 0) {
						responseJSON.append(",");
					}
					
					responseJSON.append("{");

					responseJSON.append("\"table\":");
					responseJSON.append("\"" + row.get("tbl") + "\"");

					responseJSON.append(", \"Id\":");
					responseJSON.append(row.get("id"));

					responseJSON.append(", \"UserId\":");
					responseJSON.append(row.get("user_id"));
					
					responseJSON.append("}");
		
					reportCount.setMember(reportCount.getMember() + 1);
					
					return responseJSON.toString();
				})
				.all()
				;
		
		Flux<String> fl1 = Flux.just("[");
		Flux<String> fl2 = Flux.just("]");
		Flux<String> r1 = Flux.concat(fl1, result, fl2);
		
		return r1;		
	}
	
	
	public Mono<ServerResponse> delete(ServerRequest request) {
		final Long id = Long.parseLong(request.pathVariable("id"));
   
		return ok().contentType(APPLICATION_JSON)
        .body(fromPublisher(delete(id), String.class));
	} 

}

