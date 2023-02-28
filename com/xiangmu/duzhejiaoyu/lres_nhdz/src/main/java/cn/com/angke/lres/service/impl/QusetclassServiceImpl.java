package cn.com.angke.lres.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.somenew.utils.StringOpt;

import cn.com.angke.lres.pojo.LresQuestclass;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.QuestclassService;
import cn.com.angke.lres.vo.QuestionClassVo;

@Service
public class QusetclassServiceImpl extends BaseService implements QuestclassService {
	
	@Override
	public List<QuestionClassVo> list() {
		String sqlId = "lresQuestclass.queryList";
		LresQuestclass params = new LresQuestclass();
		this.fillParamTID(params);
		return sqlManager().select(sqlId, QuestionClassVo.class, params);
	}

	@Override
	public void add(String name) {
		LresQuestclass obj = new LresQuestclass();
		obj.setId(StringOpt.produceUUID());
		obj.setName(name);
		this.fillBasePro(obj);
		sqlManager().insert(obj);

	}

	@Override
	public void delete(String id) {
		LresQuestclass obj = new LresQuestclass();
		obj.setId(id);
		obj.setIsDelete(0);
		sqlManager().updateTemplateById(obj);
	}

	@Override
	public void update(String id, String name) {
		LresQuestclass obj = new LresQuestclass();
		obj.setId(id);
		obj.setName(name);
		sqlManager().updateTemplateById(obj);
	}
	
}
