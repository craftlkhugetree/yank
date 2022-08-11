package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;


public interface CfgService extends PlatformBaseService {

	JSONObject viewByCode(String cODE);
	
}
