package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;

public interface FileDao {
	public JSONObject getFile(PageOpt po);

	public void delFile(JSONArray ID);

	public JSONObject saveFile(JSONObject file);
	
	public JSONObject updateFile(JSONObject file);
}
