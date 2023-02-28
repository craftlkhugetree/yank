package cn.com.angke.lres.controller;

import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.service.DataAnalysisService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.util.ExcelUtil;
import cn.com.angke.util.HttpUtil;
import io.swagger.annotations.Api;

@RestController
@RequestMapping("/dataAnalysis")
@Api(tags = "统计接口")
public class DataAnalysisController {
	@Autowired
	DataAnalysisService dataAnalysisService;
	
	@PostMapping("/questionData")
	public PageVo<JSONObject> questionData(HttpServletRequest request) {
		PageOpt2 pageDto = PageOpt2.produceFromLayUI(request);
		PageVo<JSONObject> pageVo = dataAnalysisService.questionData(pageDto);
		return pageVo;
	}
	
	@GetMapping("/exportQuestionExcel")
	public void downloadQuestion(HttpServletRequest request, HttpServletResponse response) {
		List<List<String>> list = dataAnalysisService.exportQuestionExcel();
		// excel文件名
		String fileName = System.currentTimeMillis() + ".xlsx";
		List<String> titleList = Arrays.asList(new String[] {"题目名","答题次数","正确次数","错误次数","正确率"});
		//创建HSSFWorkbook 
		Workbook wb = ExcelUtil.createExcelFile(titleList, list, "xlsx");
		try {
			HttpUtil.setResponseHeader(response, fileName);
			OutputStream os = response.getOutputStream();
			wb.write(os);
			os.flush();
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
