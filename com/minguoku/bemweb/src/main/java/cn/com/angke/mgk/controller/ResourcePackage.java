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

import cn.com.angke.mgk.dao.ResourcePackageDao;
import cn.com.angke.mgk.service.ResourcePackageService;
import cn.com.angke.utils.SafeUtil;

//资源库管理
@Controller
@RequestMapping("/ResourcePackage")
public class ResourcePackage extends PlatformBase{
	
	@Resource(name = "resourcePackageServiceImpl")
	private ResourcePackageService resourcePackageService;
	
	@Resource(name = "resourcePackageDaoImpl")
	private ResourcePackageDao resourcePackageDao;
	/**
	 * 资源库列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data =request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = resourcePackageDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 中图法分类树查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/ztTree", method = RequestMethod.POST)
	@ResponseBody
	public void ztTree(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data=request.getParameter("data");
		JSONArray r = resourcePackageService.ZTtree(JSONObject.parseObject(data).getString("RESOURCEPACKAGEID"));
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 保存资源库信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public void save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject obj = JSONObject.parseObject(objStr);
		resourcePackageService.saveResource(obj);
		ActionHelp.returnResSucc(request, response);
	}
	
	/**
	 * 删除资源库信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delRES", method = RequestMethod.POST)
	@ResponseBody
	public void delRES(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		resourcePackageService.delResource(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	

}
