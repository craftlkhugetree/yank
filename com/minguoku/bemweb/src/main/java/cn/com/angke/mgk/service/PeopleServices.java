package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface PeopleServices extends PlatformBaseService{
	
	public JSONObject getPeopleList(PageOpt po);
	
	public void deleteRes(JSONArray ID);
	
	public void saveRes(JSONObject obj,JSONArray arr,JSONArray array);
	
	public void saveRes() throws Exception;
	
}
