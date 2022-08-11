package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface OrgDtoService extends PlatformBaseService {
	
	public JSONObject getGrid(PageOpt po);
	
	public JSONObject getGridById(PageOpt po) ;
	
	public int getCount(PageOpt po);

}
