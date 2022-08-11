package cn.com.angke.mgk.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.controller.PlatformBase;
import com.somenew.exception.BusException;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.mgk.service.CommonService;

//公共接口管理
@Controller
@RequestMapping("/Common")
public class Common extends PlatformBase{
	static Log logger = LogFactory.getLog(Common.class);
	
	@Resource(name = "commonServiceImpl")
	private CommonService commonService;

	
	/**
	 * 年代/朝代列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCode", method = RequestMethod.POST)
	@ResponseBody
	public void getCode(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data=request.getParameter("filter");
		JSONObject j=JSONObject.parseObject(data);
		String code=j.getString("CODE");
		JSONObject r = commonService.getCodeList(code);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 纪年列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getYear", method = RequestMethod.POST)
	@ResponseBody
	public void getYear(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data=request.getParameter("filter");
		JSONObject j=JSONObject.parseObject(data);
		String pid=j.getString("PID");
		String year=j.getString("YEAR");
		JSONObject r = commonService.getYearList(pid,year);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/getZTTYPE", method = RequestMethod.POST)
	@ResponseBody
	public void getZTTYPE(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String lvl=request.getParameter("LVL");
		String type=request.getParameter("TYPE");
		JSONObject r = commonService.getZTTYPE(lvl,type);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/Test", method = RequestMethod.POST)
	@ResponseBody
	public void Test(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String LVL=request.getParameter("LVL");
		JSONObject r = commonService.Test(LVL);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 天干地支年
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getTGDZ", method = RequestMethod.POST)
	@ResponseBody
	public void getTGDZ(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data=request.getParameter("data");
		JSONObject j=JSONObject.parseObject(data);
		String YEAR=j.getString("YEAR");
		if(StringUtils.isBlank(YEAR)){
			throw new BusException("年份不能为空");
		}
		JSONObject r = commonService.getTGDZ(YEAR);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	@RequestMapping(value = "/converter", method = RequestMethod.POST)
	@ResponseBody
	public void converter(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data=request.getParameter("KEYWORD");
		JSONObject r=new JSONObject();
		ZHConverter c=ZHConverter.getInstance(ZHConverter.TRADITIONAL);
		r.put("data", c.convert(data));
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
}
