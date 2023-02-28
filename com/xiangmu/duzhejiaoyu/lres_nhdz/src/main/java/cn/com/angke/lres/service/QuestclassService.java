package cn.com.angke.lres.service;

import java.util.List;

import cn.com.angke.lres.vo.QuestionClassVo;

public interface QuestclassService {
	List<QuestionClassVo> list();
	void add(String name);
	void update(String id,String name);
	void delete(String id);
}
