package cn.com.angke.lres.controller;

import java.util.List;

import org.beetl.sql.core.engine.PageQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.lres.dto.PageDto;
import cn.com.angke.lres.service.DataDeptService;
import cn.com.angke.lres.vo.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/dataDept")
@Api(tags = "考试统计")
public class DataDeptController {
	@Autowired
	DataDeptService dataDeptService;
	
	@ApiOperation(value="汇总数据")
	@PostMapping("/top")
	public R<List<JSONObject>> top(@RequestParam(required=false) String starttime,
			@RequestParam(required=false) String endtime,@RequestParam(required=false) String grade) {
		List<JSONObject> result = dataDeptService.top(starttime,endtime,grade);
		return R.success(result);
	}
	
	@ApiOperation(value="列表数据")
	@PostMapping("/bottom")
	public R<List<JSONObject>> pageQuery(@RequestBody PageDto dto) {
		PageQuery<JSONObject> pageQuery = dataDeptService.bottom(dto);
		return R.success(pageQuery.getList(), pageQuery.getTotalRow());
	}
	
	@ApiOperation(value="导出")
	@GetMapping("/exportBottom")
	public void exportAllBottom(@RequestParam(required=false) String starttime,
			@RequestParam(required=false) String endtime,@RequestParam(required=false) String grade) {
		try {
			dataDeptService.exportBottom(starttime,endtime,grade);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
