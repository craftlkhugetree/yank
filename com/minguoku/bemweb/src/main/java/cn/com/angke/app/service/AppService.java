package cn.com.angke.app.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;


public interface AppService extends PlatformBaseService {

	JSONObject getFull(String dir,JSONArray arr) throws Exception;

	JSONObject getDir(String dir);
	
}
