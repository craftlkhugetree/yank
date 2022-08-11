package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;


public interface ResourcePackageService extends PlatformBaseService {
	
	/**
	 * 保存资源库信息
	 * @param obj
	 */
	public void saveResource(JSONObject obj);
	
	/**
	 * 删除资源库信息
	 * @param IDs
	 */
	public void delResource(JSONArray IDs);
	
	/**
	 * 中图库树
	 * @param RESOURCEPACKAGEID
	 * @return
	 */
	public JSONArray ZTtree(String RESOURCEPACKAGEID) ;
	
}
