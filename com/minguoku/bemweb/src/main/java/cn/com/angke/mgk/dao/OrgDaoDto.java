package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface OrgDaoDto extends PlatformBaseDao{
	
	public JSONObject getGrid(PageOpt po);
	
	public JSONObject getGridById(PageOpt po);
	
	public int getCount(PageOpt po);

}
