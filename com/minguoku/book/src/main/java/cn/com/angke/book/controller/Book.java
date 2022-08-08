package cn.com.angke.book.controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.cache.DataCacheOpt;
import com.somenew.config.service.Config;
import com.somenew.config.service.ConfigOpt;
import com.somenew.controller.PlatformBase;
import com.somenew.exception.BusException;
import com.somenew.ids.client.AuthFilterComm;
import com.somenew.ids.client.LoginUser;
import com.somenew.service.ServiceFactory;
import com.somenew.utils.NetOpt;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.book.service.BookService;
import cn.com.angke.util.FileUtil;
import cn.com.angke.util.IPUtil;

//图书接口管理
@Controller
@RequestMapping("/Book")
public class Book extends PlatformBase {
	static Log logger = LogFactory.getLog(Book.class);

	@Resource(name = "bookServiceImpl")
	private BookService bookService;

	/**
	 * 查询图书
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchBook", method = RequestMethod.POST)
	@ResponseBody
	public void searchBook(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONArray keyword = j.getJSONArray("KEYWORD");
		Integer start = j.getInteger("start");
		Integer limit = j.getInteger("limit");
		JSONObject r = bookService.searchBook(keyword, start, limit, ip);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 根据分类查询图书
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchBookByType", method = RequestMethod.POST)
	@ResponseBody
	public void searchBookByType(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		String bookids = j.getString("BOOKIDS");
		if (StringUtils.isBlank(bookids)) {
			throw new BusException("该分类没有图书！");
		}
		Integer start = j.getInteger("start");
		Integer limit = j.getInteger("limit");
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONObject r = bookService.searchBookByType(bookids, start, limit, ip);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 图书内关键词检索
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchBookByID", method = RequestMethod.POST)
	@ResponseBody
	public void searchBookByID(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		String bookid = j.getString("BOOKID");
		String keyword = j.getString("KEYWORD");
		JSONObject r = bookService.searchBookByID(bookid, keyword);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 高级搜索查询图书
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/advancedSearch", method = RequestMethod.POST)
	@ResponseBody
	public void advancedSearch(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONObject r = bookService.advancedSearch(j, ip);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 高级检索 数据库实现
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/advancedSearchDb", method = RequestMethod.POST)
	@ResponseBody
	public void advancedSearchDb(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONObject r = bookService.advancedSearchDb(j, ip);
		ActionHelp.returnRes(request, response, r);
	}
	//
	// @RequestMapping(value = "/getSy", method = RequestMethod.POST)
	// @ResponseBody
	// public void getSy(HttpServletRequest request, HttpServletResponse
	// response) throws Exception {
	// JSONObject r = bookService.getSy();
	// ActionHelp.returnRes(request, response, r);
	// }

	// 判断用户对此类型的书是否可阅读
	@RequestMapping(value = "/isRead", method = RequestMethod.POST)
	@ResponseBody
	public void isRead(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONObject data = JSONObject.parseObject(request.getParameter("data"));
		String ZTSYMBOL = data.getString("ZTTYPE");
		String dir = data.getString("dir");
		JSONObject r = bookService.readBook(ip, dir, ZTSYMBOL);
		ActionHelp.returnRes(request, response, r);
	}
	
	// 检查是否有文本
	@RequestMapping(value = "/checkHasText", method = RequestMethod.POST)
	@ResponseBody
	public void checkHasText(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = bookService.checkHasText();
		ActionHelp.returnRes(request, response, r);
	}
	
	// 获取是否有文本
	@RequestMapping(value = "/getHasText", method = RequestMethod.POST)
	@ResponseBody
	public void getHasText(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String str = DataCacheOpt.get("checkHasText");
		ActionHelp.returnRes(request, response, str);
	}

	// 图书内关键词检索
	@RequestMapping(value = "/inBookSearch", method = RequestMethod.POST)
	@ResponseBody
	public void inBookSearch(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject data = JSONObject.parseObject(request.getParameter("data"));
		String KEYWORD = data.getString("KEYWORD");
		String BOOKID = data.getString("BOOKID");
		String DIR = data.getString("dir");
		JSONObject r = bookService.inBookSearch(BOOKID, KEYWORD, DIR);
		ActionHelp.returnRes(request, response, r);
	}

	// 分类浏览
	@RequestMapping(value = "/categorySearch", method = RequestMethod.POST)
	@ResponseBody
	public void categorySearch(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = bookService.categorySearch();
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 保存客户下载记录
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveDownRecord", method = RequestMethod.POST)
	@ResponseBody
	public void saveDownRecord(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res = bookService.saveDownRecord(ip, obj);
		ActionHelp.returnResSucc(request, response, res);
	}
	
	/**
	 * 保存客户引用记录
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveQuoteRecord", method = RequestMethod.POST)
	@ResponseBody
	public void saveQuoteRecord(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res = bookService.saveQuoteRecord(ip, obj);
		ActionHelp.returnResSucc(request, response, res);
	}

	/**
	 * 文献引用
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/quote", method = RequestMethod.POST)
	@ResponseBody
	public void quote(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		JSONObject res = bookService.citation(obj);
		ActionHelp.returnResSucc(request, response, res);
	}

	/**
	 * 文献引用(2019/08/23)下载对应的txt文件
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getQuote", method = RequestMethod.GET)
	@ResponseBody
	public void getQuote(HttpServletRequest request, HttpServletResponse response) throws Exception {
		System.out.println("init");
		String id = request.getParameter("id");
		String type = request.getParameter("type");
		String url = request.getParameter("url");
		String fileName = bookService.createQuote(id,type,url);
		System.out.println(fileName);
		FileUtil.getFile(request, response, fileName);
		FileUtil.delFile(fileName);
	}
	
	/**
	 * 每页关键词
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/pageEntry", method = RequestMethod.POST)
	@ResponseBody
	public void pageEntry(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		String bookid = obj.getString("BOOKID");
		Integer page = obj.getInteger("PAGENUM");

		if (StringUtils.isBlank(bookid) || page == null) {
			throw new BusException("参数不能为空！");
		}
		JSONObject res = bookService.pageEntry(bookid, page, obj.getString("TYPE"));
		ActionHelp.returnResSucc(request, response, res);
	}

	@RequestMapping(value = "/getEntry", method = RequestMethod.POST)
	@ResponseBody
	public void getEntry(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String objStr = request.getParameter("data");
		JSONObject obj = JSONObject.parseObject(objStr);
		String name = obj.getString("NAME");
		String type = obj.getString("TYPE");
		String code = obj.getString("CODE");
		if (code != null && code.equals("1")) {
			ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
			name = converter.convert(name);
		}
		if (StringUtils.isBlank(name) || StringUtils.isBlank(type)) {
			throw new BusException("参数不能为空！");
		}
		JSONObject res = bookService.getEntry(name, type);
		ActionHelp.returnResSucc(request, response, res);
	}

	/**
	 * 中图法分类树查询
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/ztTree", method = RequestMethod.POST)
	@ResponseBody
	public void ztTree(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONArray r = bookService.ZTtree();
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 根据ip获取客户
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCustomer", method = RequestMethod.POST)
	@ResponseBody
	public void getCustomer(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		JSONObject res = bookService.getCustomerForIp(ip);
		res.put("ip", ip);
		
		ActionHelp.returnRes(request, response, res);
	}
	/**
	 * 根据ip
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCustomerIP", method = RequestMethod.POST)
	@ResponseBody
	public void getCustomerIP(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// 获取当前登陆人的IP
		String ip = IPUtil.getIpAddress(request);
		String ip0 = IPUtil.getIpAddressReal(request);
		JSONObject res=new JSONObject();
		res.put("ip", ip);
		res.put("ip0",ip0);
		res.put("request",request.toString());
		res.put("X-forwarded-for",request.getHeader("X-forwarded-for"));
		ActionHelp.returnRes(request, response, res);
	}
	
	/**
	 * 繁体转换
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/converter", method = RequestMethod.POST)
	@ResponseBody
	public void converter(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data=request.getParameter("KEYWORD");
		JSONObject r=new JSONObject();
		ZHConverter c=ZHConverter.getInstance(ZHConverter.TRADITIONAL);
		r.put("data", c.convert(data));
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping("/down")
	public void down(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String imgSrc = request.getParameter("IMGSRC");
		//System.out.println("down:" + imgSrc);
		ActionHelp.setReponseFileName(request, response, imgSrc);
		ServletOutputStream toClient;
		try {
			toClient = response.getOutputStream();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}// 获取输出流
		String filePath = ConfigOpt.getConfigValue("WATERURL") + imgSrc;
		this.getFileContent(filePath, toClient);
	}
	
	private void getFileContent(String filePath, OutputStream outstream) throws IOException {
		FileInputStream fins = null;
		try {
			fins = new FileInputStream(filePath);
			byte[] buff = new byte[1024];// 缓冲区
			int b;
			while ((b=fins.read(buff))!=-1) {// 设置循环语句读取
				outstream.write(buff,0,b);
				outstream.flush();
			}
		} catch (Throwable e) {
			throw new RuntimeException(e);
		} finally {
			if (fins != null) {
				fins.close();
			}
			if (outstream != null) {
				outstream.close();
			}
		}

	}

}
