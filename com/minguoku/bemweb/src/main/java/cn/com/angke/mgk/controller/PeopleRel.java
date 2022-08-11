package cn.com.angke.mgk.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
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

import cn.com.angke.mgk.dao.PeopleDtoDao3;
import cn.com.angke.mgk.dao.PeopleRelDao;
import cn.com.angke.mgk.service.PeopleRelService;

@Controller
@RequestMapping("/PeopleRel")
public class PeopleRel extends PlatformBase {
	
	@Resource(name = "peopleRelDaoImpl")
	public PeopleRelDao peopleRelDao;
	
	@Resource(name = "peopleRelServiceImpl")
	public PeopleRelService peopleRelService;
	
	@Resource(name = "peopleDtoDaoImpl3")
	public PeopleDtoDao3 peopleDtoDao3;
	
	
	/**
	 * 人物姓名下拉列表
	 */
	@RequestMapping(value = "/lists",method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request,HttpServletResponse response){
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject obj = peopleDtoDao3.list(po);
		obj.put("success", true);
		ActionHelp.returnRes(request, response, obj);
	}
	
	/**
	 * 根据PEOPLE1ID查询人物关系列表
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getList",method = RequestMethod.POST)
	@ResponseBody
	public void getList(HttpServletRequest request,HttpServletResponse response){
		String data = request.getParameter("data");
		JSONObject j=JSONObject.parseObject(data);
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject obj=new JSONObject();
		obj.put("success", true);
		JSONObject d=JSONObject.parseObject(j.getString("filter"));
		if(StringUtils.isBlank(d.getString("PEOPLE1ID"))){
		
		}else{
			 obj = peopleRelDao.getList(po);
		}
		ActionHelp.returnRes(request, response, obj);
	}

	/**
	 * 根据人物性别查询人物关系
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getPeopleRelLists",method = RequestMethod.POST)
	@ResponseBody
	public void getPeopleRelLists(HttpServletRequest request,HttpServletResponse response){
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject obj = peopleRelDao.getList(po);
		obj.put("success", true);
		ActionHelp.returnRes(request, response, obj);
	}
	
	/**
	 * 根据PEOPLE1ID删除人物关系
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteRes", method = RequestMethod.POST)
	@ResponseBody
	public void deleteRes(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		peopleRelService.deletePeopleRel(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	
}
