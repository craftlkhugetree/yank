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
import com.somenew.controller.PlatformBase;
import com.somenew.ids.client.LoginUser;

import cn.com.angke.mgk.dao.CtmIpDao;
import cn.com.angke.mgk.dao.CustomerDao;
import cn.com.angke.mgk.dao.DownRecordDao;
import cn.com.angke.mgk.dao.OrderDao;
import cn.com.angke.mgk.dao.PayDao;
import cn.com.angke.mgk.service.CustomerService;
import cn.com.angke.utils.SafeUtil;
import cn.com.angke.utils.cache.ConsumerBooksCache;

//客户管理
@Controller
@RequestMapping("/Customer")
public class Customer extends PlatformBase{
	static Log logger = LogFactory.getLog(Customer.class);
	
	@Resource(name = "customerServiceImpl")
	private CustomerService customerService;
	
	@Resource(name = "customerDaoImpl")
	protected CustomerDao customerDao;
	
	@Resource(name = "ctmIpDaoImpl")
	private CtmIpDao ctmIpDao;
	
	@Resource(name = "downRecordDaoImpl")
	private DownRecordDao downRecordDao;
	
	@Resource(name = "orderDaoImpl")
	private OrderDao orderDao;
	
	@Resource(name = "payDaoImpl")
	private PayDao payDao;

	// 更新数据
	private void updateCache (String cid) {
		ConsumerBooksCache.forceUpdate(cid);
	}
	
	/**
	 * 客户列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public void list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data =request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		JSONObject user = LoginUser.getUser();
		System.out.print(user);
		JSONObject r = customerDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 保存客户信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@ResponseBody
	public void save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = SafeUtil.HTMLEncode(request.getParameter("data"));
		//JSONObject objuser =  LoginUser.getUser();
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=customerDao.save(obj);
		ActionHelp.returnResSucc(request, response,res);
	}
	
	
	/**
	 * 删除客户
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public void delete(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		customerDao.setDelete(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	

	
	/**
	 * 客户IP地址库列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/IPlist", method = RequestMethod.POST)
	@ResponseBody
	public void IPlist(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data =request.getParameter("data");
		JSONObject j=JSONObject.parseObject(data);
		PageOpt po = PageOptExt.produceFromData(j);
		JSONObject r = ctmIpDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 保存客户IP信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveIP", method = RequestMethod.POST)
	@ResponseBody
	public void saveIP(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		obj.put("BEGINIP",obj.getString("BEGINIP").trim()) ;
		obj.put("ENDIP",obj.getString("ENDIP").trim()) ;
		JSONObject res=customerService.saveIp(obj);
		ActionHelp.returnResSucc(request, response,res);
	}
	
	/**
	 * 删除客户IP信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteIP", method = RequestMethod.POST)
	@ResponseBody
	public void deleteIP(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		ctmIpDao.delete(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	
	/**
	 * 下载记录列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/Downlist", method = RequestMethod.POST)
	@ResponseBody
	public void Downlist(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data =request.getParameter("data");
		JSONObject j=JSONObject.parseObject(data);
		PageOpt po = PageOptExt.produceFromData(j);
		JSONObject r = downRecordDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 保存客户下载记录
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveDown", method = RequestMethod.POST)
	@ResponseBody
	public void saveDown(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=downRecordDao.save(obj);
		ActionHelp.returnResSucc(request, response,res);
	}
	
	/**
	 * 客户订单列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/Ordlist", method = RequestMethod.POST)
	@ResponseBody
	public void Ordlist(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data =request.getParameter("data");
		JSONObject j=JSONObject.parseObject(data);
		PageOpt po = PageOptExt.produceFromData(j);
		JSONObject r = orderDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	
	/**
	 * 保存客户订单信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveOrd", method = RequestMethod.POST)
	@ResponseBody
	public void saveOrd(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=orderDao.save(obj);
		// 更新缓存
		updateCache(obj.getString("CTID"));
		ActionHelp.returnResSucc(request, response,res);
	}
	
	
	/**
	 * 删除客户订单
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteOrd", method = RequestMethod.POST)
	@ResponseBody
	public void deleteOrd(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		String ctid = orderDao.viewById(IDs.getString(0)).getJSONObject("item").getString("CTID");
		orderDao.setDelete(IDs);
		// 更新缓存
		updateCache(ctid);
		ActionHelp.returnResSucc(request, response);
	}
	
	/**
	 * 订单付款列表查询
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/Paylist", method = RequestMethod.POST)
	@ResponseBody
	public void Paylist(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data =request.getParameter("data");
		JSONObject j=JSONObject.parseObject(data);
		PageOpt po = PageOptExt.produceFromData(j);
		JSONObject r = payDao.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	
	/**
	 * 保存客户订单信息
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/savePay", method = RequestMethod.POST)
	@ResponseBody
	public void savePay(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res=payDao.save(obj);
		ActionHelp.returnResSucc(request, response,res);
	}
	
	
	/**
	 * 删除客户订单
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/deletePay", method = RequestMethod.POST)
	@ResponseBody
	public void deletePay(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");	
		JSONArray IDs = JSONArray.parseArray(IDstr);
		payDao.delete(IDs);
		ActionHelp.returnResSucc(request, response);
	}
	
	
}
