package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface PostService extends PlatformBaseService{

	public JSONObject getPostListByOrgId(PageOpt po);
	
	public JSONObject getListBySourcepostId(PageOpt po);

	public JSONObject save2() throws Exception;
	
}
