package cn.com.angke.lres.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.pojo.LresConfig;
import cn.com.angke.lres.pojo.LresReadertype;
import cn.com.angke.lres.pojo.LresUser;
import cn.com.angke.lres.service.ConfigService;
import cn.com.angke.lres.service.ReaderTypeService;
import cn.com.angke.lres.service.UserService;
import cn.com.angke.lres.vo.BigTingVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.R;
import cn.com.angke.lres.vo.ResultMessage;
import cn.com.angke.lres.vo.UserVo;
import cn.com.angke.util.ExcelUtil;
import cn.com.angke.util.HttpUtil;
import io.swagger.annotations.Api;

/**
 * @ClassName: UserController
 * @Description:TODO(用户控制器)
 * @author: xyp
 * @date: 2019年3月14日 上午10:16:18
 * 
 */
@RestController
@RequestMapping("/user")
@Api(tags = "用户接口")
public class UserController {
	@Autowired
	UserService userService;
	@Autowired
	ReaderTypeService readerTypeService;
	@Autowired
	ConfigService configService;

	@PostMapping("/pageList")
	public PageVo<UserVo> pageList(HttpServletRequest request) {
//		String param = request.getParameter("queryParam");
//		String grade = request.getParameter("grade");
//		String startDate = request.getParameter("startDate");
//		String endDate = request.getParameter("endDate");
		PageOpt2 pageDto = PageOpt2.produceFromLayUI(request);
//		pageDto.setCondition("queryParam", param, null, null);
//		pageDto.setCondition("grade", grade, null, null);
//		pageDto.setCondition("startDate", startDate, null, null);
//		pageDto.setCondition("endDate", endDate, null, null);
		PageVo<UserVo> pageVo = userService.pageQuery(pageDto);
		return pageVo;
	}

	@PostMapping("/bindUserCampus")
	public ResultMessage<String> add(@RequestParam String data) {
		JSONObject params = JSONObject.parseObject(data);
		userService.bindUserCampus(params);
		return new ResultMessage<>(true, "");

	}

	@PostMapping("/userInfo")
	public ResultMessage<LresUser> userInfo() {
		LresUser result = userService.userInfo();
		return new ResultMessage<>(true, result);

	}

	@PostMapping("/acitveReader")
	public ResultMessage<String> acitveReader(@RequestParam String id) {
		try {
			userService.acitveReader(id);
		} catch (LresException e) {
			return new ResultMessage<>(true, e.getError_msg());
		}
		return new ResultMessage<>(true, "");
	}

	@PostMapping("/deleteReader")
	public ResultMessage<String> deleteReader(@RequestParam String id) {
		userService.delete(id);
		return new ResultMessage<>(true, "");
	}

	@PostMapping("/bigThing")
	public PageVo<BigTingVo> bigThing() {
		PageVo<BigTingVo> resultVo = new PageVo<BigTingVo>();
		List<BigTingVo> list = new ArrayList<BigTingVo>();
		try {
			list = userService.bigThing();
		} catch (LresException e) {
			return new PageVo<>(true, e.getError_msg());
		}
		resultVo.setSuccess(true);
		resultVo.setItems(list);
		resultVo.setTotal((long) list.size());
		return resultVo;
	}

	@GetMapping("/exportExcel")
	public void downloadQuestion(HttpServletRequest request, HttpServletResponse response) {
		String param = request.getParameter("queryParam");
		String grade = request.getParameter("grade");
		String startDate = request.getParameter("startDate");
		String endDate = request.getParameter("endDate");
		Map<String, String> params = new HashMap<String, String>();
		params.put("queryParam", param);
		params.put("grade", grade);
		params.put("startDate", startDate);
		params.put("endDate", endDate);
		LresConfig config= configService.findByCode("ISNEEDQQ");
		String val = config.getConfigval();
		params.put("needqq", val);
		List<List<String>> list = userService.excelList(params);
		// excel文件名
		String fileName = System.currentTimeMillis() + ".xlsx";
		List<String> titleList = Arrays.asList(
				new String[] { "证件", "条码","身份证号", "校区", "所属", "姓名", "性别", "身份", "QQ", "电话", "邮箱", "状态", "考试时间", "考试详情" });
		if(val.equals("0")) {
			 titleList = Arrays.asList(
				new String[] { "证件", "条码","身份证号", "校区", "所属", "姓名", "性别", "身份", "状态", "考试时间", "考试详情" });
		}
		// 创建HSSFWorkbook
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

	@PostMapping("/readerType")
	public PageVo<LresReadertype> readerType() {
		List<LresReadertype> list = readerTypeService.list();
		return new PageVo<LresReadertype>(true, list, (long) list.size());
	}

	@PostMapping("/syncReaderType")
	public ResultMessage<String> syncReaderType() {
		readerTypeService.syncReaderType();
		return new ResultMessage<>(true, "");
	}

	@GetMapping("/newStuTemplate")
	public void newStuTemplate(HttpServletRequest request, HttpServletResponse response) {
		String path = request.getSession().getServletContext().getRealPath("/template/new_student.xlsx");
		userService.newStuTemplate(path);
	}

	@GetMapping("/syncStuTemplate")
	public void syncStuTemplate(HttpServletRequest request, HttpServletResponse response) {
		String path = request.getSession().getServletContext().getRealPath("/template/sync_student.xlsx");
		userService.syncStuTemplate(path);
	}

	@PostMapping("/importNewStu")
	public JSONObject importNewStu(MultipartFile file) {
		JSONObject result = new JSONObject();
		try {
			result = userService.importNewStu(file);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

	@PostMapping("/importSyncStu")
	public JSONObject importSyncStu(MultipartFile file) {
		JSONObject result = new JSONObject();
		try {
			result = userService.importSyncStu(file);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

	@PostMapping("/userIP")
	public JSONObject userIP(HttpServletRequest request) {
		JSONObject obj = new JSONObject();
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		obj.put("IP", ip);
		obj.put("success", true);
		return obj;
	}
	
	@PostMapping("/unnormalStus")
	public R<List<JSONObject>> unnormalStus() {
		List<JSONObject> list = userService.unnormalStus();
		return R.success(list, (long)list.size());
	}
	
	@PostMapping("/batchActive")
	public R<Boolean> batchActive(@RequestParam String ids) {
		String[] arrIds = ids.split(",");
		for(String id : arrIds) {
			userService.acitveReader(id);
		}
		return R.success();
	}
}
