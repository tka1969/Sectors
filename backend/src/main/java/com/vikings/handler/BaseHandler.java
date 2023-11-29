package com.vikings.handler;

import static org.springframework.web.reactive.function.BodyInserters.fromPublisher;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.ServerResponse.notFound;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.DatabaseClient.GenericExecuteSpec;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.vikings.enums.DataRowOperation;
import com.vikings.enums.FieldFlagEnum;
import com.vikings.model.request.QueryRequest;
import com.vikings.utils.BitFlags;
import com.vikings.utils.DataFieldMapping;
import com.vikings.utils.EnclosingScope;

import io.r2dbc.spi.Row;
import io.r2dbc.spi.Statement;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class BaseHandler {
	private static final ObjectMapper JSON = new ObjectMapper();
	
	private final String tableName;

	private final Map<String, DataFieldMapping> fieldMapIn;
	private final Map<String, DataFieldMapping> fieldMapOut;
	private final DatabaseClient databaseClient;

  @Autowired
  public BaseHandler(
  		DatabaseClient databaseClient,
  		String TableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut  		
  		) {
  	
  		this.databaseClient = databaseClient;
  		this.tableName = TableName;
  		this.fieldMapIn = fieldMapIn;
  		this.fieldMapOut = fieldMapOut;
  }

  
  
  protected DatabaseClient getDatabaseClient() {
  	return databaseClient;
  }
  
  protected DatabaseClient.GenericExecuteSpec buildQuerySQL(
  		final QueryRequest query,
  		final String tableName,
  		final Map<String, DataFieldMapping> fieldMapIn,
			final Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap
  		) {

  	DatabaseClient.GenericExecuteSpec sqlexec;
  	
		StringBuffer selectSQL = new StringBuffer();
		
		selectSQL.append("select ");

		int fieldNo = 0;
		for (Map.Entry<String, DataFieldMapping> entry: fieldMapOut.entrySet()) {
			
			if (BitFlags.mask(entry.getValue().getFieldFlags(), FieldFlagEnum.OUT_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) {
				
				if (fieldNo > 0) {
					selectSQL.append(", ");
				}
				selectSQL.append(entry.getValue().getField());
				fieldNo++;
			}
		}		
		
		selectSQL.append(" from ");
		selectSQL.append(tableName);
		selectSQL.append(" where row_status != 'D' ");
		
		
  	if (query.getParameters() != null && query.getParameters().containsKey("QuerySchema")) {
  		
  		final String querySchema = query.getParameters().get("QuerySchema");
  		
  		final String classList[] = querySchema.split("\\s*,\\s*");

  		final List<Object[]> tuples = new ArrayList<>();
  		
  		for (String classi : classList) {
  			tuples.add(new Object[] {classi});
  		}
  	
  		selectSQL.append(" and ");
  		selectSQL.append(fieldMapIn.get("QuerySchema").getField());
  		selectSQL.append(" IN (:tuples) ");
    	selectSQL.append(" order by id");
  		
  		sqlexec = databaseClient.sql(selectSQL.toString())
  		    .bind("tuples", tuples);
  	}
  	else {
		
	  	if (!defaultsMap.isEmpty() || query.getParameters() != null) {
	
	  		EnclosingScope<Integer> fields = new EnclosingScope<Integer>(0);
	  		
		  	query.getParameters().forEach((key, value) -> {
		  				DataFieldMapping fieldMapping = fieldMapIn.get(key);
		  				if (fieldMapping != null && //fieldMapIn.containsKey(key) &&
		  						(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) ) {
		  					//if (fields.getMember() > 0) {
		  					selectSQL.append(" and ");
		  					//}
		  					selectSQL.append(fieldMapping.getField() + " = :" + key);
		  					fields.setMember(fields.getMember() + 1);
		  				}
		  			}
		 			);

				for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
						//if (fields.getMember() > 0) {
						selectSQL.append(" and ");
						//}
						selectSQL.append(entry.getKey());
						selectSQL.append(" = :");
						selectSQL.append(entry.getKey());
						
						fields.setMember(fields.getMember() + 1);
				}		
		  	selectSQL.append(" order by id");
	  	}
  	
	  	sqlexec = databaseClient.sql(selectSQL.toString());

	  	if (!defaultsMap.isEmpty() || query.getParameters() != null) {
		  	for (Map.Entry<String, String> entry: query.getParameters().entrySet()) {
		  		DataFieldMapping fieldMapping = fieldMapIn.get(entry.getKey());
		  		if ((fieldMapping != null) &&
		  				(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) &&
		  		   /*fieldMapIn.containsKey(entry.getKey()) &&*/ fieldMapIn.get(entry.getKey()).isValidType(entry.getValue())) {
		  			sqlexec = sqlexec.bind(entry.getKey(), fieldMapIn.get(entry.getKey()).convertToType(entry.getValue()));
		  		}
				}
		  	
				for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
					sqlexec = sqlexec.bind(entry.getKey(), entry.getValue());
				}		
	  	}
	  	else {
	  		sqlexec = databaseClient.sql(selectSQL.toString());
	  	}
  	}
  	return sqlexec;
  }
  
  
  private JsonNode parseJSON(String bodyJson) {
  	
    try {
    	return JSON.readTree(bodyJson);
    } catch (IOException e) {
      return null;
    }
  }  
  
	protected DatabaseClient.GenericExecuteSpec buildSaveSQL(
			String bodyJson,
			String tableName,
			Map<String, DataFieldMapping> fieldMap,
			final Map<String, Object> defaultsMap) {
	
		final JsonNode jsonNode = parseJSON(bodyJson);
		
		if (jsonNode == null) {
			return null;
		}

		if (jsonNode.isArray()) {
			return null;
		}

    final List<String> keys = new ArrayList<>();
    final Iterator<String> iterator = jsonNode.fieldNames();
    iterator.forEachRemaining(name -> keys.add(name));

    if (keys.isEmpty()) {
    	return null;
    }
    
    EnclosingScope<Integer> saveCount = new EnclosingScope<Integer>(0);
		StringBuffer saveSql = new StringBuffer(1024*10);
		
			boolean isNew = (jsonNode.get("Id") == null || jsonNode.get("Id").asLong() == 0);
			
			if (isNew) {
				saveSql.append("insert into ");
				saveSql.append(tableName);
				saveSql.append(" (");	
				
		    keys.forEach((name) -> {
		    	if (fieldMap.containsKey(name)) {
		    		DataFieldMapping fieldMapping = fieldMap.get(name);
		    		
		    		if (fieldMapping.isValidType(jsonNode.get(name)) &&
		    				(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0)) {
		    		
							if (saveCount.getMember() > 0) {
								saveSql.append(", ");
							}
							saveSql.append(fieldMap.get(name).getField());
							saveCount.setMember(saveCount.getMember() + 1);
						}
		    	}
		    });
		    
				for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
					if (saveCount.getMember() > 0) {
						saveSql.append(", ");
					}
					saveSql.append(entry.getKey());
					saveCount.setMember(saveCount.getMember() + 1);
				}
			}
			else
			{
				saveSql.append("update ");
				saveSql.append(tableName);
				
		    keys.forEach((name) -> {
		    	DataFieldMapping fieldMapping = fieldMap.get(name);
		    	
		    	if (fieldMapping != null &&
		    			(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) &&
		    			fieldMapping.isValidType(jsonNode.get(name))) {
	
						if (saveCount.getMember() > 0) {
							saveSql.append(", ");
						}
						else {
							saveSql.append(" set ");	
		    		}
						saveSql.append(fieldMap.get(name).getField() + " = :" + name);
						saveCount.setMember(saveCount.getMember() + 1);
					}
		    });
		    
				for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
					if (saveCount.getMember() > 0) {
						saveSql.append(", ");
					}
					else {
						saveSql.append(" set ");	
	    		}
					saveSql.append(entry.getKey() + " = :" + entry.getKey());
				}
			}

    if (saveCount.getMember() == 0) {
    	return null;
    }

    
		if (isNew) {
			saveSql.append(", ");
			saveSql.append("modified_by");
			saveSql.append(", ");
			saveSql.append("created_by");
			saveSql.append(")");
			saveSql.append(" values ");
			saveSql.append("(");

			saveCount.setMember(0);
					
	    keys.forEach((name) -> {
	    	if (fieldMap.containsKey(name)) {
	    		DataFieldMapping fieldMapping = fieldMap.get(name);
	    		
	    		if (fieldMapping.isValidType(jsonNode.get(name)) &&
	    				(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0)) {

						if (saveCount.getMember() > 0) {
							saveSql.append(", ");
						}
						saveSql.append(":" + name);
						saveCount.setMember(saveCount.getMember() + 1);
					}
	    	}
	    });
	    
			for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
				if (saveCount.getMember() > 0) {
					saveSql.append(", ");
				}
				saveSql.append(":" + entry.getKey());
			}

			saveSql.append(", ");
			saveSql.append(":modified_by");
			saveSql.append(", ");
			saveSql.append(":created_by");
	    
			saveSql.append(")");
	    saveSql.append(" returning *");
		}
		else {
			saveSql.append(", ");
			saveSql.append("modified_by = :modified_by");
			saveSql.append(" where id = :Id returning *");
		}
    
    EnclosingScope<DatabaseClient.GenericExecuteSpec> sqlexec = new EnclosingScope<GenericExecuteSpec>(databaseClient.sql(saveSql.toString()));

    keys.forEach((name) -> {
    	DataFieldMapping fieldMapping = fieldMap.get(name);
    	
  		if (fieldMapping != null &&
  				(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) &&
  				fieldMapping.isValidType(jsonNode.get(name))) {
  			sqlexec.setMember(sqlexec.getMember().bind(name, fieldMap.get(name).convertToType(jsonNode.get(name))));
  		}
    });
    
		for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
			sqlexec.setMember(sqlexec.getMember().bind(entry.getKey(), entry.getValue()));
		}
    
    sqlexec.setMember(sqlexec.getMember().bind("modified_by", "LOGGED-IN-USER"));

		if (isNew) {
			sqlexec.setMember(sqlexec.getMember().bind("created_by", "LOGGED-IN-USER"));
		}
		else {
			sqlexec.setMember(sqlexec.getMember().bind("Id", jsonNode.get("Id").asLong()));
		}
    
    return sqlexec.getMember();
	}
			
	
	protected String buildResultItemJSON(
			final Row row,
			final Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap,
			final EnclosingScope<Integer> reportCount,
			int flags)
	{
		StringBuffer responseJSON = new StringBuffer(1024*10);
		
		if (reportCount.getMember() > 0) {
			responseJSON.append(",");
		}

		responseJSON.append("{");

		int recordNo = 0;
		for (Map.Entry<String, DataFieldMapping> entry: fieldMapOut.entrySet()) {
			
			if (flags == 0 || BitFlags.isFlagSet(entry.getValue().getFieldFlags(), flags)) {
				
			if (BitFlags.mask(entry.getValue().getFieldFlags(), FieldFlagEnum.OUT_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) {
			
				if (BitFlags.isFlagSet(entry.getValue().getFieldFlags(), FieldFlagEnum.OUT_RELATION)) {
					entry.getValue().getFieldHandler().handleRelationField(entry.getValue());
				}
				
				Object value = row.get(entry.getValue().getField());
				
				if (entry.getValue().getType() == java.time.LocalDateTime.class) {

					if (value != null) {
					
						if (recordNo > 0) {
							responseJSON.append(",");
						}
						responseJSON.append("\"");
						responseJSON.append(entry.getValue().getName());
						responseJSON.append("\":\"");
						responseJSON.append(row.get(entry.getValue().getField(), java.time.LocalDateTime.class));
						responseJSON.append("\"");
						recordNo++;
					}
				}
				else {

					if (value != null || BitFlags.isFlagSet(entry.getValue().getFieldFlags(), FieldFlagEnum.OUT_INCLUDE_NULL)) {
						if (recordNo > 0) {
							responseJSON.append(",");
						}
						responseJSON.append("\"");
						responseJSON.append(entry.getValue().getName());
						responseJSON.append("\":");
						
						if (entry.getValue().getType() == String.class) {
							responseJSON.append("\"");
						}
						
						responseJSON.append(row.get(entry.getValue().getField()));

						if (entry.getValue().getType() == String.class) {
							responseJSON.append("\"");
						}
						recordNo++;
					}
				}
			}
			}
		}
		responseJSON.append("}");

		if (recordNo > 0) {
			reportCount.setMember(reportCount.getMember() + 1);
		}
		
		return recordNo == 0 ? "" : responseJSON.toString();  
	}

	
	protected Flux<String> bulkInsertResultJSON(
			JsonNode recordNode,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {
		
		final List<String> keys = new ArrayList<>();
		final List<String> retvalues = new ArrayList<>();
		boolean hasInsert = false;
		
    final EnclosingScope<Integer> insertCount = new EnclosingScope<Integer>(0);
    final EnclosingScope<Integer> columnCount = new EnclosingScope<Integer>(0);
    final StringBuffer sqlInsert = new StringBuffer(1024*10);
  	
		sqlInsert.append("insert into ");
		sqlInsert.append(tableName);
		sqlInsert.append(" (");	
		
    for (final JsonNode rowNode : recordNode) {
    	
    	hasInsert = ((rowNode.get("Id") == null || rowNode.get("Id").asLong() == 0) || (rowNode.get("RowState") != null && DataRowOperation.fromInt(rowNode.get("RowState").asInt()) == DataRowOperation.INSERT));
    	
			if (hasInsert) {
		    Iterator<String> iterator = rowNode.fieldNames();
		    iterator.forEachRemaining(name -> {

		    	if (fieldMapIn.containsKey(name)) {
		    		DataFieldMapping fieldMapping = fieldMapIn.get(name);
		    		
		    		if (fieldMapping.isValidType(rowNode.get(name)) &&
		    				(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_PRIMARY_KEY | FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0)) {
		    	
		    			keys.add(name);
		    		}
		    	}
		    });
		    
		    fieldMapIn.forEach((key, item) -> {
	    		if (BitFlags.isFlagSet(item.getFieldFlags(), FieldFlagEnum.OUT_RETURNS)) {	
	    			retvalues.add(item.getField());
	    		}
		    });
				break;
			}
    }
		
		if (!hasInsert) {
    	return Flux.just("");
		}
    
    if (keys.isEmpty()) {
    	return Flux.just("");
    }

    keys.forEach((name) -> {
    	if (fieldMapIn.containsKey(name)) {
    		DataFieldMapping fieldMapping = fieldMapIn.get(name);
    		
    		if ((BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_PRIMARY_KEY | FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0)) {
    		
					if (insertCount.getMember() > 0) {
						sqlInsert.append(", ");
					}
					sqlInsert.append(fieldMapIn.get(name).getField());
					insertCount.setMember(insertCount.getMember() + 1);
					columnCount.setMember(columnCount.getMember() + 1);
				}
    	}
    });
		    
		for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
			if (insertCount.getMember() > 0) {
				sqlInsert.append(", ");
			}
			sqlInsert.append(entry.getKey());
			insertCount.setMember(insertCount.getMember() + 1);
			columnCount.setMember(columnCount.getMember() + 1);
		}
    
	  if (insertCount.getMember() == 0) {
	  	return Flux.just("");
	  }
	  
	  sqlInsert.append(", ");
	  sqlInsert.append("modified_by");
	  sqlInsert.append(", ");
		sqlInsert.append("created_by");
		sqlInsert.append(")");
		
		columnCount.setMember(columnCount.getMember() + 2);

		sqlInsert.append(" values ");
		sqlInsert.append("(");
    
    for (int column = 0; column < columnCount.getMember(); column++) {
			if (column > 0) {
				sqlInsert.append(", ");
			}
    	sqlInsert.append("$");
    	sqlInsert.append(column + 1);
    }
		sqlInsert.append(")");
    
		return databaseClient.inConnectionMany(connection -> {

			final EnclosingScope<Statement> statement = new EnclosingScope<Statement>(connection.createStatement(sqlInsert.toString()));
			
			if (retvalues.size() > 0) {
				statement.setMember(statement.getMember().returnGeneratedValues(retvalues.toArray(new String[0])));
			}
			
			for (int row = 0; row < recordNode.size(); row++) {

				if (row > 0) {
					statement.getMember().add();
				}
					
				final JsonNode rowNode = recordNode.get(row);
				final EnclosingScope<Integer> columnNo = new EnclosingScope<Integer>(0);
				
		    keys.forEach((name) -> {
		    	DataFieldMapping fieldMapping = fieldMapIn.get(name);
		    	
		  		if (fieldMapping != null &&
		  				(BitFlags.mask(fieldMapping.getFieldFlags(), FieldFlagEnum.IN_PRIMARY_KEY | FieldFlagEnum.IN_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) &&
		  				fieldMapping.isValidType(rowNode.get(name))) {

		  			statement.getMember().bind(columnNo.getMember(), fieldMapIn.get(name).convertToType(rowNode.get(name)));
		  		}
		  		columnNo.setMember(columnNo.getMember() + 1);
		    });
		    
				for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
					statement.getMember().bind(columnNo.getMember(), entry.getValue());
					columnNo.setMember(columnNo.getMember() + 1);
				}
		    
				statement.getMember().bind(columnNo.getMember(), "LOGGED-IN-USER");
		    columnNo.setMember(columnNo.getMember() + 1);
		    statement.getMember().bind(columnNo.getMember(), "LOGGED-IN-USER");
		    columnNo.setMember(columnNo.getMember() + 1);
			}
			
			final EnclosingScope<Integer> reportCount = new EnclosingScope<Integer>(0);
			
      return Flux.from(statement.getMember().execute())
      		.flatMap(result -> result.map((row, rowMetadata) -> { 
      			
      			return buildResultItemJSON(
      					row,
      					fieldMapOut,
      					defaultsMap,
      					reportCount,
      					FieldFlagEnum.OUT_RETURNS);   			
      		}));
      
		});
	}

	
	protected Flux<String> bulkUpdateResultJSON(
			JsonNode recordNode,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {

/*
 bulk update		
 https://medium.com/@akhouri/bulk-insert-and-update-in-postgresql-e7e3bc863a14
 
		UPDATE REGISTRATION AS t
		SET name = c.column_name, modified = c.column_date_modified FROM (VALUES
		(1, ‘test one’, ‘12–12–2019’),
		(2, ‘test two’, ‘12–12–2019’),
		(3, ‘test three’,‘12–12–2019’),
		(4, ‘test four’, ‘12–12–2019’)
		) AS c(column_id, column_name, column_date_modified)
		WHERE c.column_id = t.id”
*/		
		
		return Flux.just("");
	}
	
	
	protected Flux<String> bulkDeleteResultJSON(
			JsonNode recordNode,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {
		
    final StringBuffer sqlDelete = new StringBuffer(1024*10);
  	
		//sqlInsert.append("delete from ");
		//sqlInsert.append(tableName);
		//sqlInsert.append(" where id in (");	
		final List<Object[]> tuples = new ArrayList<>();
    
		
    for (final JsonNode rowNode : recordNode) {
    	
    	boolean hasDelete = ((rowNode.get("Id") != null && rowNode.get("Id").asLong() != 0) && (rowNode.get("RowState") != null && DataRowOperation.fromInt(rowNode.get("RowState").asInt()) == DataRowOperation.DELETE));
    	
			if (hasDelete) {
  			tuples.add(new Object[] {rowNode.get("Id").asLong()});
			}
    }

		if (tuples.isEmpty()) {
    	return Flux.just("");
		}
    
		sqlDelete.append("with deleted as (DELETE FROM ");
		sqlDelete.append(tableName);
		sqlDelete.append(" where ");
		sqlDelete.append(" id IN (:tuples) ");
		sqlDelete.append(" returning id) select id from deleted;");
		
		//selectSQL.append(" where ");
		//selectSQL.append(" and ");
		//selectSQL.append(fieldMapIn.get("QuerySchema").getField());
		//selectSQL.append(" IN (:tuples) ");
  	//selectSQL.append(" order by id");
    //sqlInsert.append(" where id in (");
		//sqlexec = databaseClient.sql(sqlDelete.toString())
		//.bind("tuples", tuples);
		
		return databaseClient.inConnectionMany(connection -> {
			
			final EnclosingScope<Statement> statement = new EnclosingScope<Statement>(connection.createStatement(sqlDelete.toString()));
			
			statement.setMember(statement.getMember().bind("tuples", tuples));
			
			//if (retvalues.size() > 0) {
			//statement.setMember(statement.getMember().returnGeneratedValues(retvalues.toArray(new String[0])));
			//}
			
			final EnclosingScope<Integer> reportCount = new EnclosingScope<Integer>(0);
			
      return Flux.from(statement.getMember().execute())
      		.flatMap(result -> result.map((row, rowMetadata) -> { 
      			
      			return buildResultItemJSON(
      					row,
      					fieldMapOut,
      					defaultsMap,
      					reportCount,
      					FieldFlagEnum.OUT_RETURNS);   			
      		}));
		});
		
	}

	
	
	public Flux<String> bulkOperationResultJSON(
			String bodyJson,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {

		final JsonNode parseNode = parseJSON(bodyJson);
		
		if (parseNode == null) {
			return Flux.just("");
		}

		ArrayNode arrayNode;
	
		if (!parseNode.isArray()) {

			arrayNode = JSON.createArrayNode();
			
			arrayNode.add(parseNode);
		}
		else {
			arrayNode = (ArrayNode) parseNode;
		}
		
		Flux<String> insert = bulkInsertResultJSON(arrayNode, tableName, fieldMapIn, fieldMapOut, defaultsMap);
		Flux<String> update = bulkUpdateResultJSON(arrayNode.get(0), tableName, fieldMapIn, fieldMapOut, defaultsMap);
		Flux<String> delete = bulkDeleteResultJSON(arrayNode.get(0), tableName, fieldMapIn, fieldMapOut, defaultsMap);

		return Flux.concat(
				Flux.just("["), insert, Flux.just("]"),
				update,
				delete);
	}

	
	public Mono<ServerResponse> bulkOperation(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {

		return ServerResponse
				.ok()
				.contentType(APPLICATION_JSON)
				.body(
						request
							.body(BodyExtractors.toFlux(String.class))
							.flatMap(bodyText -> { return bulkOperationResultJSON(bodyText, tableName, fieldMapIn, fieldMapOut, defaultsMap); }), String.class)
				;
	}
	
	public Mono<ServerResponse> bulkOperation(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut) {
		return bulkOperation(
				request,
				tableName,
				fieldMapIn,
				fieldMapOut,
				new HashMap<String, Object>());
	}	

	public Mono<ServerResponse> bulkOperation(ServerRequest request, final Map<String, Object> defaultsMap) {
		return bulkOperation(request, tableName, fieldMapIn, fieldMapOut, defaultsMap);
	}

	public Mono<ServerResponse> bulkOperation(ServerRequest request) {
		return bulkOperation(request, tableName, fieldMapIn, fieldMapOut, new HashMap<String, Object>());
	}


	
	
	public Flux<String> queryResponseJSON(
			final QueryRequest query,
			final String tableName,
			final Map<String, DataFieldMapping> fieldMapIn,
			final Map<String, DataFieldMapping> fieldMapOut) {
		return queryResponseJSON(
				query,
				tableName,
				fieldMapIn,
				fieldMapOut,
				new HashMap<String, Object>());
	}	
	
	public Flux<String> queryResponseJSON(
			final QueryRequest query,
			final String tableName,
			final Map<String, DataFieldMapping> fieldMapIn,
			final Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {
		
		DatabaseClient.GenericExecuteSpec sqlexec = buildQuerySQL(query, tableName,
				fieldMapIn, fieldMapOut,
				defaultsMap);
    
		EnclosingScope<Integer> reportCount = new EnclosingScope<Integer>(0);

		Flux<String> result =
				sqlexec
					.map((row, rowMetadata) -> {
						
      			return buildResultItemJSON(
      					row,
      					fieldMapOut,
      					defaultsMap,
      					reportCount,
      					0);
					})
			  .all();
		
		Flux<String> fl1 = Flux.just("[");
		Flux<String> fl2 = Flux.just("]");
		Flux<String> r1 = Flux.concat(fl1, result, fl2);
		
		return r1;
	}
	
	public Mono<ServerResponse> query(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {

		return ServerResponse
				.ok()
				.contentType(APPLICATION_JSON)
				.body(
						request
							.body(BodyExtractors.toFlux(QueryRequest.class))
								.flatMap(query -> queryResponseJSON(query, tableName, fieldMapIn, fieldMapOut)), String.class)
				;
	}

	public Mono<ServerResponse> query(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut) {
		return query(
				request,
				tableName,
				fieldMapIn,
				fieldMapOut,
				new HashMap<String, Object>());
	}
	
	public Mono<ServerResponse> query(ServerRequest request, final Map<String, Object> defaultsMap) {
		return query(request, tableName, fieldMapIn, fieldMapOut, defaultsMap);
	}

	public Mono<ServerResponse> query(ServerRequest request) {
		return query(request, tableName, fieldMapIn, fieldMapOut, new HashMap<String, Object>());
	}

	
	
	private Mono<String> execGetResponseJSON(
			DatabaseClient.GenericExecuteSpec sqlexec,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap,
			final boolean isArray) {
		
		EnclosingScope<Integer> reportCount = new EnclosingScope<Integer>(0);

		Mono<String> result =
				sqlexec
					.map((row, rowMetadata) -> {
      			return buildResultItemJSON(
      					row,
      					fieldMapOut,
      					defaultsMap,
      					reportCount,
      					0);
					})
			  .one()
			  .onErrorResume(e -> { return Mono.just("Error " + e.getMessage()); })
			  ;
		
		if (isArray) {
			Mono<String> fl1 = Mono.just("[");
			Mono<String> fl2 = Mono.just("]");
			
			return Mono.zip(fl1, result, fl2).map(tup -> tup.getT1() + tup.getT2() + tup.getT3());
		}
		else {
			return result;
		}
	}
		
	public Mono<String> getResponseJSON(
			Long id,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut) {
		return getResponseJSON(
				id,
				tableName,
				fieldMapIn,
				fieldMapOut,
				new HashMap<String, Object>());
	}	
	
	public Mono<String> getResponseJSON(
			Long id,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {
		
		StringBuffer selectSQL = new StringBuffer();
		
		selectSQL.append("select ");

		int fieldNo = 0;
		for (Map.Entry<String, DataFieldMapping> entry: fieldMapOut.entrySet()) {
			if (BitFlags.mask(entry.getValue().getFieldFlags(), FieldFlagEnum.OUT_IGNORE | FieldFlagEnum.ONLY_QUERY) == 0) {
				if (fieldNo > 0) {
					selectSQL.append(", ");
				}
				selectSQL.append(entry.getValue().getField());
				fieldNo++;
			}
		}		
		
		for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
			
			if (fieldNo > 0) {
				selectSQL.append(", ");
			}
			selectSQL.append(entry.getKey());
			fieldNo++;
		}

		selectSQL.append(" from ");
		selectSQL.append(tableName);
		selectSQL.append(" where row_status != 'D' ");
		selectSQL.append(" and id = :Id");
		
		EnclosingScope<DatabaseClient.GenericExecuteSpec> sqlexec = new EnclosingScope<GenericExecuteSpec>(databaseClient.sql(selectSQL.toString()));		
		
		sqlexec.setMember(sqlexec.getMember().bind("Id", id));
		
		for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
			sqlexec.setMember(sqlexec.getMember().bind(entry.getKey(), entry.getValue()));
		}
		
		return execGetResponseJSON(sqlexec.getMember(), fieldMapOut, defaultsMap, false);
	}
	
	
	public Mono<ServerResponse> get(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap
			) {
    final Long id = Long.parseLong(request.pathVariable("id"));
    final Mono<String> result = getResponseJSON(id, tableName, fieldMapIn, fieldMapOut);
    
    return result
        .flatMap(p -> ok().contentType(APPLICATION_JSON).body(fromPublisher(result, String.class)))
        .switchIfEmpty(notFound().build());
	}

	public Mono<ServerResponse> get(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut) {
		return get(
				request,
				tableName,
				fieldMapIn,
				fieldMapOut,
				new HashMap<String, Object>());
	}
	
	public Mono<ServerResponse> get(ServerRequest request, final Map<String, Object> defaultsMap) {
		return get(request, tableName, fieldMapIn, fieldMapOut, defaultsMap);
	}

	public Mono<ServerResponse> get(ServerRequest request) {
		return get(request, tableName, fieldMapIn, fieldMapOut, new HashMap<String, Object>());
	}


	
	public Mono<String> saveResultJSON(
			String bodyJson,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut) {
		return saveResultJSON(
				bodyJson,
				tableName,
				fieldMapIn,
				fieldMapOut,
				new HashMap<String, Object>());
	}
	
	public Mono<String> saveResultJSON(
			String bodyJson,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {

		DatabaseClient.GenericExecuteSpec sqlexec = buildSaveSQL(bodyJson, tableName, fieldMapIn, defaultsMap);

		if (sqlexec == null) {
			return Mono.empty();
		}

		return execGetResponseJSON(sqlexec, fieldMapOut, defaultsMap, false);
	}
	
	public Mono<ServerResponse> update(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut,
			final Map<String, Object> defaultsMap) {

		return ServerResponse
				.ok()
				.contentType(APPLICATION_JSON)
				.body(
						request
							.body(BodyExtractors.toMono(String.class))
							.flatMap((bodyText) -> { 
										return saveResultJSON(bodyText, tableName, fieldMapIn, fieldMapOut, defaultsMap);
										}),
							String.class
						)
				;
	}
	
	public Mono<ServerResponse> update(
			ServerRequest request,
			String tableName,
			Map<String, DataFieldMapping> fieldMapIn,
			Map<String, DataFieldMapping> fieldMapOut) {
		return update(
				request,
				tableName,
				fieldMapIn,
				fieldMapOut,
				new HashMap<String, Object>());
	}	

	public Mono<ServerResponse> update(ServerRequest request, final Map<String, Object> defaultsMap) {
		return update(request, tableName, fieldMapIn, fieldMapOut, defaultsMap);
	}

	public Mono<ServerResponse> update(ServerRequest request) {
		return update(request, tableName, fieldMapIn, fieldMapOut, new HashMap<String, Object>());
	}


	
	
	public Mono<String> deleteResultJSON(Long id, String tableName) {
		return deleteResultJSON(id, tableName, new HashMap<String, Object>());
	}
	
	public Mono<String> deleteResultJSON(Long id, String tableName, final Map<String, Object> defaultsMap) {
		
		StringBuffer deleteSQL = new StringBuffer();
		
		deleteSQL.append("with updated as (UPDATE ");
		deleteSQL.append(tableName);
		deleteSQL.append(" set row_status = 'D' WHERE ");

		deleteSQL.append("id = :Id");

		for (Map.Entry<String, Object> entry: defaultsMap.entrySet()) {
			deleteSQL.append(", ");
			deleteSQL.append(entry.getKey());
			deleteSQL.append(" = :");
			deleteSQL.append(entry.getKey());
		}		
		
		deleteSQL.append(" returning id) select count(*) as deleted_count from updated;");
		
		DatabaseClient.GenericExecuteSpec sqlexec = databaseClient.sql(deleteSQL.toString())
				.bind("Id", id);
		
		return sqlexec
				.fetch().one()
				.map(row -> {
					StringBuffer responseJSON = new StringBuffer(1024*10);
		
					responseJSON.append("[{");
					responseJSON.append("\"deleted_count\":");
					responseJSON.append(row.get("deleted_count"));
					responseJSON.append("}]");
		
					return responseJSON.toString();
				})
				;
	}

	public Mono<ServerResponse> delete(ServerRequest request, String tableName, final Map<String, Object> defaultsMap) {
		final Long id = Long.parseLong(request.pathVariable("id"));
    final Mono<String> result = deleteResultJSON(id, tableName, defaultsMap);
    
    return result
        .flatMap(p -> ok().contentType(APPLICATION_JSON).body(fromPublisher(result, String.class)))
        ;
	} 

	public Mono<ServerResponse> delete(ServerRequest request, String tableName) {
		return delete(request, tableName, new HashMap<String, Object>());
	} 
	
	public Mono<ServerResponse> delete(ServerRequest request, final Map<String, Object> defaultsMap) {
		return delete(request, tableName, defaultsMap);
	}

	public Mono<ServerResponse> delete(ServerRequest request) {
		return delete(request, tableName, new HashMap<String, Object>());
	}

}

