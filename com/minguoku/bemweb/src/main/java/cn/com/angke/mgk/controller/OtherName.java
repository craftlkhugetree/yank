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

import cn.com.angke.mgk.dao.OtherNameDao;
import cn.com.angke.mgk.service.OtherNameService;

@Controller
@RequestMapping("/OtherName")
public class OtherName extends PlatformBase {

	@Resource(name = "otherNameDaoImpl")
	public OtherNameDao otherNameDao;
	
	@Resource(name = "otherNameServiceImpl")
	public OtherNameService otherNameService;

	/**
	 * 根据人物ID保存人物笔名别名字号信息
	 */
	@RequestMapping(value = "/saveRes", method = RequestMethod.POST)
	@ResponseBody
	public void saveRes(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONArray obj = JSONArray.parseArray(objStr);
		otherNameDao.saveRes(obj);
		ActionHelp.returnResSucc(request, response);
	}

	/**
	 * 笔名、别名、字、号等下拉列表
	 * 
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getList" , method = RequestMethod.POST)
	@ResponseBody
	public void getList(HttpServletRequest request, HttpServletResponse response) {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject obj = otherNameDao.getList(po);
		obj.put("success", true);
		ActionHelp.returnRes(request, response, obj);
	}

	/**
	 * 获取笔名别名字号列表
	 */
	@RequestMapping(value = "/list" , method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) {
		String data = request.getParameter("data");
		JSONObject j=JSONObject.parseObject(data);
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject obj=new JSONObject();
		obj.put("success", true);
		JSONObject d=JSONObject.parseObject(j.getString("filter"));
		if(StringUtils.isBlank(d.getString("PEOPLEID"))){
		
		}else{
			 obj = otherNameDao.getList(po);
		}
		ActionHelp.returnRes(request, response, obj);
		
	}
	
	/**
	 * 根据PEOPLEID删除笔名别名字号
	 */
	@RequestMapping(value = "/deleteOtherName", method = RequestMethod.POST)
	@ResponseBody
	public void deleteOtherName(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		otherNameService.deleteOtherName(IDs);
		ActionHelp.returnResSucc(request, response);
	}
}
