package com.vikings.enums;

public enum FieldFlagEnum {
	IN_READONLY1(1 << 0),
	//IN_IGNORE1(2),
	//OUT_READONLY1(4),
	//OUT_IGNORE1(8),
  ;


	//public static final int IN_READONLY      = 1 << 0;  // 1  - 00000001
	public static final int IN_IGNORE        = 1 << 1;	// 2  - 00000010
	public static final int IN_QUERY         = 1 << 2;	// 2  - 00000010
	public static final int OUT_READONLY     = 1 << 3;  // 4  - 00000100
	public static final int OUT_IGNORE       = 1 << 4;  // 8  - 00001000
	public static final int OUT_INCLUDE_NULL = 1 << 5;  // 8  - 00001000

	public static final int ONLY_QUERY    = 1 << 6;  // 16 - 00010000
	public static final int OUT_RETURNS   = 1 << 7;  // 
	public static final int OUT_RELATION  = 1 << 8;  // 

	
	public static final int IN_PRIMARY_KEY = 1 << 9;	// 2  - 00000010

	
	private final long fieldFlag;

	FieldFlagEnum(long fieldFlag) {
		this.fieldFlag = fieldFlag;
	}

  @Override
  public String toString() {
      return Long.toString(fieldFlag);
  }

}


