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
import com.somenew.service.PlatformBaseService;

import cn.com.angke.mgk.dao.OrgsDao2;
import cn.com.angke.mgk.service.OrgDtoService;
import cn.com.angke.mgk.service.OrgsService;
import cn.com.angke.utils.SafeUtil;

//职官库机构接口
@Controller
@RequestMapping("/Org")
public class Org {
	
	@Resource(name = "orgsServiceImpl")
	public OrgsService orgService;
	
	@Resource(name = "orgsDaoImpl2")
	public OrgsDao2 orgsDao2;

	@Resource(name = "orgDtoServiceImpl")
	public OrgDtoService orgDtoService;
	
	public PlatformBaseService getPlatformBaseService(){
		return orgService;
	}
	
	
	/**
	 * 树形列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONArray r = orgService.getList(po);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/getList", method = RequestMethod.POST)
	@ResponseBody
	public void getlist(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = orgService.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 查询机构下拉列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/getOrgList", method = RequestMethod.POST)
	@ResponseBody
	public void getList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = orgsDao2.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 根据父ID查询
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getListByParentId" , method=RequestMethod.POST)
	@ResponseBody
	public void getListByParentId(HttpServletRequest request, HttpServletResponse response){
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = orgService.getListByParentId(po);
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
//		String objStr = request.getParameter("items:[{'NAME':'南大体育馆','SETDATE':'2017-04-07','TYPE':'公有'}],items[{'PARENTID':'12','ENDDATE':'2017-07-07','SOURCEORGID':'3'}],'SETACCORDING':'招标','ENDACCORDING':'中标','ID':'3'");
		String objStr=SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=orgService.save(obj);
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
	
	
//	@AuthCheck(funcID = "12000")
	@RequestMapping(value = "/view", method = RequestMethod.POST)
	@ResponseBody
	public void view(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		PageOpt p = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = orgService.view(p);
		ActionHelp.returnResSucc(request, response, r);
	}

	
	/**
	 * 根据PARENTID获取机构Grid
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getGrid" , method=RequestMethod.POST)
	@ResponseBody
	public void getCodeList(HttpServletRequest request, HttpServletResponse response){	
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		JSONObject js = JSONObject.parseObject(j.getString("filter"));
		JSONObject r = new JSONObject();
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		r.put("success", true);
		JSONArray  array=  JSONArray.parseArray(orgDtoService.getGridById(po).get("items").toString());
		int account = orgDtoService.getCount(po);//利用ID值作为PARENTID值查询该机构是否为上级机构（查看作为PARENTID记录数，小于1表示不作为父机构）
		for (Object object : array) {
			String str = JSONObject.parseObject(object.toString()).getString("PARENTID");//根据机构ID查看该机构的PARENTID值
//			if(str!=null){
//				r = orgDtoService.getGridById(po);//查看子机构的单条记录信息
//			}else{
				if(account<1){
					r = orgDtoService.getGridById(po);//当该机构不为上级机构时，根据该机构ID查看该机构的信息
				}else{
					r = orgDtoService.getGrid(po);//根据父机构ID值作为PARENTID查询该机构下的所有子机构信息
				}
//			}
			ActionHelp.returnRes(request, response, r);
		}
	}

	@RequestMapping(value = "/save2", method = RequestMethod.POST)
	@ResponseBody
	public void save2(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject res=orgService.save2();
		ActionHelp.returnResSucc(request, response,res);
	}
	
}
