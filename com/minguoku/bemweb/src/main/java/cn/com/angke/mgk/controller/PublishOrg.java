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

import cn.com.angke.mgk.dao.PublicDao;
import cn.com.angke.mgk.service.PublicService;
import cn.com.angke.mgk.service.PublishOrgService;
import cn.com.angke.utils.SafeUtil;

@Controller
@RequestMapping("/PublishOrg")
public class PublishOrg extends PlatformBase {

	@Resource(name = "publishOrgServiceImpl")
	public PublishOrgService publishOrgService;

	@Resource(name = "publicDaoImpl")
	public PublicDao publicDao;

	@Resource(name = "publicServiceImpl")
	public PublicService publicService;

	/**
	 * 获取出版社列表
	 * 
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getOrgList", method = RequestMethod.POST)
	@ResponseBody
	public void getOrgList(HttpServletRequest request, HttpServletResponse response) {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject obj = publicDao.getOrgList(po);
		ActionHelp.returnRes(request, response, obj);
	}

	/**
	 * 新增或修改出版社
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public void save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res = publicDao.save(obj);
		ActionHelp.returnResSucc(request, response, res);
	}

	/**
	 * 级联删除（先删除出版社所有地址，再删除出版社）
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	// @AuthCheck(funcID = "12003")
	@RequestMapping(value = "/deleteOrg", method = RequestMethod.POST)
	@ResponseBody
	public void deletePublic(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");
		JSONArray IDs = JSONArray.parseArray(IDstr);
		publishOrgService.deleteOrg(IDs);
		ActionHelp.returnResSucc(request, response);
	}

	/**
	 * 获取出版社及出版社地址列表
	 * 
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getPublishOrgList", method = RequestMethod.POST)
	@ResponseBody
	public void getPublishOrgList(HttpServletRequest request, HttpServletResponse response) {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject obj = publishOrgService.getList(po);
		ActionHelp.returnRes(request, response, obj);
	}

	/**
	 * 新增或修改出版社及出版社地址等信息
	 */
	@RequestMapping(value = "/saveRes", method = RequestMethod.POST)
	@ResponseBody
	public void saveRes(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject obj = JSONObject.parseObject(objStr);
		publishOrgService.saveRes(obj);
		ActionHelp.returnResSucc(request, response);
	}

	/**
	 * 删除
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	// @AuthCheck(funcID = "12003")
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public void delete(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");
		JSONArray IDs = JSONArray.parseArray(IDstr);
		publishOrgService.delete(IDs);
		ActionHelp.returnResSucc(request, response);
	}

}
