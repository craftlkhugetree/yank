package cn.com.angke.lres.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.pojo.LresQresource;
import cn.com.angke.lres.service.QresourceService;
import cn.com.angke.lres.service.QuestionService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QresourceUseVo;
import cn.com.angke.lres.vo.ResultMessage;
import cn.com.angke.util.UserUtil;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  QresourceUseController   
 * @Description:TODO(手机端获取试卷及判断答案分析控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:14:14   
 *     
 */  
@RestController
@RequestMapping("/qresourceUse")
@Api(tags = "手机端考试接口")
public class QresourceUseController {
	@Autowired
	QresourceService qresourceService;
	@Autowired
	QuestionService questionService;
	
	
	@PostMapping("/list")
	public PageVo<QresourceUseVo> list(@RequestParam String campusId,@RequestParam String userType,HttpServletRequest request){
		String testType = request.getParameter("testType");
		List<QresourceUseVo> voList = new ArrayList<QresourceUseVo>();
		LresQresource res = new LresQresource();
		res.setCampusId(campusId);
		res.setUserType(userType);
		res.setTid(UserUtil.getTid());
		if(null != testType && StringUtils.isNotBlank(testType)) {
			res.setTestType(Integer.parseInt(testType));
		}
		try {
			voList = qresourceService.queryUseQresByCampusId(res);
		} catch (LresException e) {
			return new PageVo<>(true,e.getError_msg());
		}
		PageVo<QresourceUseVo> pageVO = new PageVo<QresourceUseVo>();
		pageVO.setItems(voList);
		pageVO.setSuccess(true);
		pageVO.setTotal((long)voList.size());
		return pageVO;
	}
	
	@PostMapping("/optionResult")
	public ResultMessage<JSONObject> optionIsTrue(@RequestParam String questId,@RequestParam String optionIds){
		JSONObject obj = new JSONObject();
		obj.put("result", qresourceService.optionIsTrue(questId, optionIds));
		return new ResultMessage<JSONObject>(true,obj);
	}
	
	@PostMapping("/optionResultAna")
	public ResultMessage<JSONObject> optionResultAna(@RequestParam String questId,@RequestParam String optionIds){
		JSONObject obj = qresourceService.optionResultAna(questId, optionIds);
		return new ResultMessage<JSONObject>(true,obj);
	}
	
	@PostMapping("/trueResultAna")
	public ResultMessage<JSONObject> trueResultAna(@RequestParam String questId){
		JSONObject obj = qresourceService.trueResultAna(questId);
		return new ResultMessage<JSONObject>(true,obj);
	}
	
	@PostMapping("/checkResultList")
	public ResultMessage<JSONObject> checkResultList(@RequestParam String id,@RequestParam String questList){
		List<JSONObject> array = JSON.parseObject(questList, List.class);
		JSONObject obj = qresourceService.checkResultList(id,array);
		return new ResultMessage<JSONObject>(true,obj);
	}
	
	@PostMapping("/checkResultListAna")
	public ResultMessage<JSONObject> checkResultListAna(@RequestParam String id,@RequestParam String questList){
		List<JSONObject> array = JSON.parseObject(questList, List.class);
		JSONObject obj = qresourceService.checkResultListAna(id,array);
		return new ResultMessage<JSONObject>(true,obj);
	}
	
	@PostMapping("/checkLevelResultList")
	public ResultMessage<JSONObject> checkLevelResultList(@RequestParam String levelId,@RequestParam String questList){
		List<JSONObject> array = JSON.parseObject(questList, List.class);
		JSONObject obj = qresourceService.checkLevelResultList(levelId,array);
		return new ResultMessage<JSONObject>(true,obj);
	}
}
