package cn.com.angke.lres.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;

public interface DataGradeService {
	List<JSONObject> bottom(String starttime, String endtime);
	void exportBottom(String starttime, String endtime) throws Exception;
}
