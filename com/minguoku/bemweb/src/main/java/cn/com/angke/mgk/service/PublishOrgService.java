package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface PublishOrgService extends PlatformBaseService {
	
	public JSONObject getList(PageOpt po);

	public void saveRes(JSONObject obj);
	
	public void deleteOrg(JSONArray ID);
	
}
