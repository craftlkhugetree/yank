package cn.com.angke.mgk.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOptExt;
import com.somenew.service.PlatformBaseService;

import cn.com.angke.mgk.service.PublicService;

@Controller
@RequestMapping("/Public")
public class Public {
	
	@Resource(name = "publicServiceImpl")
	public PublicService publicService;
	
	public PlatformBaseService getPlatformBaseService(){
		return publicService;
	}
	
	/**
	 * 出版社机构名称下拉列表
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt po = PageOptExt.produceFromRequest(request);
		JSONObject r = publicService.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

}
