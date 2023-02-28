package cn.com.angke.lres.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import cn.com.angke.lres.pojo.LresRules;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.RulesService;

@Service
public class RulesServiceImpl extends BaseService implements RulesService {

	@Override
	public List<LresRules> rulesList() {
		return sqlManager().query(LresRules.class).select();
	}

	@Override
	public LresRules findByCode(String code) {
		LresRules res = sqlManager().query(LresRules.class).andEq("RCODE", code).single();
		return res;
	}

	@Override
	public void updateRule(List<LresRules> rules) {
		sqlManager().updateBatchTemplateById(LresRules.class, rules);
	}

}
