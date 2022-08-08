package cn.com.angke.book.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;


public interface GovernmentService extends PlatformBaseService {

	JSONObject tree();

	JSONObject view(String iD);
	
}
