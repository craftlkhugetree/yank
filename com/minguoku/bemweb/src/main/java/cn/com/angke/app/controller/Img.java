package cn.com.angke.app.controller;

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
import com.somenew.action.PageOpt;
import com.somenew.action.PageOptExt;
import com.somenew.utils.ResponseUtil;

import cn.com.angke.app.service.ImgService;
import cn.com.angke.mgk.service.DataService;

@Controller
@RequestMapping("/Img")
public class Img {
	@Autowired
	private ImgService imgService;
	@Autowired
	private DataService dataService;
	
	/**
	 * 获取实时加工信息 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getWorkInfo", method = RequestMethod.POST)
	@ResponseBody
	public void getWorkInfo(@Param("ID")String ID,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = imgService.getWorkInfo(ID);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}	
	
	/**
	 * 加工之前的检测
	 * (加工中的话不能接着加工)
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/preWork", method = RequestMethod.POST)
	@ResponseBody
	public void preWork(@Param("pici")String pici,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = imgService.preWork(pici);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}	
	
	/**
	 * 加工
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/work", method = RequestMethod.POST)
	@ResponseBody
	public void work(@Param("pici")String pici,@Param("isAll")String isAll,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = imgService.work(pici,isAll);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
	/**
	 * 获取批次加工情况
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/piciList", method = RequestMethod.POST)
	@ResponseBody
	public void piciList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromLayUI(request);
		po.setIsOrderby(true);
		po.setOrderby("NAME ASC");
		JSONObject r = imgService.piciList(po);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
	/**
	 * 获取原始文件列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDir", method = RequestMethod.POST)
	@ResponseBody
	public void getDir(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = imgService.getDir();
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
	/**
	 * 更新WXK_IMG
	 */
	@RequestMapping(value = "/updatePICI", method = RequestMethod.POST)
	@ResponseBody
	public void updateData(@Param("pici")String pici,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = imgService.updatePICI(pici);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}	
	
	/**
	 * 更新WXK_IMG单条数据
	 */
	@RequestMapping(value = "/updatePICIByName", method = RequestMethod.POST)
	@ResponseBody
	public void updatePICIByName(@Param("NAME")String NAME,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = imgService.updatePICIByName(NAME);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}	
	
	/**
	 *	手动生成首页
	 */
	@RequestMapping(value = "/createIndexPage", method = RequestMethod.POST)
	@ResponseBody
	public void createIndexPage(HttpServletRequest request, HttpServletResponse response) throws Exception {
		dataService.genHtml();
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(new JSONObject()));
	}		
	
}
