package cn.com.angke.lres.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.com.angke.lres.pojo.LresConfig;
import cn.com.angke.lres.service.ConfigService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.ResultMessage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/config")
@Api(tags = "配置接口")
public class ConfigController {
	@Autowired
	ConfigService configService;
	
	@PostMapping("/list")
	public PageVo<LresConfig> list() {
		List<LresConfig> list = configService.list();
		return new PageVo<LresConfig>(true,list,(long)list.size());
	}
	
	@ApiOperation(value = "通过code查询")
	@PostMapping("/findByCode")
	public ResultMessage<LresConfig> findByCode(@RequestParam String code) {
		LresConfig vo = configService.findByCode(code);
		return new ResultMessage<LresConfig>(true,vo);		
	}
}
