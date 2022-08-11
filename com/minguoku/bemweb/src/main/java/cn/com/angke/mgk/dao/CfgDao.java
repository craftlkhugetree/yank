package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.db.PlatformBaseDao;


public interface CfgDao extends PlatformBaseDao {

	boolean checkCode(String string, String string2);

	JSONObject viewByCode(String CODE);
	
}
