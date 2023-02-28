package cn.com.angke.lres.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.vo.PageVo;
public interface DataAnalysisService {
	/**
	 * 
	 * @Title: questionData   
	 * @Description: TODO(题目统计)   
	 * @param: @return      
	 * @return: List<Map>      
	 * @throws
	 */
	PageVo<JSONObject> questionData(PageOpt2 pageDto);
	List<List<String>> exportQuestionExcel();
	

}
