package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;

public interface PostDao extends PlatformBaseDao{

	public JSONObject getPostListByOrgId(PageOpt po);
	public JSONObject getListBySourcepostId(PageOpt po);
}
