package cn.com.angke.lres.controller;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.dto.QuestionDto;
import cn.com.angke.lres.pojo.LresQoption;
import cn.com.angke.lres.service.QuestclassService;
import cn.com.angke.lres.service.QuestionService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QuestionClassVo;
import cn.com.angke.lres.vo.QuestionVo;
import cn.com.angke.lres.vo.ResultMessage;
import cn.com.angke.util.ExcelUtil;
import cn.com.angke.util.HttpUtil;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  QuestionController   
 * @Description:TODO(题目控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:15:13   
 *     
 */  
@RestController
@RequestMapping("/qusetion")
@Api(tags = "题目接口")
public class QuestionController {
	@Autowired
	QuestionService questionService;
	@Autowired
	QuestclassService qusetclassService;
	
	@PostMapping("/pageList")
	public PageVo<QuestionVo> list(HttpServletRequest request) {
		PageOpt2 pageDto = PageOpt2.produceFromLayUI(request);
		return questionService.list(pageDto);
		
	}
	
	@PostMapping("/find")
	public ResultMessage<QuestionVo> find(@RequestParam String id) {
		QuestionVo vo = questionService.findById(id);
		return new ResultMessage<QuestionVo>(true,vo);		
	}
	
	@PostMapping("/countQuestionByClassIds")
	public PageVo<JSONObject> countQuestionByClassIds(@RequestParam String classIds) {
		List<JSONObject> vo = questionService.countQuestionByClassIds(classIds);
		PageVo<JSONObject> listVo = new PageVo<JSONObject>();
		listVo.setItems(vo);
		listVo.setSuccess(true);
		return listVo;		
	}
	
	@PostMapping("/add")
	public ResultMessage<String> add(@RequestParam String data) {
		QuestionDto dto = JSONObject.parseObject(data, QuestionDto.class);
		questionService.add(dto);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/update")
	public ResultMessage<String> update(@RequestParam String data) {
		QuestionDto dto = JSONObject.parseObject(data, QuestionDto.class);
		questionService.update(dto);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/delete")
	public ResultMessage<String> delete(@RequestParam String id) {
		questionService.delete(id);
		return new ResultMessage<>(true,"");		
	}
	
	@PostMapping("/deleteByIds")
	public ResultMessage<String> delete(@RequestParam String[] ids) {
		questionService.delete(ids);
		return new ResultMessage<>(true,"");		
	}
	
	@GetMapping("/downloadTemplate")
	public void downloadTemplate(HttpServletRequest request, HttpServletResponse response) {
		String path = request.getSession().getServletContext().getRealPath("/template/questions.xlsx");
		questionService.downloadTemplate(path);
	}
	
	@PostMapping("/uploadQuestion")
	public ResultMessage<String> uploadQuestion(@RequestParam("file") CommonsMultipartFile file) {
		List<QuestionClassVo> classlist = qusetclassService.list();
		List<QuestionDto> resultList = new ArrayList<QuestionDto>();
		try {
			ExcelUtil util = new ExcelUtil(file.getInputStream(), "");
			JSONObject obj = sheetData(classlist, resultList, util);
			if(obj.getBooleanValue("success")) {
				questionService.uploadExcel(resultList);
			}else {
				return new ResultMessage<>(false, obj.getString("msg"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResultMessage<>(false, e.getMessage());
		}
		return new ResultMessage<>(true, "");
	}

	private JSONObject sheetData(List<QuestionClassVo> classlist, List<QuestionDto> resultList, ExcelUtil util)
			throws Exception {
		JSONObject result = new JSONObject();
		result.put("success", true);
		Map<String,String> errMap = new HashMap<>();
		//单选
		List<List<String>> data = util.read(0);
		if(data.size() > 1) {
			for (int i = 0; i < data.size(); i++) {
				// 去除表头
				if (i < 1) {
					continue;
				}
				List<String> row = data.get(i);
				//判断每行数据是否正确
				if(StringUtils.isBlank(row.get(0))) {
					errMap.put("单选第"+i+"行", "题库名称不能为空");
					continue;
				}else if(StringUtils.isBlank(row.get(1))) {
					errMap.put("单选第"+i+"行", "题目不能为空");
					continue;
				}else if(StringUtils.isBlank(row.get(4))) {
					errMap.put("单选第"+i+"行", "正确答案不能为空");
					continue;
				}
				QuestionDto dto = new QuestionDto();
				String questKu = row.get(0);
				// 判断试题分类是否存在
				String classId = validQuest(classlist, questKu);
				if(null == classId) {
					errMap.put("单选第"+i+"行", "题库名称不存在");
					continue;
				}
				dto.setQuesType(1);
				List<LresQoption> opList = new ArrayList<LresQoption>();
				dto.setClassId(classId);
				dto.setQuesTitle(row.get(1));
				if (null == row.get(2) || "否".equals(row.get(2).trim())) {
					dto.setIsUse(0);
				} else {
					dto.setIsUse(1);
				}
				dto.setQuesAnaly(row.get(3));
				String trueOptions = row.get(4);
				String optionA = row.size() > 5?row.get(5):null;
				String optionB = row.size() > 6?row.get(6):null;
				String optionC = row.size() > 7?row.get(7):null;
				String optionD = row.size() > 8?row.get(8):null;
				String optionE = row.size() > 9?row.get(9):null;
				String optionF = row.size() > 10?row.get(10):null;
				List<String> optionList = Arrays.asList(optionA,optionB,optionC,optionD,optionE,optionF);
				optionList = optionList.stream().filter(o->null!=o&&o.length()>0).collect(Collectors.toList());
				optionList.stream().forEach(m->{
					if(null != m && m.length() > 0) {
						LresQoption option = new LresQoption();
						option.setOptionItem(m.substring(2));
						option.setIsTrue(0);
						String optionChar = m.substring(0, 1).toUpperCase();
						if(trueOptions.contains(optionChar)) {
							option.setIsTrue(1);
						}
						opList.add(option);
					}
				});
				dto.setOptionList(opList);
				resultList.add(dto);
			}
		}
		
		//多选
		List<List<String>> data2 = util.read(1);
		if(data2.size() > 1) {
			for (int i = 0; i < data2.size(); i++) {
				// 去除表头
				if (i < 1) {
					continue;
				}
				List<String> row = data2.get(i);
				//判断每行数据是否正确
				if(StringUtils.isBlank(row.get(0))) {
					errMap.put("多选第"+i+"行", "题库名称不能为空");
					continue;
				}else if(StringUtils.isBlank(row.get(1))) {
					errMap.put("多选第"+i+"行", "题目不能为空");
					continue;
				}else if(StringUtils.isBlank(row.get(4))) {
					errMap.put("多选第"+i+"行", "正确答案不能为空");
					continue;
				}
				QuestionDto dto = new QuestionDto();
				String questKu = row.get(0);
				// 判断试题分类是否存在
				String classId = validQuest(classlist, questKu);
				if(null == classId) {
					errMap.put("多选第"+i+"行", "题库名称不存在");
					continue;
				}
				dto.setQuesType(2);
				List<LresQoption> opList = new ArrayList<LresQoption>();
				dto.setClassId(classId);
				dto.setQuesTitle(row.get(1));
				if (null == row.get(2) || "否".equals(row.get(2).trim())) {
					dto.setIsUse(0);
				} else {
					dto.setIsUse(1);
				}
				dto.setQuesAnaly(row.get(3));
				String trueOptions = row.get(4);
				String optionA = row.size() > 5?row.get(5):null;
				String optionB = row.size() > 6?row.get(6):null;
				String optionC = row.size() > 7?row.get(7):null;
				String optionD = row.size() > 8?row.get(8):null;
				String optionE = row.size() > 9?row.get(9):null;
				String optionF = row.size() > 10?row.get(10):null;
				List<String> optionList = Arrays.asList(optionA,optionB,optionC,optionD,optionE,optionF);
				optionList = optionList.stream().filter(o->null!=o&&o.length()>0).collect(Collectors.toList());
				optionList.stream().forEach(m->{
					if(null != m && m.length() > 0) {
						LresQoption option = new LresQoption();
						String optionChar = m.substring(0, 1).toUpperCase();
						option.setOptionItem(m.substring(2));
						option.setIsTrue(0);
						if(trueOptions.contains(optionChar)) {
							option.setIsTrue(1);
						}
						opList.add(option);
					}
				});
				dto.setOptionList(opList);
				resultList.add(dto);
			}
		}
		
		//判断
		List<List<String>> data3 = util.read(2);
		if(data3.size() > 1) {
			for (int i = 0; i < data3.size(); i++) {
				// 去除表头
				if (i < 1) {
					continue;
				}
				List<String> row = data3.get(i);
				//判断每行数据是否正确
				if(StringUtils.isBlank(row.get(0))) {
					errMap.put("判断第"+i+"行", "题库名称不能为空");
					continue;
				}else if(StringUtils.isBlank(row.get(1))) {
					errMap.put("判断第"+i+"行", "题目不能为空");
					continue;
				}
				QuestionDto dto = new QuestionDto();
				String questKu = row.get(0);
				// 判断试题分类是否存在
				String classId = validQuest(classlist, questKu);
				if(null == classId) {
					errMap.put("判断第"+i+"行", "题库名称不存在");
					continue;
				}
				dto.setQuesType(3);
				dto.setClassId(classId);
				dto.setQuesTitle(row.get(1));
				if (null == row.get(2) || "否".equals(row.get(2).trim())) {
					dto.setIsUse(0);
				} else {
					dto.setIsUse(1);
				}
				dto.setQuesAnaly(row.get(3));
				if (null == row.get(4) || "否".equals(row.get(4).trim())) {
					dto.setIsTrue(0);
				} else {
					dto.setIsTrue(1);
				}
				resultList.add(dto);
			}
		}
		if(errMap.size() > 0) {
			result.put("success", false);
			result.put("msg", JSONObject.toJSON(errMap));
		}
		return result;
		
	}

	private String validQuest(List<QuestionClassVo> classlist, String questKu) {
		String classId = null;
		if (null == questKu) {
			return null;
		} else {
			for (QuestionClassVo vo : classlist) {
				if(null == classId) {
					classId = vo.getName().equals(questKu.trim()) ? vo.getId() : null;
				}
			}
		}
		return classId;
	}

	@GetMapping("/downloadQuestion")
	public void downloadQuestion(HttpServletRequest request, HttpServletResponse response) {
		List<QuestionVo> list = questionService.excelList();
		String fileName = System.currentTimeMillis() + ".xlsx";
		Workbook workbook = new XSSFWorkbook();
		ExcelUtil util = new ExcelUtil(workbook);
		try {
			List<String> title1 = Arrays.asList(new String[] {"题库名称","题目","是否必考","题目分析","正确选项","选项A","选项B","选项C","选项D","选项E","选项F"});
			List<List<String>> data1 = new ArrayList<>();
			data1.add(title1);
			list.stream().filter(m->m.getQuesType().intValue() == 1).forEach(m->{
				List<String> data = new ArrayList<>();
				data.add(m.getClassStr());
				data.add(m.getQuesTitle());
				data.add(m.getIsUse().intValue() == 0?"否":"是");
				data.add(m.getQuesAnaly());
				String trueOpt = "";
				int code = 65;
				List<String> optionList = new ArrayList<>();
				String optStrs = m.getOptionStr();
				String[] opts = optStrs.split("\\|");
				for(String op : opts) {
					if(op.contains("$T$")) {
						trueOpt+=","+(char)code;
					}
					optionList.add((char)code+"." + op.replace("$T$","" ));
					code++;
				}
				data.add(trueOpt.substring(1));
				data.addAll(optionList);
				data1.add(data);
			});
			util.write(data1, "单选题",true);
			
			List<String> title2 = Arrays.asList(new String[] {"题库名称","题目","是否必考","题目分析","正确选项","选项A","选项B","选项C","选项D","选项E","选项F"});
			List<List<String>> data2 = new ArrayList<>();
			data2.add(title2);
			list.stream().filter(m->m.getQuesType().intValue() == 2).forEach(m->{
				List<String> data = new ArrayList<>();
				data.add(m.getClassStr());
				data.add(m.getQuesTitle());
				data.add(m.getIsUse().intValue() == 0?"否":"是");
				data.add(m.getQuesAnaly());
				String trueOpt = "";
				int code = 65;
				List<String> optionList = new ArrayList<>();
				String optStrs = m.getOptionStr();
				String[] opts = optStrs.split("\\|");
				for(String op : opts) {
					if(op.contains("$T$")) {
						trueOpt+=","+(char)code;
					}
					optionList.add((char)code+"." + op.replace("$T$",""));
					code++;
				}
				data.add(trueOpt.substring(1));
				data.addAll(optionList);
				data2.add(data);
			});
			util.write(data2, "多选题",true);
			
			List<String> title3 = Arrays.asList(new String[] {"题库名称","题目","是否必考","题目分析","是否正确"});
			List<List<String>> data3 = new ArrayList<>();
			data3.add(title3);
			list.stream().filter(m->m.getQuesType().intValue() == 3).forEach(m->{
				List<String> data = new ArrayList<>();
				data.add(m.getClassStr());
				data.add(m.getQuesTitle());
				data.add(m.getIsUse().intValue() == 0?"否":"是");
				data.add(m.getQuesAnaly());
				data.add(m.getIsTrue().intValue() == 0?"否":"是");
				data3.add(data);
			});
			util.write(data3, "判断题",true);
			HttpUtil.setResponseHeader(response, fileName);
			OutputStream os = response.getOutputStream();
			workbook.write(os);
			os.flush();
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
