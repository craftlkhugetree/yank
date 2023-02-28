package cn.com.angke.util;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.somenew.ids.client.LoginUser;

public class UserUtil {
	public static JSONObject user() {
		return LoginUser.getUser();		
	}
	
	public static String loginname() {
		String loginname = user().getString("LOGINNAME");
		if(StringUtils.isBlank(loginname)) {
			return user().getString("IDCARD");
		}
		return user().getString("LOGINNAME");
	}
	
	public static String name() {
		return user().getString("NAME");
	}
	
	public static String getUserId () {
		return LoginUser.getUserID();
	}

	public static String getTid() {
		return "ZH0001";
	}
}
