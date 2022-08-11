package cn.com.angke.mgk.service;

import java.io.IOException;

import com.alibaba.fastjson.JSONArray;
import com.somenew.service.PlatformBaseService;


public interface GeographyService extends PlatformBaseService {
	
	/**
	 * 删除地理库
	 * @param IDs
	 * @throws IOException
	 */
	public void del(JSONArray IDs) ;
	
}
