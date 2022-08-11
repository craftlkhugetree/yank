package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface PublicService extends PlatformBaseService {
	
	public JSONObject getOrgList(PageOpt po);

	public JSONObject save(JSONObject obj);
	
}
