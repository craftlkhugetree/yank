package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;

public interface PostPeopleService extends PlatformBaseService{

	public JSONObject getPeopleListByPostid(PageOpt po);

	public JSONObject save2() throws Exception;
	
	public JSONObject save3() throws Exception;
	
}
