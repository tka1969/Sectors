package com.vikings.utils;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.databind.JsonNode;

import io.r2dbc.spi.Row;

@lombok.Data
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
@lombok.Builder
@lombok.Getter
@lombok.Setter
@lombok.ToString(callSuper=true)
public class DataFieldMapping {
	
	private String name;
	private String field;
	private Class<?> type;
	private Object defaultValue;
	
	@lombok.Builder.Default
	private int fieldFlags = 0;
	
	private DataFieldHandler fieldHandler;
	
	
	public boolean isValidType(String value) {
		
		if (type == boolean.class) {
			return (value != null && (value == "true" || value == "false"));
		}
		else if (type == LocalDateTime.class) {
			if (value != null)
			{
			try { LocalDateTime.parse(value); }
			catch (Exception e) { return false; }
				return true;
			}
		return false;
		}
		else if (type == Long.class) {
			if (value != null)
				{
				try { Long.parseLong(value); }
				catch (Exception e) { return false; }
					return true;
				}
			return false;
		}
		else if (type == float.class) {
			if (value != null)
				{
				try { Float.parseFloat(value); }
				catch (Exception e) { return false; }
					return true;
				}
			return false;
		}
		return true;
	}

	public Object convertToType(String value) {
	
		if (type == boolean.class) {
			return value == "true" ? true : false;
		}
		else if (type == LocalDateTime.class) {
			return LocalDateTime.parse(value);
		}
		else if (type == Long.class) {
			return Long.parseLong(value);
		}
		else if (type == float.class) {
			return Float.parseFloat(value);
		}
		
		return value;
	}

	
	public boolean isValidType(JsonNode jsonNode) {
		
		if (jsonNode == null) {
			return false;
		}
		
		if (type == boolean.class) {
			return (jsonNode.isBoolean());
		}
		else if (type == LocalDateTime.class) {
			
			if (jsonNode.isTextual())
			{
				try { 
					OffsetDateTime.parse(jsonNode.textValue()).toLocalDateTime();
				}
				catch (Exception e) {
					return false;
				}
				return true;
			}
			return false;
		}
		else if (type == Long.class) {
				try { 
					Long.parseLong(jsonNode.asText());
				}
				catch (Exception e) {
					return false;
				}
				return true;
		}
		else if (type == float.class) {
				try { 
					Float.parseFloat(jsonNode.asText());
				}
				catch (Exception e) {
					return false;
				}
				return true;
		}
		return true;
	}

	public Object convertToType(JsonNode jsonNode) {
	
		if (type == boolean.class) {
			return jsonNode.asBoolean();
		}
		else if (type == LocalDateTime.class) {
			return OffsetDateTime.parse(jsonNode.textValue()).toLocalDateTime();
		}
		else if (type == Long.class) {
			return Long.valueOf(jsonNode.asLong());
		}
		else if (type == float.class) {
			return Float.valueOf((float) jsonNode.asDouble());
		}
		return jsonNode.asText();
	}

	
	public interface DataFieldHandler {
		public String buildField(final Row row, final DataFieldMapping fieldMapping);
		public String buildInField(final JsonNode jsonNode, final DataFieldMapping fieldMapping);
		public String handleRelationField(final DataFieldMapping fieldMapping);
	}	
	
}

