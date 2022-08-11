package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface OtherNameDao extends PlatformBaseDao {
	
	public JSONObject saveRes(JSONArray arr);
	
	public JSONObject getList(PageOpt po);

}
