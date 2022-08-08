package cn.com.angke.book.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.db.PlatformBaseDao;


public interface GovernmentDao extends PlatformBaseDao {

	JSONArray simpleList();
	
	JSONObject viewById(String id);
}
