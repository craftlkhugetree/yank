package cn.com.angke.common.page;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import cn.hutool.core.util.StrUtil;
import lombok.Data;

@Data
public class PageDto {
	private Long page;
	private Long limit;
	private String orderBy;
	private String sort;
	private Map<String,Object> filter;
	
	public Long getPage() {
		if(this.page == null) {
			return 1l;
		}
		return this.page;
	}
	
	public Long getLimit() {
		if(this.limit == null) {
			return 10l;
		}
		return this.limit;
	}
	
	public Map<String,Object> getFilter() {
		if(this.filter == null) {
			return new HashMap<>();
		}
		return this.filter;
	}
	
	public String getOrderBy() {
		if(StringUtils.isBlank(this.orderBy)) {
			return this.orderBy;
		}
		return StrUtil.toUnderlineCase(this.orderBy);
	}
	
}
