package cn.com.angke.utils;

import com.alibaba.fastjson.JSONObject;
import com.somenew.ids.client.LoginUser;

public class UserUtil {
	public static JSONObject user() {
		return LoginUser.getUser();		
	}
	
	public static String id() {
		return user().getString("ID");
	}
	
	public static String name() {
		return user().getString("NAME");
	}
}
