package cn.com.angke.mgk.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOptExt;
import com.somenew.service.PlatformBaseService;

import cn.com.angke.mgk.service.OfficeTypeService;

@Controller
@RequestMapping("/OfficeType")
public class OfficeType {
	
	
	@Resource(name = "officeTypeServiceImpl")
	private OfficeTypeService officeTypeService;
	
	
	
	protected PlatformBaseService getPlatformBaseService(){
		return officeTypeService;
	}
	
	
	/**
	 * 任职、去职性质下拉列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/getOfficeTypeList", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = officeTypeService.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	

}
