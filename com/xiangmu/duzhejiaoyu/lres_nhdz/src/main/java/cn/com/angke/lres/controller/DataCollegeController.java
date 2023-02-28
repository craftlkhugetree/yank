package cn.com.angke.lres.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.lres.service.DataCollegeService;
import cn.com.angke.lres.vo.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/dataCollege")
@Api(tags = "学院考试统计")
public class DataCollegeController {
	@Autowired
	DataCollegeService dataCollegeService;
	
	@ApiOperation(value="列表数据")
	@PostMapping("/bottom")
	public R<List<JSONObject>> pageQuery(@RequestParam(required=false) String starttime,
			@RequestParam(required=false) String endtime) {
		List<JSONObject> result = dataCollegeService.bottom(starttime,endtime);
		return R.success(result);
	}
	
	@ApiOperation(value="导出")
	@GetMapping("/exportBottom")
	public void exportAllBottom(@RequestParam(required=false) String starttime,
			@RequestParam(required=false) String endtime) {
		try {
			dataCollegeService.exportBottom(starttime,endtime);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
