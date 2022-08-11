package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface PeopleDaos extends PlatformBaseDao{
	
	public JSONObject getPeopleList(PageOpt po);
	

}
