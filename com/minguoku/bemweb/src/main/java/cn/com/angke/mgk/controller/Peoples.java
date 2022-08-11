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

import cn.com.angke.mgk.dao.GeographyDao2;
import cn.com.angke.mgk.dao.PeopleDao;
import cn.com.angke.mgk.service.PeopleServices;
import cn.com.angke.utils.SafeUtil;

@Controller
@RequestMapping("/Peoples")
public class Peoples extends PlatformBase {

	@Resource(name = "peopleServicesImpl")
	public PeopleServices peopleServices;
	
	@Resource(name="peopleDaoImpl")
	public PeopleDao peopleDao;
	
	
	@Resource(name = "geographyDaoImpl2")
	public GeographyDao2 geographyDao2;
	
	
	/**
	 * 获取籍贯下拉列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getJgList", method = RequestMethod.POST)
	@ResponseBody
	public void getGeographyList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		//String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = geographyDao2.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	

	/**
	 * 级联保存与更新
	 */
	@RequestMapping(value = "/saveRes", method = RequestMethod.POST)
	@ResponseBody
	public void saveRes(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = SafeUtil.HTMLEncode(request.getParameter("data"));
		String arr = SafeUtil.HTMLEncode(request.getParameter("arr"));
		String array = SafeUtil.HTMLEncode(request.getParameter("array"));	
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONArray jsa = JSONArray.parseArray(arr);
		JSONArray arry = JSONArray.parseArray(array);
		peopleServices.saveRes(obj,jsa,arry);
		ActionHelp.returnResSucc(request, response);
	}

	/**
	 * 获取人物列表
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getPeopleList", method = RequestMethod.POST)
	@ResponseBody
	public void getPeopleList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		//po.setIsOrderby(true);
		JSONObject r = peopleServices.getPeopleList(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 级联删除
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
		peopleServices.deleteRes(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public void save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		peopleServices.saveRes();
		JSONObject r=new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	
}
