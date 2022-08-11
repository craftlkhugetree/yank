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

import cn.com.angke.mgk.service.RelationService;

@Controller
@RequestMapping("/Relation")
public class Relation {

	@Resource(name = "relationServiceImpl")
	public RelationService relationService;
	
	/**
	 * 对应关系下拉框
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getRelationList", method = RequestMethod.POST)
	@ResponseBody
	public void getRelationList(HttpServletRequest request,HttpServletResponse response){
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data)); 
		JSONObject obj = relationService.getRelationList(po);
		ActionHelp.returnRes(request, response, obj);
	}
	
}
