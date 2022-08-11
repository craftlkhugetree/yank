package cn.com.angke.mgk.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
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
import com.somenew.action.PageOpt;
import com.somenew.action.PageOpt2;
import com.somenew.action.PageOptExt;
import com.somenew.controller.PlatformBase2;
import com.somenew.qywx.ReturnUtil;
import com.somenew.utils.ExportExcel;

import cn.com.angke.books.BookInfo;
import cn.com.angke.mgk.dao.BookDao;
import cn.com.angke.mgk.dao.BookDao2;
import cn.com.angke.mgk.dao.BookMakeIdDao;
import cn.com.angke.mgk.dao.LibraryCollectionDao;
import cn.com.angke.mgk.service.BookCnmarcService;
import cn.com.angke.mgk.service.BookService;
import cn.com.angke.utils.SafeUtil;

//图书接口管理
@Controller
@RequestMapping("/Book")
public class Book extends PlatformBase2 {
	static Log logger = LogFactory.getLog(Book.class);

	@Resource(name = "bookDaoImpl")
	private BookDao bookDao;

	@Resource(name = "bookDaoImpl2")
	private BookDao2 bookDao2;

	@Resource(name = "bookMakeIdDaoImpl")
	private BookMakeIdDao bookMakeIdDao;

	@Resource(name = "bookServiceImpl")
	private BookService bookService;

	@Resource(name = "libraryCollectionDaoImpl")
	private LibraryCollectionDao libraryCollectionDao;
	
	@Resource(name = "bookCnmarcServiceImpl")
	private BookCnmarcService bookCnmarcService;

	/**
	 * 保存图书
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveBook", method = RequestMethod.POST)
	@ResponseBody
	public void saveBook(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		JSONObject r = bookService.saveBook(j.getString("dir"), j.getString("BATID"));
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 获取图书列表
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getBook", method = RequestMethod.POST)
	@ResponseBody
	public void getBook(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		po.setIsOrderby(true);
		String sort = request.getParameter("sort");
		String dir = request.getParameter("dir");
		if(StringUtils.isNotBlank(sort)&&StringUtils.isNotBlank(dir)){
			if(sort.equals("PAGECOUNT") || sort.equals("HEIGHT") ){
				po.setOrderby(" CAST(a."+sort+" AS SIGNED) " + dir +" ");
			}else if(sort.equals("JHX") || sort.equals("ZTCC") || sort.equals("BLTITLE") || sort.equals("SUMMARY") || sort.equals("COVERTITLE") ){
				po.setOrderby(" CONVERT(cn."+sort+" USING gbk) "+dir+" ");
			}else if(sort.equals("AUTHOR") || sort.equals("ADDRESS") || sort.equals("PUBLISHINGNAME") || sort.equals("ZTNAME") || sort.equals("EDUNAME")){
				po.setOrderby(" CONVERT("+sort+" USING gbk) "+dir+" ");
			}else{
				po.setOrderby(" CONVERT(a."+sort+" USING gbk) "+dir+" ");
			}
		}else{
			//按图书id排序
			po.setOrderby("BOOKID");
		}
		JSONObject r = bookDao2.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 获取图书列表
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getBookCnmarc", method = RequestMethod.POST)
	@ResponseBody
	public void getBookCnmarc(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		PageOpt po = PageOptExt.produceFromData(JSONObject.parseObject(data));
		String sort = request.getParameter("sort");
		String dir = request.getParameter("dir");
		if(StringUtils.isNotBlank(sort)&&StringUtils.isNotBlank(dir)){
			po.setIsOrderby(true);
			if(sort.equals("HEIGHT")||sort.equals("PAGECOUNT")){
				po.setOrderby(" CAST("+sort+" AS SIGNED)" + dir +" ");
			}else{
				po.setOrderby(" CONVERT("+sort+" USING gbk) "+dir+" ");
			}
		}
		JSONObject r = bookCnmarcService.list(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 保存/修改单本图书
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveBookCnmarc", method = RequestMethod.POST)
	@ResponseBody
	public void saveBookCnmarc(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = SafeUtil.HTMLEncode(request.getParameter("data"));
		JSONObject bookCnmc = JSONObject.parseObject(data);
		JSONObject r = bookCnmarcService.saveBookCnmarc(bookCnmc);
		ActionHelp.returnRes(request, response, r);
	}	
	
	/**
	 * 删除图书
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delBookCnmarc", method = RequestMethod.POST)
	@ResponseBody
	public void delBookCnmarc(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String IDs = request.getParameter("IDs");
		JSONArray idArr = JSONArray.parseArray(IDs);
		JSONObject r = bookCnmarcService.delBookCnmarc(idArr);
		ActionHelp.returnRes(request, response, r);
	}	
	
	/**
	 * 获取图书馆藏列表
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getLibraryCollection", method = RequestMethod.POST)
	@ResponseBody
	public void getLibraryCollection(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		PageOpt po = PageOptExt.produceFromData(j);
		JSONObject r = libraryCollectionDao.list2(po);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 获取图书信息
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getBookInfo", method = RequestMethod.POST)
	@ResponseBody
	public void getBookInfo(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		BookInfo book = new BookInfo();
		// if(!book.isExist(j.getString("dir"))){
		// throw new BusException("路径不存在！");
		// }
		JSONObject r = book.getInfo(j.getString("dir"), j.getString("BATID"));
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 删除图书
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delBook", method = RequestMethod.POST)
	@ResponseBody
	public void delBook(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");
		JSONArray IDs = JSONArray.parseArray(IDstr);
		bookService.delBook(IDs);
		JSONObject r = new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/updateBook", method = RequestMethod.POST)
	@ResponseBody
	public void updateBook(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		bookService.updateBook(param);
		JSONObject r = new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	

	/**
	 * 保存批次号
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/saveMakeID", method = RequestMethod.POST)
	@ResponseBody
	public void saveMakeID(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		JSONObject r = bookService.saveMakeID(j);
		//r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 获取批次号
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getMakeID", method = RequestMethod.POST)
	@ResponseBody
	public void getMakeID(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject j = JSONObject.parseObject(data);
		JSONObject r = bookMakeIdDao.list(PageOptExt.produceFromData(j));
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 删除批次号
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delMakeID", method = RequestMethod.POST)
	@ResponseBody
	public void delMakeID(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String IDstr = param.getString("ID");
		JSONArray IDs = JSONArray.parseArray(IDstr);
		bookService.delMakeID(IDs);
		JSONObject r = new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/ImportExcel", method = RequestMethod.POST)
	@ResponseBody
	public void ImportExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String ID = param.getString("FILEID");
		JSONObject obj = bookService.importExcelNewFormat(ID);
		JSONObject r = new JSONObject();
		r.put("success", true);
		r.put("message", obj);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/ImportExcel1", method = RequestMethod.POST)
	@ResponseBody
	public void ImportExcel1(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		JSONObject param = JSONObject.parseObject(data);
		String ID = param.getString("FILEID");
		bookService.importExcel(ID);
		JSONObject r = new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/ImportExcel2", method = RequestMethod.POST)
	@ResponseBody
	public void ImportExcel2(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		bookService.importExcel2(data);
		JSONObject r = new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}
	
	@RequestMapping(value = "/zttype", method = RequestMethod.POST)
	@ResponseBody
	public void getZTType(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONArray d=bookService.ZTtree();
//		JSONObject r = new JSONObject();
//		r.put("data", d);
//		r.put("success", true);
		ActionHelp.returnRes(request, response, d);
	}

	@RequestMapping(value = "/edutype", method = RequestMethod.POST)
	@ResponseBody
	public void getEduType(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONArray d=bookService.Edutree();
//		JSONObject r = new JSONObject();
//		r.put("data", d);
//		r.put("success", true);
		ActionHelp.returnRes(request, response, d);
	}
	
	
	@RequestMapping(value = "/Test", method = RequestMethod.POST)
	@ResponseBody
	public void Test(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONArray d=bookService.Test();
		JSONObject r = new JSONObject();
		r.put("data", d);
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	/**
	 * 导出CNMARC
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/ExportCNMARC", method = RequestMethod.GET)
	@ResponseBody
	public void ExportCNMARC(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PageOpt2 po = new PageOpt2();
		BookInfo info = new BookInfo();
		JSONArray book = bookDao.list(po).getJSONArray("items");
		List<String[]> list = new ArrayList<>();
		String[] cnmarc = { "对应CNMARC字段", "200$a", "200$f", "701$a", "200$f", "205$a", "210$a", "210$d", "210$h",
				"215$a", "215$c", "215$d", "215$e", "225$a", "225$v", "600$a", "606$a", "606$x", "606$y", "606$z",
				"091$a", "091$b", "091$d", "327$a", "303$a", "518$a", "300$a", "399$a", "690$a", "686$a", "852$h",
				"686$2", "852$2", "905$d", "852$j", "920$a", "852$a", "998$a", "801$b" };
		list.add(cnmarc);
		for (int i = 0; i < book.size(); i++) {
			String[] j = info.getCNMarc(book.getJSONObject(i).getString("BOOKDIR"));
			if (j != null) {
				list.add(j);
			}
		}
		String[] title = { "编目著录项目:", "题名", "责任者(繁体字)", "责任者(简体字)", "责任者(国图)", "版本", "出版地", "出版社", "出版发行时间", "页码或卷册",
				"图,地图,肖像", "高度x宽度", "附件", "丛书名", "丛书卷册号", "名称主题：个人、团体、家族", "论题主题", "论题复分", "地理复分", "年代复分",
				"统一书刊号091(ISBN号010)", "装帧形式", "价格", "内容附注", "字符集外的疑难字符附注", "现代标准书写题名", "附注说明项", "备注：自定义附注", "中图法分类号",
				"其他分类号(CALIS)", "其他分类号或排架体系的来源(国图)", "分类号或排架体系的来源(CALIS)", "分类号或排架体系的来源(国图)", "收藏机构馆藏信息(CALIS)",
				"收藏机构馆藏信息(国图)", "收藏机构信息(CALIS)", "收藏机构信息(国图)", "书目记录提供机构信息(CALIS)", "书目记录提供机构信息(国图)" };
		ExportExcel.exportExcel("cnmarc.xls", title, list, request, response);
	}
	
	@RequestMapping(value = "/updateJson", method = RequestMethod.POST)
	@ResponseBody
	public void updateJson(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String type = request.getParameter("type"); // one  batch all
		String dir = request.getParameter("dir");// one的时候传具体filePath，batch时传批次号
		bookService.updateJson(type, dir);
		JSONObject r = new JSONObject();
		r.put("success", true);
		ActionHelp.returnRes(request, response, r);
	}

	@RequestMapping(value = "/updateOneBook", method = RequestMethod.POST)
	@ResponseBody
	public void updateOneBook(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String bookId = request.getParameter("bookId");
		JSONObject res = bookService.updateOneBook(bookId);
		ActionHelp.returnRes(request, response, res);
	}
	
}
