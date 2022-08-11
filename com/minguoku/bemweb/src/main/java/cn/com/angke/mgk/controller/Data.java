package cn.com.angke.mgk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.com.angke.mgk.service.DataService;

@RestController
@RequestMapping("Data")
public class Data {
	
	@Autowired
	private DataService dataService;
	
	/**
	 * 	生成首页
	 * @return
	 */
	@GetMapping("genHtml")
	public String genHtml() {
		dataService.genHtml();
		return "generator is success!";
	}
	
	/**
	 * 	同步中图法分类
	 * @return
	 */
	@GetMapping("syncZttype")
	public String syncZttype () {
		dataService.syncZttype();
		return "syncZttype is success";
	}
	
	/**
	 * 检查首页图片缺失
	 */
	@GetMapping("checkPicLost")
	public String checkPicLost () {
		return dataService.checkPicLost();
	} 
	
	/**
	 * 查漏补缺
	 * @throws Exception 
	 */
	@GetMapping("checkBookLost")
	public String checkBookLost (@RequestParam(name ="batId", required = false)String batId) throws Exception {
		return dataService.checkBookLost(batId);
	}
	
}
