package cn.com.angke.lres.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.com.angke.lres.pojo.LresRules;
import cn.com.angke.lres.service.RulesService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.ResultMessage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/rules")
@Api(tags = "系统参数接口")
public class LresrulesController {
	@Autowired
	RulesService rulesService;
	
	@ApiOperation(value = "列表查询")
	@PostMapping("/list")
	public PageVo<LresRules> list(HttpServletRequest request) {
		List<LresRules> list= rulesService.rulesList();
		return new PageVo<LresRules>(true, list, (long)list.size());
		
	}
	
	@ApiOperation(value = "通过code查询")
	@PostMapping("/findByCode")
	public ResultMessage<LresRules> findByCode(@RequestParam String code) {
		LresRules vo = rulesService.findByCode(code);
		return new ResultMessage<LresRules>(true,vo);		
	}
	
	@ApiOperation(value = "更新")
	@PostMapping("/update")
	public ResultMessage<String> update(@RequestBody List<LresRules> rules) {
		rulesService.updateRule(rules);
		return new ResultMessage<String>(true);		
	}
}
