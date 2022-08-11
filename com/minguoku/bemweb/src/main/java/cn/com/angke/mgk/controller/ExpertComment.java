package cn.com.angke.mgk.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOptExt;
import com.somenew.controller.PlatformBase2;

import cn.com.angke.mgk.dao.ExpertCommentDao;
import cn.com.angke.utils.SafeUtil;

//专家评论接口管理
@Controller
@RequestMapping("/ExpertComment")
public class ExpertComment extends PlatformBase2 {
	static Log logger = LogFactory.getLog(ExpertComment.class);

	@Resource(name = "expertCommentDaoImpl")
	private ExpertCommentDao expertCommentDao;


	/**
	 * 保存评论
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveCommnet", method = RequestMethod.POST)
	@ResponseBody
	public void saveCommnet(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject j = JSONObject.parseObject(data);
		JSONObject r = expertCommentDao.save(j);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 获取评论
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCommnet", method = RequestMethod.POST)
	@ResponseBody
	public void getCommnet(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject r = expertCommentDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}


	/**
	 * 删除评论
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delComment", method = RequestMethod.POST)
	@ResponseBody
	public void delComment(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");
		JSONArray IDs = JSONArray.parseArray(IDstr);
		expertCommentDao.delete(IDs);;
		JSONObject r = new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}


}
