package cn.com.angke.lres.service;

import java.util.List;

import cn.com.angke.lres.pojo.LresRules;

public interface RulesService {
	List<LresRules> rulesList();
	LresRules findByCode(String code);
	void updateRule(List<LresRules> rules);
}
