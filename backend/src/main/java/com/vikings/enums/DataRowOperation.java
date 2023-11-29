package com.vikings.enums;

public enum DataRowOperation {
  UNCHANGED(0),
  INSERT(1),
  UPDATE(2),
  DELETE(3),
  ;

	private final int operationType;

	DataRowOperation(int operationType) {
		this.operationType = operationType;
	}

  @Override
  public String toString() {
      return Long.toString(operationType);
  }
  
  
  private static DataRowOperation[] cachedValues = null;
  
  public static DataRowOperation fromInt(int i) {
      if (DataRowOperation.cachedValues == null) {
      	DataRowOperation.cachedValues = DataRowOperation.values();
      }
      return DataRowOperation.cachedValues[i];
  }
  
}
