package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONArray;
import com.somenew.db.PlatformBaseDao;


public interface ZtTypeDao extends PlatformBaseDao {

	JSONArray getZtSymbol();
	
}
