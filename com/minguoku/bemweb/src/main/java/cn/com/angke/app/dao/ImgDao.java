package cn.com.angke.app.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.db.PlatformBaseDao;


public interface ImgDao extends PlatformBaseDao {
	
	JSONArray getPICINames();
	
	String getIdByName(String name);
	
	JSONObject getDir(String dir);
}
