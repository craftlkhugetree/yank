package cn.com.angke.book.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
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

import cn.com.angke.book.service.ProvinceLocationService;

@Controller
@RequestMapping("/ProvinceLocation")
public class ProvinceLocation {
	
	@Autowired
	private ProvinceLocationService provinceLocationService;
	
	/**
	 * 列表
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
		JSONObject r = provinceLocationService.list(po);
		ActionHelp.returnRes(request, response, ResponseUtil.addSucMsg(r));
	}
	

	
}
