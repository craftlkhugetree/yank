package cn.com.angke.app.service;

import org.beetl.sql.core.engine.PageQuery;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.common.page.PageDto;

public interface DataAnalysisService {
	PageQuery<JSONObject> searchData(PageDto dto);
	PageQuery<JSONObject> downloadData(PageDto dto);
	PageQuery<JSONObject> readData(PageDto dto);
	void searchDataExcel(PageDto dto) throws Exception;
	void downloadDataExcel(PageDto dto) throws Exception;
	void readDataExcel(PageDto dto) throws Exception;
}
