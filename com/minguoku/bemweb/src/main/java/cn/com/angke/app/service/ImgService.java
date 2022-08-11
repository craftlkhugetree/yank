package cn.com.angke.app.service;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseService;


public interface ImgService extends PlatformBaseService {

	JSONObject getDir();

	JSONObject rootDir();

	JSONObject updatePICI(String pici);

	void addNewByName(String name);
	
	void delByName(String name);
	
	void updateByName(String name,JSONObject changes);

	JSONObject piciList(PageOpt po);

	JSONObject work(String pici, String isAll);

	JSONObject preWork(String pici);

	JSONObject getWorkInfo(String iD);

	JSONObject updatePICIByName(String nAME);
	
	void createIndexPage();
}
