package cn.com.angke.lres.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.beetl.sql.core.engine.PageQuery;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;
import com.somenew.utils.StringOpt;

import cn.com.angke.lres.dto.QuestionDto;
import cn.com.angke.lres.pojo.LresQoption;
import cn.com.angke.lres.pojo.LresQresitem;
import cn.com.angke.lres.pojo.LresQuestcount;
import cn.com.angke.lres.pojo.LresQuestion;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.QuestionService;
import cn.com.angke.lres.vo.OptionVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QuestionUseVo;
import cn.com.angke.lres.vo.QuestionVo;
import cn.com.angke.util.UserUtil;

@Service
public class QuestionServiceImpl extends BaseService implements QuestionService{
	@Override
	public PageVo<QuestionVo> list(PageOpt2 pageDto) {
		PageQuery<QuestionVo> pageQuery = new PageQuery<QuestionVo>();
		JSONArray arrays = pageDto.getConditions();
		Map<Object,Object> paras = new HashMap<Object,Object>();
		paras.put("tid", UserUtil.getTid());
		if(null!=arrays && !arrays.isEmpty()) {
			arrays.stream().forEach(m->{
				JSONObject json = (JSONObject) m;
				paras.put(json.get("property"), json.get("value"));
			});
		}
		Integer pageNum = pageDto.getStart()/pageDto.getPageSize()+1;
		pageQuery.setPageNumber(pageNum < 0?1:pageNum);
		pageQuery.setPageSize(pageDto.getPageSize()<1?10:pageDto.getPageSize());
		pageQuery.setParas(paras);
		PageQuery<QuestionVo> result = sqlManager().pageQuery("lresQuestion.pageQueryList", QuestionVo.class, pageQuery);
		PageVo<QuestionVo> pageVo = new PageVo<QuestionVo>(true,result.getList(),result.getTotalRow());
		return pageVo;
	}
	
	@Override
	public List<QuestionUseVo> listByQresitem(LresQresitem obj,String classIds,Boolean isUse) {
		Map<String,Object> paras = new HashMap<String,Object>();
		paras.put("classIds",classIds);
		paras.put("quesNum",obj.getQuesNum());
		paras.put("quesType",obj.getQuesType());
		paras.put("score",obj.getScore());
		paras.put("tid",UserUtil.getTid());
		List<QuestionUseVo> list = new ArrayList<QuestionUseVo>();
		String sqlId = null;
		if(isUse) {
			sqlId = "lresQresource.queryMustUseByItem";
		}else {
			sqlId = "lresQresource.queryAppendUseByItem";
		}
		list = sqlManager().select(sqlId, QuestionUseVo.class, paras);		
		return list;
	}

	@Override
	@Transactional
	public void add(QuestionDto obj) {
		LresQuestion quest = new LresQuestion();
		List<LresQoption> olist = obj.getOptionList();
		BeanUtils.copyProperties(obj, quest);
		String questId = StringOpt.produceUUID();
		quest.setId(questId);
		this.fillBasePro(quest);
		sqlManager().insert(quest);
		LresQuestcount count = new LresQuestcount();
		count.setId(StringOpt.produceUUID());
		count.setQuestId(questId);
		count.setUseNum(0);
		count.setPassNum(0);
		fillBasePro(count);
		sqlManager().insert(count);
		if(null != olist && olist.size() > 0) {
			olist.stream().forEach(item->{
				item.setId(StringOpt.produceUUID());
				item.setQuestId(questId);
				this.fillBasePro(item);
			});
			sqlManager().insertBatch(LresQoption.class, olist);
		}
	}

	@Override
	@Transactional
	public void update(QuestionDto obj) {
		LresQuestion quest = new LresQuestion();
		List<LresQoption> olist = obj.getOptionList();
		BeanUtils.copyProperties(obj, quest);
		String questId = quest.getId();
		sqlManager().updateTemplateById(quest);
		Map<String,String> map = new HashMap<String,String>();
		map.put("questId", questId);
		sqlManager().update("lresQoption.deleteTrueByQuestId", map);
		if(null != olist && olist.size() > 0) {
			List<LresQoption> willAddList = new ArrayList<LresQoption>();
			olist.stream().forEach(item->{
					item.setId(StringOpt.produceUUID());
					item.setQuestId(questId);
					this.fillBasePro(item);
					willAddList.add(item);
			});
			sqlManager().insertBatch(LresQoption.class, willAddList);
		}
	}

	@Override
	@Transactional
	public void delete(String id) {
		LresQuestion quest = new LresQuestion();
		quest.setId(id);
		quest.setIsDelete(0);
		sqlManager().updateTemplateById(quest);
		LresQoption option = new LresQoption();
		option.setQuestId(id);
		sqlManager().update("lresQuestcount.deleteByQuestId", option);
		sqlManager().update("lresQoption.deleteByQuestId", option);
	}
	
	@Override
	@Transactional
	public void delete(String[] ids) {
		Map<String,Object> params = new HashMap<>();
		params.put("ids", Arrays.asList(ids));
		sqlManager().update("lresQoption.deleteByQuestIds", params);
		sqlManager().update("lresQuestcount.deleteByQuestIds", params);
		sqlManager().update("lresQuestion.deleteByIds", params);
	}

	@Override
	public QuestionVo findById(String id) {
		QuestionVo resVo = new QuestionVo();
		LresQuestion question = sqlManager().single(LresQuestion.class, id);
		LresQoption opParam = new LresQoption();
		opParam.setQuestId(id);
		List<OptionVo> optionList = sqlManager().select("lresQoption.queryListByQid", OptionVo.class, opParam);
		BeanUtils.copyProperties(question, resVo);
		resVo.setOptionList(optionList);
		return resVo;
	}

	@Override
	public void downloadTemplate(String path) {
		this.download(path, getResponse());
	}

	@Override
	@Transactional
	public void uploadExcel(List<QuestionDto> list) {
		List<LresQuestion> qList = new ArrayList<LresQuestion>();
		List<LresQoption> oList = new ArrayList<LresQoption>();
		List<LresQuestcount> cList = new ArrayList<>();
		for(QuestionDto dto : list) {
			LresQuestion question = new LresQuestion();
			String qid = StringOpt.produceUUID();
			BeanUtils.copyProperties(dto, question);
			question.setId(qid);
			fillBasePro(question);
			qList.add(question);
			LresQuestcount count = new LresQuestcount();
			count.setId(StringOpt.produceUUID());
			count.setQuestId(qid);
			count.setUseNum(0);
			count.setPassNum(0);
			fillBasePro(count);
			cList.add(count);
			List<LresQoption> options = dto.getOptionList();
			if(null != options && options.size() > 0) {
				for(LresQoption option : options) {
					option.setId(StringOpt.produceUUID());
					option.setQuestId(qid);
					fillBasePro(option);
					oList.add(option);
				}
			}
		}
		sqlManager().insertBatch(LresQuestion.class, qList);
		sqlManager().insertBatch(LresQuestcount.class, cList);
		sqlManager().insertBatch(LresQoption.class, oList);
	}

	@Override
	public List<QuestionVo> excelList() {
		Map<String,String> paras = new HashMap<String,String>();
		paras.put("tid", UserUtil.getTid());
		List<QuestionVo> list = sqlManager().select("lresQuestion.excelList", QuestionVo.class, paras);
		return list;
	}

	@Override
	public List<JSONObject> countQuestionByClassIds(String ids) {
		Map<String,String> paras = new HashMap<String,String>();
		paras.put("tid", UserUtil.getTid());
		paras.put("classIds", ids);
		List<JSONObject> list = sqlManager().select("lresQuestion.questionTypeCount", JSONObject.class, paras);
		return list;
	}
}
