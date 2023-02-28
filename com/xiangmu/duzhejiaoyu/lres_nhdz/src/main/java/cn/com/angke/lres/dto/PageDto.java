package cn.com.angke.lres.dto;

import java.util.Map;

import lombok.Data;

@Data
public class PageDto {
	private Long page;
	private Long limit;
	private String orderBy;
	private String sort;
	private Map<String,String> filter;
	
	public void setPage(Long page) {
		if(page == null) {
			this.page = 1l;
		}else {
			this.page = page;
		}
	}
	
	public void setLimit(Long limit) {
		if(limit == null) {
			this.limit = 10l;
		}else {
			this.limit = limit;
		}
	}
	
}
