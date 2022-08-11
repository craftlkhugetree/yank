package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface OrgsService extends PlatformBaseService{
	
	/*public JSONObject getOrgListByFiled(PageOpt po);*/
	
	public JSONObject getListByParentId(PageOpt po);
	
	public JSONArray getList(PageOpt po);	
	
	public JSONObject save(JSONObject obj);

	public JSONObject save2() throws Exception ;
	
}
