package cn.com.angke.mgk.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOptExt;
import com.somenew.controller.PlatformBase;

import cn.com.angke.mgk.service.LibraryService;
import cn.com.angke.utils.SafeUtil;

//图书馆管理
@Controller
@RequestMapping("/Library")
public class Library extends PlatformBase{
	
	@Resource(name = "libraryServiceImpl")
	private LibraryService libraryService;

	
	
	
	/**
	 * 图书馆查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data =request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = libraryService.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 保存图书馆信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public void save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=libraryService.save(obj);
		ActionHelp.returnResSucc(request, response,res);
	}
	
	
	/**
	 * 删除
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public void delete(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		libraryService.delete(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	
	
	@RequestMapping(value = "/view", method = RequestMethod.POST)
	@ResponseBody
	public void view(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		PageOpt p = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = getPlatformBaseService().view(p);
		ActionHelp.returnResSucc(request, response, r);
	}

}
