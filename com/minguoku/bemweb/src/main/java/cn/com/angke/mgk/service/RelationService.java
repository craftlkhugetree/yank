package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface RelationService extends PlatformBaseService{

	public JSONObject getRelationList(PageOpt po);
	
}
