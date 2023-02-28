package cn.com.angke.lres.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.lres.service.DataGradeService;
import cn.com.angke.lres.vo.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/dataGrade")
@Api(tags = "年级考试统计")
public class DataGradeController {
	@Autowired
	DataGradeService dataGradeService;
	
	@ApiOperation(value="列表数据")
	@PostMapping("/bottom")
	public R<List<JSONObject>> pageQuery(@RequestParam(required=false) String starttime,
			@RequestParam(required=false) String endtime) {
		List<JSONObject> result = dataGradeService.bottom(starttime,endtime);
		return R.success(result);
	}
	
	@ApiOperation(value="导出")
	@GetMapping("/exportBottom")
	public void exportAllBottom(@RequestParam(required=false) String starttime,
			@RequestParam(required=false) String endtime) {
		try {
			dataGradeService.exportBottom(starttime,endtime);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
