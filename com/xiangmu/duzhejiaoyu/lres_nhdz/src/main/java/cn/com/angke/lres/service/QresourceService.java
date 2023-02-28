package cn.com.angke.lres.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.dto.QresourceDto;
import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.pojo.LresQresource;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QresourceUseVo;
import cn.com.angke.lres.vo.QresourceVo;
import cn.com.angke.lres.vo.QuestionVo;

public interface QresourceService {
	PageVo<QresourceVo> list(PageOpt2 pageDto);
	QresourceVo findById(String id);
	JSONObject add(QresourceDto obj)  throws Exception;
	JSONObject update(QresourceDto obj)  throws Exception;
	void delete(String id);
	List<QresourceUseVo> queryUseQresByCampusId(LresQresource res)  throws LresException;
	boolean optionIsTrue(String questId,String optionIds);
	boolean optionIsTrue(String questId, String optionIds,QuestionVo vo);
	JSONObject optionResultAna(String questId,String optionIds);
	JSONObject trueResultAna(String questId);
	JSONObject checkResultList(String id,List<JSONObject> questList);
	JSONObject checkLevelResultList(String levelId,List<JSONObject> questList);
	JSONObject checkResultListAna(String id, List<JSONObject> array);
}
