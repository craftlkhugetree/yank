package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;

public interface BookCnmarcService extends PlatformBaseService{

	JSONObject saveBookCnmarc(JSONObject bookCnmc);

	JSONObject delBookCnmarc(JSONArray idArr);
	
}
