package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;


public interface ExcelSqlService extends PlatformBaseService {

	JSONObject ztfExcel(String furl);

	JSONObject jnExcel(String furl);

	JSONObject sxExcel(String furl);

	JSONObject tzExcel(String furl);

	JSONObject delSql();

	JSONObject jgExcel(String furl);
	
}
