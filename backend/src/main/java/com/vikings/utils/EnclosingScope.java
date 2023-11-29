package com.vikings.utils;



@lombok.Data
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
@lombok.Builder
@lombok.Getter
@lombok.Setter
@lombok.ToString(callSuper=true)
public class EnclosingScope<T> {
	T member;
}
