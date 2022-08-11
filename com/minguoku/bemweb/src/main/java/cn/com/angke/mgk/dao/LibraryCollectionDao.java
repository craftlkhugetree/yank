package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao2;


public interface LibraryCollectionDao extends PlatformBaseDao2 {
	
	public JSONObject list2(PageOpt po);
	
}
