package cn.com.angke.mgk.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOptExt;
import com.somenew.db.DbOpt;
import com.somenew.utils.ResponseUtil;

import cn.com.angke.mgk.service.CfgService;
import cn.com.angke.utils.SafeUtil;

@Controller
@RequestMapping("/Cfg")
public class Cfg {
	
	@Autowired
	private CfgService cfgService;
	
	private static final String cfgGroupId = "520";
	
	/**
	 * 页面参数配置列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void list(@Param("data")String data,@Param("sort")String sort,@Param("dir")String dir,HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		if(StringUtils.isNotBlank(sort)&&StringUtils.isNotBlank(dir)){
			po.setIsOrderby(true);
			po.setOrderby("convert("+sort+" using gbk) " +dir);
		}
		po.setCondition("CFGGROUPID", cfgGroupId);
		JSONObject r = cfgService.list(po);
		JSONArray items = r.getJSONArray("items");
		for(int i=0;i<items.size();i++){
			items.getJSONObject(i).put("CFGVALUE", JSONObject.parse(items.getJSONObject(i).getString("CFGVALUE")));
		}
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	
	/**
	 * 保存参数配置
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public void save(@Param("data")String data,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject obj = JSONObject.parseObject(SafeUtil.HTMLEncode(data));
		obj.put("CFGGROUPID", cfgGroupId);
		JSONObject r = cfgService.save(obj);
		ActionHelp.returnRes(request, response, r.toJSONString());
	}

	/**
	 * 参数详情
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/view", method = RequestMethod.POST)
	@ResponseBody
	public void view(@Param("ID")String ID,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = cfgService.viewById(ID);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}

	/**
	 * 参数详情
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/viewByCode", method = RequestMethod.POST)
	@ResponseBody
	public void viewByCode(@Param("CODE")String CODE,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = cfgService.viewByCode(CODE);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 删除
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public void delete(@Param("IDs")String IDs,HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONArray IDsArr = JSONArray.parseArray(IDs);
		cfgService.delete(IDsArr);
		ActionHelp.returnRes(request, response, ResponseUtil.convertSucMsg());
	}
	
	@RequestMapping(value = "/getSql", method = RequestMethod.GET)
	public void getSql(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String sql = "select ID from AU_RES"; 
		List<JSONObject> list = DbOpt.getInstance().query(sql, new Object[] {}, new int[] {});
		for(int i=0; i< list.size(); i++) {
			String resId = list.get(i).getString("ID");
			System.out.println("insert into AU_ROLERES(ID,ROLEID,RESID) values ('1-"+resId+"','1','"+resId+"');");
		}
		
	}
}
