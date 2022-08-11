package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;


public interface CustomerService extends PlatformBaseService {
	/**
	 * 删除客户信息
	 * @param obj
	 */
	public void delCTM(JSONArray IDs);
	
	public JSONObject saveIp(JSONObject obj);
	
	public JSONObject modifireConcat(JSONObject obj);
	
}
