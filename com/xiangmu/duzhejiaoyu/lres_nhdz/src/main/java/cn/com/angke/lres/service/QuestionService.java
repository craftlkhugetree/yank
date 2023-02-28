package cn.com.angke.lres.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.dto.QuestionDto;
import cn.com.angke.lres.pojo.LresQresitem;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QuestionUseVo;
import cn.com.angke.lres.vo.QuestionVo;

public interface QuestionService {
	PageVo<QuestionVo> list(PageOpt2 pageDto);
	List<QuestionUseVo> listByQresitem(LresQresitem obj,String classIds,Boolean isUse);
	QuestionVo findById(String id);
	void add(QuestionDto obj);
	void update(QuestionDto obj);
	void delete(String id);
	void delete(String[] ids);
	void downloadTemplate(String path);
	void uploadExcel(List<QuestionDto> list);
	List<QuestionVo> excelList();
	List<JSONObject> countQuestionByClassIds(String ids);
}
