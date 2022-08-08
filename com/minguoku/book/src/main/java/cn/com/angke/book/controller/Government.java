package cn.com.angke.book.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.utils.ResponseUtil;

import cn.com.angke.book.service.GovernmentService;

@Controller
@RequestMapping("/Government")
public class Government {
	
	@Autowired
	private GovernmentService governmentService;
	
	/**
	 * 树
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/tree", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = governmentService.tree();
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
	/**
	 * 详情
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/view", method = RequestMethod.POST)
	@ResponseBody
	public void view(@Param("ID")String ID,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = governmentService.view(ID);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
}
