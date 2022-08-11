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
import com.somenew.service.PlatformBaseService;

import cn.com.angke.mgk.dao.PeopleDao;
import cn.com.angke.mgk.service.PeopleService;
import cn.com.angke.mgk.service.PostPeopleService;
import cn.com.angke.mgk.service.PostPeopleService2;

@Controller
@RequestMapping("/PostPeople")
public class PostPeople {
	
	@Resource(name = "postPeopleServiceImpl")
	public PostPeopleService postPeopleService;
	
	@Resource(name = "peopleServiceImpl")
	public PeopleService peopleService;
	
	@Resource(name = "peopleDaoImpl")
	public PeopleDao peopleDao;
	
	@Resource(name="postPeopleServiceImpl2")
	public PostPeopleService2 postPeopleService2;
	
	protected PlatformBaseService getPlatformBaseService(){
		return postPeopleService;
	}
	
	/**
	 * 根据postID查询职员信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/getPeopleListByPostId", method = RequestMethod.POST)
	@ResponseBody
	public void getPeopleListByPostId(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data=request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = postPeopleService.getPeopleListByPostid(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 新增或修改信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12001")
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public void save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr=request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=postPeopleService.save(obj);
		ActionHelp.returnResSucc(request, response,res);
	}
	
	/**
	 * 删除
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12003")
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public void delete(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		postPeopleService.delete(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	
	/**
	 * 查询所有去职、任职性质列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void getSetTypeList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = postPeopleService2.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 查询人物姓和名
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/getNameList", method = RequestMethod.POST)
	@ResponseBody
	public void getNameList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = peopleDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/save2", method = RequestMethod.POST)
	@ResponseBody
	public void save2(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject res=postPeopleService.save2();
		ActionHelp.returnResSucc(request, response,res);
	}
}
