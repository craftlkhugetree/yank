package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.db.PlatformBaseDao;

public interface BookCnmarcDao extends PlatformBaseDao{
	
	public void updateCnmarc(JSONObject book);
	
	public JSONObject getBookByCode(String code);
	
	public JSONArray getBookIdArr();
}
