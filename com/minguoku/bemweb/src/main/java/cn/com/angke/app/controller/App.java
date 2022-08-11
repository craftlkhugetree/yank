package cn.com.angke.app.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.utils.ResponseUtil;

import cn.com.angke.app.service.AppService;

@Controller
@RequestMapping("/App")
public class App {
	@Autowired
	private AppService appService;
	
	/**
	 * 传入批次号，获取图书完整性
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getFull", method = RequestMethod.POST)
	@ResponseBody
	public void getFull(@Param("data")String data,@Param("dir")String dir,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONArray arr = JSONObject.parseArray(data);
		JSONObject r = appService.getFull(dir,arr);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
	/**
	 * 获取某目录下的所有文件夹名称
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDir", method = RequestMethod.POST)
	@ResponseBody
	public void getDir(@Param("dir")String dir,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = appService.getDir(dir);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
}
