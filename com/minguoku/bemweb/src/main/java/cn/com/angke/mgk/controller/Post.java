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

import cn.com.angke.mgk.service.PostService;
import cn.com.angke.mgk.service.PostService2;
import cn.com.angke.utils.SafeUtil;

@Controller
@RequestMapping("/Post")
public class Post {
	
	@Resource(name = "postServiceImpl2")
	private PostService2 postService2;
	
	@Resource(name = "postServiceImpl")
	private PostService postService;
	
	protected PlatformBaseService getPlatformBaseService(){
		return postService;
	}
	
	/**
	 * 原职位下拉列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = postService2.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 根据机构ID查询职位列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getPostListByOrgId", method = RequestMethod.POST)
	@ResponseBody
	public void getPostListByOrgId(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = postService.getPostListByOrgId(po);
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
		String objStr=SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=postService.save(obj);
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
		getPlatformBaseService().delete(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	
	@RequestMapping(value = "/save2", method = RequestMethod.POST)
	@ResponseBody
	public void save2(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr=request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=postService.save2();
		ActionHelp.returnResSucc(request, response,res);
	}
	
}
