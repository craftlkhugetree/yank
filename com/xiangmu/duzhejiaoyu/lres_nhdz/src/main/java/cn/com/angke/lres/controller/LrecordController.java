package cn.com.angke.lres.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.service.LrecordService;
import cn.com.angke.lres.vo.ResultMessage;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  LrecordController   
 * @Description:TODO(学习记录控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:13:07   
 *     
 */  
@RestController
@RequestMapping("/lrecord")
@Api(tags = "学习记录接口")
public class LrecordController {
	@Autowired
	LrecordService lrecordService;
	
	@PostMapping("/saveRecord")
	public ResultMessage<JSONObject> saveRecord(HttpServletRequest request) {
		Integer result = 0;
		String action = request.getParameter("action");
		JSONObject obj = new JSONObject();
		try {
			result = lrecordService.saveRecord(action);
			obj.put("time", result);
		} catch (LresException e) {
			return new ResultMessage<>(false,e.getMessage());
		}
		return new ResultMessage<JSONObject>(true,obj);
		
	}
	
	@PostMapping("/queryUserRecord")
	public JSONObject queryUserRecord() {
		JSONObject result = new JSONObject();
		result.put("success", true);
		Integer time = lrecordService.queryRecord();
		result.put("studytime", time);
		return result;
	}
	
}
