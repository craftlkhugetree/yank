package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface OrgsDao extends PlatformBaseDao{

	public JSONObject getOrgListByFiled(PageOpt po);
	
	public JSONObject getListByParentId(PageOpt po);
	
	public JSONArray getList(PageOpt po);
	
	public JSONObject save(JSONObject obj);
	
}
