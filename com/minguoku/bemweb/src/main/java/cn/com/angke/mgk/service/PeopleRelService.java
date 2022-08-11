package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface PeopleRelService extends PlatformBaseService {

	public JSONObject getList(PageOpt po);
	
	public void deletePeopleRel(JSONArray ID);
	
	public JSONObject getlist(PageOpt po);
	
}
