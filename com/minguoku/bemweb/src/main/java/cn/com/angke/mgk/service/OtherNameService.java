package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface OtherNameService extends PlatformBaseService{
	
	public JSONObject getList(PageOpt po);
	
	public void deleteOtherName(JSONArray ID);

}
