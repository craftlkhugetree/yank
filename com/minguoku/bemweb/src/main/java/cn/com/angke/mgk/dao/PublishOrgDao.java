package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface PublishOrgDao extends PlatformBaseDao{

	public JSONObject getList(PageOpt po);
	
	public JSONObject save(JSONObject obj,String NAME);
	
}