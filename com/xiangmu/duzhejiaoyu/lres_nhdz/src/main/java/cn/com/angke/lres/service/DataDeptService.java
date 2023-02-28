package cn.com.angke.lres.service;

import java.util.List;

import org.beetl.sql.core.engine.PageQuery;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.lres.dto.PageDto;

public interface DataDeptService {
	List<JSONObject> top(String starttime,String endtime,String grade);
	PageQuery<JSONObject> bottom(PageDto dto);
	void exportBottom(String starttime,String endtime,String grade) throws Exception;
}
