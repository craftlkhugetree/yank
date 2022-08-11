package cn.com.angke.mgk.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOptExt;
import com.somenew.service.PlatformBaseService;

import cn.com.angke.mgk.service.AccordingService;

@Controller
@RequestMapping("/According")
public class According {
	
	@Resource(name="accordingServiceImpl")
	public AccordingService accordingService;
	
	public PlatformBaseService gePlatformBaseService(){
		return accordingService;
	}
	
	/**
	 *  查询设、废依据列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getList",method = RequestMethod.POST)
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = accordingService.getList(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

}
