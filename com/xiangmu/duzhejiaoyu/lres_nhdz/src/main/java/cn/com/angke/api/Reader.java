package cn.com.angke.api;

import java.util.HashMap;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.web.RequestHelper;

import cn.hutool.http.HttpUtil;

public class Reader{

	public static JSONArray usertype() {
		String url=RequestHelper.getAppRestUrl("tenant");
		url+="reader/usertype";
		String result = HttpUtil.post(url,new HashMap());
		JSONArray obj = null;
		if(null != result) {
			JSONObject objAll = JSONObject.parseObject(result);
			if(objAll.getString("code").equals("000000")) {
				obj = objAll.getJSONArray("data");
			}
		}
		return obj;
	}

	public static boolean active(String readerid) {
		String url=RequestHelper.getAppRestUrl("tenant");
		url+="reader/active";
		Map<String,Object> params = new HashMap<>();
		params.put("readerid", readerid);
		String result = HttpUtil.post(url, params);
		if(null != result) {
			JSONObject objAll = JSONObject.parseObject(result);
			if(objAll.getString("code").equals("000000")) {
				return true;
			}
		}
		return false;
	}

	public static JSONObject userinfo(String readerid) {
		String url=RequestHelper.getAppRestUrl("tenant");
		url+="reader/userInfo";
		Map<String,Object> params = new HashMap<>();
		params.put("readerid", readerid);
		String result = HttpUtil.post(url, params);
		JSONObject obj = null;
		if(null != result) {
			JSONObject objAll = JSONObject.parseObject(result);
			if(objAll.getString("code").equals("000000")) {
				obj = objAll.getJSONObject("data");
			}
		}
		return obj;
	}

	public static boolean disable(String readerid) {
		String url=RequestHelper.getAppRestUrl("tenant");
		url+="reader/disable";
		Map<String,Object> params = new HashMap<>();
		params.put("readerid", readerid);
		String result = HttpUtil.post(url, params);
		if(null != result) {
			JSONObject objAll = JSONObject.parseObject(result);
			if(objAll.getString("code").equals("000000")) {
				return true;
			}
		}
		return false;
	}

}
