package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface RelationDao extends PlatformBaseDao {

	public JSONObject getRelationList(PageOpt po);
	
}
