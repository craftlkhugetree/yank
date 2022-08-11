package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface PublicDao extends PlatformBaseDao{

	public JSONObject getOrgList(PageOpt po);
	
	public JSONObject save(JSONObject obj);
	
}
