package cn.com.angke.app.controller;

import org.beetl.sql.core.engine.PageQuery;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.app.service.DataAnalysisService;
import cn.com.angke.common.page.PageDto;
import cn.com.angke.common.result.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dataAnalysis")
@Api(tags = "统计分析")
@RequiredArgsConstructor
public class DataAnalysisController {
	private final DataAnalysisService dataAnalysisService;
	
	@ApiOperation(value="检索查询")
	@PostMapping("/searchData")
	public R searchData(@RequestParam String data) {
		PageDto dto = JSONObject.parseObject(data, PageDto.class);
		PageQuery<JSONObject> pageQuery = dataAnalysisService.searchData(dto);
		return R.success(pageQuery.getList(), pageQuery.getTotalRow());
	}
	
	@ApiOperation(value="下载查询")
	@PostMapping("/downloadData")
	public R downloadData(@RequestParam String data) {
		PageDto dto = JSONObject.parseObject(data, PageDto.class);
		PageQuery<JSONObject> pageQuery = dataAnalysisService.downloadData(dto);
		return R.success(pageQuery.getList(), pageQuery.getTotalRow());
	}
	
	@ApiOperation(value="阅读查询")
	@PostMapping("/readData")
	public R readData(@RequestParam String data) {
		PageDto dto = JSONObject.parseObject(data, PageDto.class);
		PageQuery<JSONObject> pageQuery = dataAnalysisService.readData(dto);
		return R.success(pageQuery.getList(), pageQuery.getTotalRow());
	}
	
	@ApiOperation(value="检索查询Excel")
	@GetMapping("/searchDataExcel")
	public void searchDataExcel(@RequestParam String data) throws Exception {
		PageDto dto = JSONObject.parseObject(data, PageDto.class);
		dataAnalysisService.searchDataExcel(dto);
	}
	
	@ApiOperation(value="下载查询Excel")
	@GetMapping("/downloadDataExcel")
	public void downloadDataExcel(@RequestParam String data) throws Exception {
		PageDto dto = JSONObject.parseObject(data, PageDto.class);
		dataAnalysisService.downloadDataExcel(dto);
	}
	
	@ApiOperation(value="阅读查询Excel")
	@GetMapping("/readDataExcel")
	public void readDataExcel(@RequestParam String data) throws Exception {
		PageDto dto = JSONObject.parseObject(data, PageDto.class);
		dataAnalysisService.readDataExcel(dto);
	}
}
