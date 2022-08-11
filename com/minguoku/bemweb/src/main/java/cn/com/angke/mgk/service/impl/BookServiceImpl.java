package cn.com.angke.mgk.service.impl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.DocumentException;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOpt2;
import com.somenew.config.service.Config;
import com.somenew.config.service.ConfigOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.SqlParas;
import com.somenew.exception.BusException;
import com.somenew.ids.client.SSOUtils;
import com.somenew.service.PlatformBaseServiceImpl2;
import com.somenew.service.ServiceFactory;
import com.somenew.service.ServiceOpt;
import com.somenew.utils.DateOpt;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.books.BookInfo;
import cn.com.angke.books.BookWrite;
import cn.com.angke.mgk.dao.Book2Dao;
import cn.com.angke.mgk.dao.BookCnmarcDao;
import cn.com.angke.mgk.dao.BookCreatorDao;
import cn.com.angke.mgk.dao.BookDao;
import cn.com.angke.mgk.dao.BookDao2;
import cn.com.angke.mgk.dao.BookEduDao;
import cn.com.angke.mgk.dao.BookMakeIdDao;
import cn.com.angke.mgk.dao.BookTagDao;
import cn.com.angke.mgk.dao.BookZtDao;
import cn.com.angke.mgk.dao.CtmIpDao;
import cn.com.angke.mgk.dao.EduTypeDao;
import cn.com.angke.mgk.dao.KeyCountDao;
import cn.com.angke.mgk.dao.LibraryCollectionDao;
import cn.com.angke.mgk.dao.LibraryDao;
import cn.com.angke.mgk.dao.OrderDao;
import cn.com.angke.mgk.dao.OtherNameDao;
import cn.com.angke.mgk.dao.PeopleDao;
import cn.com.angke.mgk.dao.PeopleRelDao;
import cn.com.angke.mgk.dao.PublicDao;
import cn.com.angke.mgk.dao.PublishOrgDao;
import cn.com.angke.mgk.dao.ResourcePackageDao;
import cn.com.angke.mgk.dao.ZrRelDao;
import cn.com.angke.mgk.dao.ZtTypeDao;
import cn.com.angke.mgk.service.BookService;
import cn.com.angke.utils.Book;
import cn.com.angke.utils.Book2;
import cn.com.angke.utils.BookCode;
import cn.com.angke.utils.BookInfo2;
import cn.com.angke.utils.BookNew;
import cn.com.angke.utils.CreateFileUtil;
import cn.com.angke.utils.cache.ConsumerBooksCache;
import cn.com.angke.utils.excel.ExcelHelper;
import cn.com.angke.utils.excel.HssfExcelHelper;
import cn.com.angke.utils.excel.XssfExcelHelper;

@Service
public class BookServiceImpl extends PlatformBaseServiceImpl2 implements BookService {

	@Resource(name = "publicDaoImpl")
	private PublicDao publicDao;

	@Resource(name = "peopleDaoImpl")
	private PeopleDao peopleDao;

	@Resource(name = "peopleRelDaoImpl")
	private PeopleRelDao peopleRelDao;

	@Resource(name = "otherNameDaoImpl")
	private OtherNameDao otherNameDao;

	@Resource(name = "bookDaoImpl")
	private BookDao bookDao;

	@Resource(name = "bookDaoImpl2")
	private BookDao2 bookDao2;

	@Resource(name = "bookMakeIdDaoImpl")
	private BookMakeIdDao bookMakeIdDao;

	@Resource(name = "publishOrgDaoImpl")
	private PublishOrgDao publishOrgDao;

	@Resource(name = "ztTypeDaoImpl")
	private ZtTypeDao ztTypeDao;

	@Resource(name = "zrRelDaoImpl")
	private ZrRelDao zrRelDao;

	@Resource(name = "eduTypeDaoImpl")
	private EduTypeDao eduTypeDao;

	@Resource(name = "bookZtDaoImpl")
	private BookZtDao bookZtDao;

	@Resource(name = "bookEduDaoImpl")
	private BookEduDao bookEduDao;

	@Resource(name = "bookTagDaoImpl")
	private BookTagDao bookTagDao;

	@Resource(name = "bookCreatorDaoImpl")
	private BookCreatorDao bookCreatorDao;

	@Resource(name = "libraryDaoImpl")
	private LibraryDao libraryDao;

	@Resource(name = "keyCountDaoImpl")
	private KeyCountDao keyCountDao;

	@Resource(name = "ctmIpDaoImpl")
	private CtmIpDao ctmIpDao;

	@Resource(name = "orderDaoImpl")
	private OrderDao orderDao;

	@Resource(name = "resourcePackageDaoImpl")
	private ResourcePackageDao resourcePackageDao;

	@Resource(name = "libraryCollectionDaoImpl")
	private LibraryCollectionDao libraryCollectionDao;

	@Resource(name = "bookCnmarcDaoImpl")
	private BookCnmarcDao bookCnmarcDao;

	@Resource(name = "book2DaoImpl")
	private Book2Dao book2Dao;
	
	/**
	 * 保存图书
	 * 
	 * @throws IOException
	 * @throws DocumentException
	 */
	public JSONObject saveBook(String dir, String BATID) throws IOException, DocumentException {
		JSONObject books = new JSONObject();
		BookInfo info = new BookInfo();
		if (!info.isExist(dir)) {
			//throw new BusException("路径不存在！");
			return this.getErrMsg("路径不存在！", "路径不存在！", 1, books);
		}
		// 解析文件，读取图书信息
		JSONObject book = info.getInfo(dir, BATID);
		// 判断图书是否解析过,解析过直接返回
		PageOpt2 bp = new PageOpt2();
		bp.setCondition("BOOKID", book.getString("BOOKID"), "=", "and");
		JSONObject flow = bookDao.list(bp);
		JSONArray bookID = flow.getJSONArray("items");
		if (bookID.size() > 0) {
			return bookID.getJSONObject(0);
		}
		// 判断图书出版社信息是否存在，存在查询主键保存，不存在新增
		if (StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("KEYWORD", book.getString("PUBLISHINGID"));
			JSONObject publish = publicDao.list(po);
			JSONArray js = publish.getJSONArray("items");
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				book.put("PUBLISHINGID", s.get("ID"));
			} else {
				JSONObject pub = new JSONObject();
				pub.put("NAME", book.getString("PUBLISHINGID"));
				publicDao.save(pub);
				book.put("PUBLISHINGID", pub.get("ID"));
			}
		}
		// 判断图书出版地是否存在，存在查询主键保存，不存在新增
		if (StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("PUBLISHINGID", book.getString("PUBLISHINGID"));
			po.setCondition("KEYWORD", book.getString("PAID"));
			JSONObject publish = publishOrgDao.list(po);
			JSONArray js = publish.getJSONArray("items");
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				book.put("PAID", s.get("ID"));
			} else {
				JSONObject add = new JSONObject();
				add.put("ADDRESS", book.getString("PAID"));
				add.put("PUBLISHINGID", book.getString("PUBLISHINGID"));
				publishOrgDao.save(add);
				book.put("PAID", add.get("ID"));
			}
		}
		// 保存图书信息
		book.put("CREATETIME", DateOpt.datetimeToStr(new Date()));
		books = bookDao.save(book);
		//创建图书索引
		BookWrite bookWrite = BookWrite.instance();
		bookWrite.create(dir);
		bookWrite.create2(dir);
		// 创建图书json文件
		JSONObject jsonBook = info.getDescribe(dir);
		JSONArray toc = info.getToc(dir);
		jsonBook.put("CALEGORY", toc);
		JSONObject zttype = info.getCLC(dir);
		jsonBook.put("ZTNAME", getZtName(zttype.getString("ZTTYPEID")));
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String BOOKURL = vconfig.getConfigValue("BOOKURL");
		CreateFileUtil.createJsonFile(BOOKURL, jsonBook, dir, jsonBook.getString("ID"));
		// 图书的中图法分类信息
		if (StringUtils.isNotBlank(zttype.getString("ZTTYPEID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("ZTTYPE", zttype.getString("ZTTYPEID"));
			JSONObject zt = ztTypeDao.list(po);
			JSONArray js = zt.getJSONArray("items");
			JSONObject bzt = new JSONObject();
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				bzt.put("ZTTYPEID", s.get("ID"));
				bzt.put("BOOKID", books.get("ID"));
				bookZtDao.save(bzt);
				// 保存中图法数量
				saveZttype(s.getString("ID"), books.getString("BOOKID"));
			}
		}
		// 图书的学科分类信息
		JSONObject edutype = info.getSubject(dir);
		if (StringUtils.isNotBlank(edutype.getString("EDUTYPEID"))) {
			PageOpt2 po = new PageOpt2();
			po.setCondition("EDUCODE", edutype.getString("EDUTYPEID"), "=", "and");
			JSONObject edu = eduTypeDao.list(po);
			JSONArray js = edu.getJSONArray("items");
			JSONObject bzt = new JSONObject();
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				bzt.put("EDUTYPEID", s.get("ID"));
				bzt.put("BOOKID", books.get("ID"));
				bookZtDao.save(bzt);
			}
		}
		// 图书负责人信息
		JSONArray bookcreator = info.getCreator(dir);
		if (bookcreator.size() > 0 && bookcreator != null) {
			JSONObject s = null;
			for (int i = 0; i < bookcreator.size(); i++) {
				s = bookcreator.getJSONObject(i);
				s.put("BOOKID", books.get("ID"));
				bookCreatorDao.save(s);
			}
		}
		// 图书馆藏信息
		JSONArray bookCol = info.getCollection(dir);
		if (bookCol.size() > 0 && bookCol != null) {
			JSONObject s = null;
			for (int i = 0; i < bookCol.size(); i++) {
				s = bookCol.getJSONObject(i);
				PageOpt po = new PageOpt();
				po.setCondition("KEYWORD", s.getString("LIBRARYID"));
				JSONObject lb = libraryDao.list(po);
				JSONArray jlb = lb.getJSONArray("items");
				JSONObject library = new JSONObject();
				if (jlb.size() > 0) {
					JSONObject li = (JSONObject) jlb.get(0);
					library.put("LIBRARYID", li.get("ID"));
					library.put("OPAC", li.get("OPAC"));
					library.put("BOOKID", books.get("ID"));
					libraryCollectionDao.save(library);
				} else {
					JSONObject newlb = new JSONObject();
					newlb.put("NAME", s.getString("LIBRARYID"));
					libraryDao.save(newlb);
					library.put("LIBRARYID", newlb.get("ID"));
					library.put("BOOKID", books.get("ID"));
					libraryCollectionDao.save(library);
				}
			}
		}
		// 图书的标签
		JSONArray booktag = info.getTag(dir);
		if (booktag.size() > 0 && booktag != null) {
			for (int i = 0; i < booktag.size(); i++) {
				JSONObject s = new JSONObject();
				s.put("BOOKID", books.get("ID"));
				s.put("NAME", booktag.getJSONObject(i).get("NAME"));
				bookTagDao.save(s);
			}
		}
		// 生成简体html文件
		// 获取路径
		String path = vconfig.getConfigValue("BOOKURL");
		String str = "/epub/EPUB/";
		String str2 = "/epub/EPUBS/";
		File file = new File(path.concat(dir).concat(str));
		File[] fileList = file.listFiles();
		for (int j = 0; j < fileList.length; j++) {
			String fileType = fileList[j].getName().substring(fileList[j].getName().lastIndexOf('.') + 1,
					fileList[j].getName().length());
			if ("html".equals(fileType)) {
				createsimplified(fileList[j].getPath(), path.concat(dir).concat(str2).concat(fileList[j].getName()));
			}
		}
		// 将img赋值到EPUBS
		String oldimg = path.concat(dir).concat(str).concat("img");
		String newimg = path.concat(dir).concat(str2).concat("img");
		copy(oldimg, newimg);
		books.put("success", true);
		return books;
	}
	
	/**
	 * @throws Exception 
	 * @throws DocumentException 
	 * @Title: updateBook  
	 * @Author:LiangJixiang
	 * @Description: TODO(这里用一句话描述这个方法的作用)   
	 * @Time:2018年11月27日
	 * @param: @param book
	 * @param: @return
	 * @param: @throws IOException      
	 * @return: JSONObject      
	 * @throws
	 */
	public JSONObject updateBook(JSONObject book) throws Exception {

		JSONObject bookcn = bookDao2.viewById(book.getString("ID"));
		String bookid = bookcn.getJSONObject("item").getString("BOOKID");
		String bookname = this.getCode(bookcn);
		System.out.println(bookcn.toJSONString());
		System.out.println(bookid);
		//删除原图书信息
		JSONArray ids = new JSONArray();
		ids.add(book.getString("ID"));
		this.delBook(ids);
		Config config = ServiceFactory.getInstance().getConfig();
		String filepath = config.getConfigValue("BOOKURL");
				
		filepath = filepath+book.getString("BOOKDIR");
		if (IsXml(filepath)) {
			BookInfo bookInfo = new BookInfo();
			bookInfo.updateXml(book);
			this.saveBook(book.getString("BOOKDIR"), book.getString("BATID"));
		}
		else {
			JSONObject bookCnmark = new JSONObject();
			bookCnmark.put("BOOKID", bookid);
			bookCnmark.put("TEXTNOTE", book.getString("TEXTNOTE"));
			bookCnmark.put("ZTTYPEID", book.getString("ZTTYPEID"));
			bookCnmark.put("EDUTYPEID", book.getString("EDUTYPEID"));

			bookCnmark.put("PAID", book.getString("ADDRESS"));
			bookCnmark.put("DATE", book.getString("DATE"));
//			bookCnmark.put("CONTENTNOTE", book.getString("TAGS"));
			bookCnmark.put("SERIES", book.getString("SERIES"));
			bookCnmark.put("ZAUTHOR1", book.getString("AUTHOR"));
			bookCnmark.put("PUBLISHINGID", book.getString("PUBLISHINGNAME"));
			
			//一般性附注，主题词串，并列正题名，稽核项，摘要，封面题名
			String[] str = new String[]{"CONTENTNOTE","ZTCC","BLTITLE","JHX","SUMMARY","COVERTITLE"};
			this.convertCnmarkJson(str, book, bookCnmark);
			
			DbOpt.getInstance().updateByFields(null, "WXK_BOOK_CNMARC",
					bookCnmark, new String[] { "BOOKID" }, null);				
//			this.saveBook2(filepath.concat("/dockbook"), book.getString("BOOKDIR"), book.getString("BATID"));
//			this.saveBook2(bookid, book.getString("BOOKDIR"), book.getString("BATID"));
			this.saveBook2(bookname, book.getString("BOOKDIR"), book.getString("BATID"));
		}
		return book;
	}
	
	public void convertCnmarkJson(String[] column,JSONObject originObj,JSONObject toObj){
		for(int i=0;i<column.length;i++){
			if(StringUtils.isNotBlank(originObj.getString(column[i]))){
				toObj.put(column[i], originObj.getString(column[i]));
			}
		}
	}
	
	public String getCode(JSONObject json) {
		String bookinfo = json.getJSONObject("item").getString("BOOKDIR");
		String[] bookname = bookinfo.split("/");
		return bookname[1];
	}

	/**
	 * 删除图书
	 */
	@Override
	public void delBook(JSONArray IDs) throws IOException {
		BookWrite bookWrite = BookWrite.instance();
		if (IDs != null && IDs.size() > 0) {
			for (int i = 0; i < IDs.size(); i++) {
				// 删除图书馆藏信息
				PageOpt2 lc = new PageOpt2();
				lc.setCondition("BOOKID", IDs.getString(i), "=", "and");
				JSONArray arr = libraryCollectionDao.list(lc).getJSONArray("items");
				JSONArray OLDID = new JSONArray();
				if (arr != null && arr.size() > 0) {
					for (int j = 0; j < arr.size(); j++) {
						JSONObject old = arr.getJSONObject(j);
						OLDID.add(old.getString("ID"));
					}
					libraryCollectionDao.delete(OLDID);
				}
				// 删除图书标签
				PageOpt2 ta = new PageOpt2();
				ta.setCondition("BOOKID", IDs.getString(i), "=", "and");
				JSONArray tagarr = bookTagDao.list(ta).getJSONArray("items");
				JSONArray OLDTagID = new JSONArray();
				if (tagarr != null && tagarr.size() > 0) {
					for (int j = 0; j < tagarr.size(); j++) {
						JSONObject old = tagarr.getJSONObject(j);
						OLDTagID.add(old.getString("ID"));
					}
					bookTagDao.delete(OLDTagID);
				}
				// 删除图书学科分类信息
				PageOpt2 edu = new PageOpt2();
				edu.setCondition("BOOKID", IDs.getString(i), "=", "and");
				JSONArray eduarr = bookEduDao.list(edu).getJSONArray("items");
				JSONArray OLDEduID = new JSONArray();
				if (eduarr != null && eduarr.size() > 0) {
					for (int j = 0; j < eduarr.size(); j++) {
						JSONObject old = eduarr.getJSONObject(j);
						OLDEduID.add(old.getString("ID"));
					}
					bookEduDao.delete(OLDEduID);
				}
				// 删除图书中图法分类信息
				PageOpt2 zt = new PageOpt2();
				zt.setCondition("BOOKID", IDs.getString(i), "=", "and");
				JSONArray ztarr = bookZtDao.list(zt).getJSONArray("items");
				JSONArray OLDZtID = new JSONArray();
				if (ztarr != null && ztarr.size() > 0) {
					for (int j = 0; j < ztarr.size(); j++) {
						JSONObject old = ztarr.getJSONObject(j);
						OLDZtID.add(old.getString("ID"));
						JSONObject wheredata = new JSONObject();
						wheredata.put("ID", IDs.getString(i));
						List<JSONObject> book = DbOpt.getInstance().getObjByData(null, "WXK_BOOK", wheredata,
								new String[] { "ID" }, new String[] { "ID", "BOOKID" });
						// JSONObject book =
						// DbOpt.getInstance().getObjByID(null, "WXK_BOOK",
						// IDs.getString(i), new String[] { "ID" });
						delZttype(old.getString("ZTTYPEID"), book.get(0).getString("BOOKID"));
					}
					bookZtDao.delete(OLDZtID);

				}
				// 删除负责人信息
				PageOpt2 cre = new PageOpt2();
				cre.setCondition("BOOKID", IDs.getString(i), "=", "and");
				JSONArray crearr = bookCreatorDao.list(cre).getJSONArray("items");
				JSONArray OLDCreID = new JSONArray();
				if (crearr != null && crearr.size() > 0) {
					for (int j = 0; j < crearr.size(); j++) {
						JSONObject old = crearr.getJSONObject(j);
						OLDCreID.add(old.getString("ID"));
					}
					bookCreatorDao.delete(OLDCreID);
				}
				// 删除图书索引
				PageOpt2 po = new PageOpt2();
				po.setCondition("ID", IDs.getString(i), "=", "and");
				JSONArray barr = bookDao.list(po).getJSONArray("items");
				if (barr != null && barr.size() > 0) {
					for (int j = 0; j < barr.size(); j++) {
						JSONObject book = barr.getJSONObject(j);
						bookWrite.remove(book.getString("BOOKID"));
					}
				}
			}
		}
		// 删除图书
		bookDao.delete(IDs);

	}

	// 删除批次号，同时删除批次号下的图书
	@Override
	public void delMakeID(JSONArray IDs) throws IOException {
		String ids = IDs.toJSONString();
		StringBuffer in = new StringBuffer();
		in.append("(");
		for(int i=0;i<IDs.size();i++) {
			in.append("'"+IDs.getString(i)+"',");
		}
		in.delete(in.length()-1, in.length()).append(")");
		String sql = "select ID from WXK_BOOK where BATID in"+in;
		List<JSONObject> data = this.getJdbcTemplate().query(sql.toString(), null, null, readRows);
		JSONArray OLDBOOKID = new JSONArray();
		for (int i = 0; i < data.size(); i++) {
			OLDBOOKID.add(data.get(i).getString("ID"));
		}
		// 删除批次号下的图书
		delBook(OLDBOOKID);
		bookMakeIdDao.delete(IDs);
	}
	
	public static int SUCCESSNUM = 0;//成功的数量
	public static JSONArray ERRORARR = new JSONArray();//错误信息的数组
	public static JSONArray DUPLICATEARR = new JSONArray();//重复信息的数组
	
	// 保存批次号，直接保存图书，建立索引
	@Override
	public JSONObject saveMakeID(JSONObject data) throws Exception {
		// 批次号不重复
		if (StringUtils.isBlank(data.getString("ID"))) {
			String querySql = "SELECT ID FROM WXK_MAKEID WHERE BATID = '"+data.getString("ID")+"'";
			if (this.getJdbcTemplate().query(querySql, readRows).size() > 0) {
				data.put("success", false);
				data.put("message", "批次号不能重复");
				return data;
			}
		}
		SUCCESSNUM = 0;
		ERRORARR = new JSONArray();
		DUPLICATEARR = new JSONArray();
		JSONObject r = new JSONObject();
		String BATID = data.getString("BATID");
		BookWrite bookWrite = BookWrite.instance();
		File file = bookWrite.getFile(BATID);
		if (file != null) {
			if (StringUtils.isBlank(data.getString("ID"))) {
				data = bookMakeIdDao.save(data);
				SubindexBuilder(file, BATID, data.getString("ID"));
				r.put("1、共处理", SUCCESSNUM+ERRORARR.size()+DUPLICATEARR.size());
				r.put("2、成功条数", SUCCESSNUM);
				r.put("3、错误条数", ERRORARR.size());
				r.put("4、错误信息", ERRORARR);
				r.put("5、重复条数", DUPLICATEARR.size());
				r.put("6、重复信息", DUPLICATEARR);
				System.out.println("导入标准文件结果："+r);
				data.put("message", r);
			} else {
				bookMakeIdDao.save(data);
			}
			
			data.put("success", true);
		} else {
			//throw new BusException("批次号路径不存在！");
			data = this.getErrMsg("批次号路径不存在！", "批次号路径不存在！", 1, data);
		}
		return data;
	}
	
	

	
	
	/**
	 * 递归函数，递归分析目录，如果找到子目录，继续递归；如果找到文件创建索引
	 * 
	 * @param subPath
	 * @throws Exception
	 */
	public void SubindexBuilder(File subPath, String BATID, String ID) throws Exception {
		File[] filelist = subPath.listFiles();
//		System.out.println(subPath.getAbsolutePath() + " :子目录个数 " + filelist.length);
		BookWrite bookWrite = BookWrite.instance();
		for (int i = 0; i < filelist.length; i++) {
			File file = filelist[i];
//			if (file.isDirectory()) {
//				if (file.getName().contains("dockbook") && !IsXml(file.getPath())) {
//					String filepath = BATID.concat("/").concat(file.getParentFile().getName());
//					saveBook2(file.getParentFile().getName(), filepath, ID);
//				}
//				else {
//					SubindexBuilder(file, BATID, ID);
//				}
//			}
//			else {
//				String filepath = file.getPath();
//				System.out.println("===============================================================");
//				System.out.println(filepath);
//				System.out.println("===============================================================");
//				String path = filepath.substring(filepath.indexOf(BATID), filepath.indexOf("docbook"));
//				System.out.println(path);
//				path = path.replace("\\", "/");
//				saveBook(path, ID);
//			}
			
			//dockbook文件夹+下面没有main.xml文件
			//if (file.isDirectory() && file.getName().contains("dockbook") && !IsXml(file.getPath())) {
				if (file.isDirectory() && (file.getName().contains("dockbook")|| file.getName().contains("docbook")) ) {	
				String filepath = BATID.concat("/").concat(file.getParentFile().getName());//例如 C001_01_20180515/G01193初级会计学
				//G01193初级会计学,C001_01_20180515/G01193初级会计学,记录ID
				JSONObject res = saveBook2(file.getParentFile().getName(), filepath, ID);
				if(res.getIntValue("state")==1){
					SUCCESSNUM+=1;
				}else if(res.getIntValue("state")==2){
					ERRORARR.add(res.getJSONObject("info"));
				}else if(res.getIntValue("state")==3){
					DUPLICATEARR.add(res.getJSONObject("info"));
				}
			//普通文件夹
			} else if (file.isDirectory()) {
				SubindexBuilder(file, BATID, ID);
			//是main.xml文件
			} 
//			else if (bookWrite.IsValidType(file.getName())) {
//				String filepath = file.getPath();
//				String path = filepath.substring(filepath.indexOf(BATID), filepath.indexOf("docbook"));
//				System.out.println(path);
//				path = path.replace("\\", "/");
//				saveBook(path, ID);
//			}
		}
		
	}

	public static Boolean IsXml(String filePath) {
		String seqNumber = "main.xml";
		File file = new File(filePath.concat("/").concat(seqNumber));
		System.out.println(file.exists());
		if (!file.exists()) {
			return false;
		} else {
			return true;
		}
	}

	public String getZtName(String code) {
		SqlParas sqlParas = new SqlParas();
		String sql = "select ZTNAME from WXK_ZTTYPE where ZTSYMBOL=?";
		sqlParas.addPara(code, Types.VARCHAR);
		List<JSONObject> data = this.getJdbcTemplate().query(sql, sqlParas.getVs(), sqlParas.getTypes(), readRows);
		String name = "";
		if (data != null && data.size() > 0) {
			name = data.get(0).getString("ZTNAME");
		}
		return name;
	}

	/*
	 * @Override public void savePeople() throws Exception { FileInputStream
	 * in=new FileInputStream(new File("F:/rw.xls")); ZHConverter converter =
	 * ZHConverter.getInstance(ZHConverter.SIMPLIFIED); People people=new
	 * People(); LinkedHashMap<String,String> fieldMap=new LinkedHashMap<>();
	 * fieldMap.put("姓", "LASTNAME"); fieldMap.put("名", "FIRSTNAME");
	 * fieldMap.put("曾用名", "USEDNAME"); fieldMap.put("性别", "SEX");
	 * fieldMap.put("籍贯", "JG"); fieldMap.put("字", "Z"); fieldMap.put("号", "H");
	 * fieldMap.put("別字", "BZ"); fieldMap.put("别名", "BM"); fieldMap.put("別号",
	 * "BH"); fieldMap.put("生年阳历", "BIRTHDAY"); fieldMap.put("生年阴历",
	 * "BIRTHDAY2"); fieldMap.put("生年朝代", "BIRDYNASTY"); fieldMap.put("生年年号",
	 * "BIRREIGN"); fieldMap.put("卒年阳历", "DEADDAY"); fieldMap.put("卒年阴历",
	 * "DEADDAY2"); fieldMap.put("卒年朝代", "DEADDYNASTY"); fieldMap.put("卒年年号",
	 * "DEADREIGN"); fieldMap.put("学历", "EDU"); fieldMap.put("主要著述",
	 * "MAINBOOK"); fieldMap.put("人物关系", "REL"); String[] str=null; List<?>
	 * s=ExcelUtil.excelToList(in, "Sheet1", people.getClass(), fieldMap, str);
	 * JSONObject j=null; for (int i = 0; i < s.size(); i++) { People p=(People)
	 * s.get(i); j=new JSONObject();
	 * j.put("FIRSTNAME",converter.convert(p.getFIRSTNAME()));
	 * j.put("LASTNAME",converter.convert(p.getLASTNAME()));
	 * j.put("BIRDYNASTY",converter.convert(p.getBIRDYNASTY()));
	 * j.put("BIRREIGN",converter.convert(p.getBIRREIGN()));
	 * j.put("BIRTHDAY",p.getBIRTHDAY());
	 * if(StringUtils.isNotBlank(p.getBIRTHDAY())){ String
	 * bs=p.getBIRTHDAY().substring(0, 4);
	 * j.put("BIRTHDAY2",TianDi.getTGDZName(Integer.valueOf(bs))+"年"); }
	 * j.put("DEADDAY",p.getDEADDAY());
	 * if(StringUtils.isNotBlank(p.getDEADDAY())){ String
	 * bs=p.getDEADDAY().substring(0, 4);
	 * j.put("DEADDAY2",TianDi.getTGDZName(Integer.valueOf(bs))+"年"); }
	 * j.put("DEADDYNASTY",converter.convert(p.getDEADDYNASTY()));
	 * j.put("DEADREIGN",converter.convert(p.getDEADREIGN()));
	 * j.put("EDU",converter.convert(p.getEDU()));
	 * j.put("MAINBOOK",converter.convert(p.getMAINBOOK()));
	 * j.put("SEX",p.getSEX()); j.put("JG",converter.convert(p.getJG()));
	 * j.put("USEDNAME",converter.convert(p.getUSEDNAME())); j.put("CREATEDATE",
	 * DateOpt.datetimeToStr(new Date())); peopleDao.save(j);
	 * if(StringUtils.isNotBlank(p.getZ())){ String[] a=p.getZ().split("，");
	 * JSONObject da=null; for (int k = 0; k < a.length; k++) { da=new
	 * JSONObject(); da.put("NTYPE", "字"); da.put("NAME",
	 * converter.convert(a[k])); da.put("PEOPLEID", j.getString("ID"));
	 * otherNameDao.save(da); } } if(StringUtils.isNotBlank(p.getBM())){
	 * String[] a=p.getBM().split("，"); JSONObject da=null; for (int k = 0; k <
	 * a.length; k++) { da=new JSONObject(); da.put("NTYPE", "别名");
	 * da.put("NAME", converter.convert(a[k])); da.put("PEOPLEID",
	 * j.getString("ID")); otherNameDao.save(da); } }
	 * if(StringUtils.isNotBlank(p.getH())){ String[] a=p.getH().split("，");
	 * JSONObject da=null; for (int k = 0; k < a.length; k++) { da=new
	 * JSONObject(); da.put("NTYPE", "号"); da.put("NAME",
	 * converter.convert(a[k])); da.put("PEOPLEID", j.getString("ID"));
	 * otherNameDao.save(da); } } if(StringUtils.isNotBlank(p.getBH())){
	 * String[] a=p.getBH().split("，"); JSONObject da=null; for (int k = 0; k <
	 * a.length; k++) { da=new JSONObject(); da.put("NTYPE", "别号");
	 * da.put("NAME", converter.convert(a[k])); da.put("PEOPLEID",
	 * j.getString("ID")); otherNameDao.save(da); } }
	 * if(StringUtils.isNotBlank(p.getREL())){ String[]
	 * a=p.getREL().split("ss"); JSONObject da=null; for (int k = 0; k <
	 * a.length; k++) { String[] b=a[k].split("："); String[] c=b[1].split("，");
	 * for (int l = 0; l < c.length; l++) { da=new JSONObject();
	 * da.put("RELTYPE", converter.convert(b[0])); da.put("PEOPLE2ID",
	 * converter.convert(c[l])); da.put("PEOPLE1ID", j.getString("ID"));
	 * peopleRelDao.save(da); } } } } }
	 */

	// 生成简体文件
	public void createsimplified(String filePath, String targetPath) throws IOException {
		String content = "";
		String tempString = null;
		FileInputStream fileinputstream = new FileInputStream(filePath);// 读取模板文件
		BufferedReader reader = null;
		InputStreamReader inputFileReader = new InputStreamReader(fileinputstream, "UTF-8");
		reader = new BufferedReader(inputFileReader);
		// 一次读入一行，直到读入null为文件结束
		while ((tempString = reader.readLine()) != null) {
			content += tempString;
		}
		reader.close();
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		// 繁体转换简体
		content = converter.convert(content);
		// 保证创建一个新文件
		File file = new File(targetPath);
		if (!file.getParentFile().exists()) { // 如果父目录不存在，创建父目录
			file.getParentFile().mkdirs();
		}
		if (file.exists()) { // 如果已存在,删除旧文件
			file.delete();
		}
		file.createNewFile();
		FileOutputStream fileoutputstream = new FileOutputStream(targetPath);// 建立文件输出流
		OutputStreamWriter write = new OutputStreamWriter(fileoutputstream, "UTF-8");
		BufferedWriter writer = new BufferedWriter(write);
		writer.write(content);
		writer.close();
	}

	// 复制文件
	public void copy(String path, String copyPath) throws IOException {
		File filePath = new File(path);
		DataInputStream read;
		DataOutputStream write;
		if (filePath.isDirectory()) {
			File[] list = filePath.listFiles();
			for (int i = 0; i < list.length; i++) {
				String newPath = path + File.separator + list[i].getName();
				String newCopyPath = copyPath + File.separator + list[i].getName();
				File newFile = new File(copyPath);
				if (!newFile.exists()) {
					newFile.mkdir();
				}
				copy(newPath, newCopyPath);
			}
		} else if (filePath.isFile()) {
			read = new DataInputStream(new BufferedInputStream(new FileInputStream(path)));
			write = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(copyPath)));
			byte[] buf = new byte[1024 * 512];
			while (read.read(buf) != -1) {
				write.write(buf);
			}
			read.close();
			write.close();
		}
	}

	/**
	 * 保存图书
	 * 
	 * @throws Exception
	 * fileName：G01193初级会计学,
	 * dir：C001_01_20180515/G01193初级会计学,
	 * BATID：记录ID！
	 */
	public JSONObject saveBook2(String fileName, String dir, String BATID) throws Exception {
		JSONObject returnObj = new JSONObject();
		JSONObject books = new JSONObject();
		BookInfo2 info = new BookInfo2();//解析路径  scanpic/m/
		// 截取fileName前六位：如G01193，去WXK_BOOK_CNMARC查找对应CODE的图书信息
		JSONObject bookcc = info.getBook(fileName);
		if (bookcc == null) {
			returnObj.put("state", 2);
			returnObj.put("info", getErrorObj(fileName, "图书信息未入库"));
			return returnObj;
		}
		//处理WXK_BOOK_CNMARC的数据，转为自定义的JSON
		JSONObject book = info.getBookInfo(fileName, BATID);
		System.out.println("当前book："+book.getString("TITLE")+"======="+ book.getString("BOOKID"));
		
		// 判断图书是否解析过,查询WXK_BOOK
		PageOpt2 bp = new PageOpt2();
		bp.setCondition("BOOKID", book.getString("BOOKID"), "=", "and");
		JSONObject flow = bookDao.list(bp);
		JSONArray bookID = flow.getJSONArray("items");
		if (bookID.size() > 0) {
			returnObj.put("state", 3);
			returnObj.put("info", getErrorObj(fileName, "图书已经解析过了"));
			return returnObj;
		}
		// 判断图书出版社信息是否存在，存在查询主键保存，不存在新增
		if (StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("KEYWORD", book.getString("PUBLISHINGID"));
			JSONObject publish = publicDao.list(po);
			JSONArray js = publish.getJSONArray("items");
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				book.put("PUBLISHINGID", s.get("ID"));
			} else {
				JSONObject pub = new JSONObject();
				pub.put("NAME", book.getString("PUBLISHINGID"));
				publicDao.save(pub);
				book.put("PUBLISHINGID", pub.get("ID"));
			}
		}
		// 判断图书出版地是否存在，存在查询主键保存，不存在新增
		if (StringUtils.isNotBlank(book.getString("PAID")) && StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("PUBLISHINGID", book.getString("PUBLISHINGID"));
			po.setCondition("KEYWORD", book.getString("PAID"));
			JSONObject publish = publishOrgDao.list(po);
			JSONArray js = publish.getJSONArray("items");
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				book.put("PAID", s.get("ID"));
			} else {
				JSONObject add = new JSONObject();
				add.put("ADDRESS", book.getString("PAID"));
				add.put("PUBLISHINGID", book.getString("PUBLISHINGID"));
				publishOrgDao.save(add);
				book.put("PAID", add.get("ID"));
			}
		} else {
			book.remove("PAID");
		}
		// 保存图书信息
		File dockfile = new File(ConfigOpt.getConfigValue("BOOKURL")+dir+File.separator+"dockbook");
		book.put("BOOKDIR", dir);
		book.put("CREATETIME", DateOpt.datetimeToStr(new Date()));
		books = bookDao.save(book);
		JSONObject j = info.getDescribe(fileName, dir);
		if (j != null) {
			PageOpt po = new PageOpt();
			po.setCondition("ID", j.getString("ID"));
			JSONArray arr = book2Dao.list(po).getJSONArray("items");
			if (arr.size() < 1 || arr == null) {
				DbOpt.getInstance().insert(null, "WXK_BOOK2", j);
			} else {
				if(!dockfile.exists()){
					j.put("ISTEXT", '1');
				}
			
				book2Dao.save(j);
			}
		}
		//System.out.println("这个是create2"+dir);
		// // 创建图书索引
		BookWrite bookWrite = BookWrite.instance();
		
		if(dockfile.exists()){
			//System.out.println("create"+dir);
			if (bookcc != null) {
				bookWrite.create3(fileName, dir, BATID);
			}
		}else{
			bookWrite.create(dir);
			bookWrite.create2(dir);
			//System.out.println("create2"+dir);
			// 创建图书json文件 2021-05-17删除，感觉无用
//			BookInfo info_dir = new BookInfo();
//			JSONObject jsonBook_dir = info_dir.getDescribe(dir);
//			JSONArray toc_dir = info_dir.getToc(dir);
//			jsonBook_dir.put("CALEGORY", toc_dir);
//			JSONObject zttype = info_dir.getCLC(dir);
//			jsonBook_dir.put("ZTNAME", getZtName(zttype.getString("ZTTYPEID")));
//			Config vconfig = ServiceFactory.getInstance().getConfig();
//			String BOOKURL = vconfig.getConfigValue("BOOKURL");
//			CreateFileUtil.createJsonFile(BOOKURL, jsonBook_dir, dir, jsonBook_dir.getString("ID"));
		}
		// 创建图书json文件
		JSONObject jsonBook = info.getDescribe(fileName, dir);
		if (StringUtils.isNotBlank(book.getString("ZTTYPEID"))) {
			jsonBook.put("ZTNAME", getZtName(book.getString("ZTTYPEID")));
		}
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String BOOKURL = vconfig.getConfigValue("BOOKURL");
		CreateFileUtil.createJsonFile(BOOKURL, jsonBook, dir, jsonBook.getString("ID"));
		// 图书的中图法分类信息
		if (StringUtils.isNotBlank(book.getString("ZTTYPEID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("ZTTYPE", book.getString("ZTTYPEID"));
			JSONObject zt = ztTypeDao.list(po);
			JSONArray js = zt.getJSONArray("items");
			JSONObject bzt = new JSONObject();
			// 先删除
			this.getJdbcTemplate().execute("DELETE FROM WXK_BOOKZTTYPE WHERE BOOKID = '"+books.get("ID")+"'");
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				bzt.put("ZTTYPEID", s.get("ID"));
				bzt.put("BOOKID", books.get("ID"));
				bookZtDao.save(bzt);
				// 保存中图法数量
				saveZttype(s.getString("ID"), books.getString("BOOKID"));
			}
		}
		// 图书的学科分类信息
		if (StringUtils.isNotBlank(book.getString("EDUTYPEID"))) {
			PageOpt2 po = new PageOpt2();
			po.setCondition("EDUCODE", book.getString("EDUTYPEID"), "=", "and");
			JSONObject edu = eduTypeDao.list(po);
			JSONArray js = edu.getJSONArray("items");
			JSONObject bzt = new JSONObject();
			if (js.size() > 0) {
				JSONObject s = js.getJSONObject(0);
				bzt.put("EDUTYPEID", s.getString("ID"));
				bzt.put("BOOKID", books.getString("ID"));
				bookEduDao.save(bzt);
			}
		}
		// 图书负责人信息
		JSONArray bookcreator = info.getCreator(fileName);
		if (bookcreator.size() > 0 && bookcreator != null) {
			JSONObject s = null;
			for (int i = 0; i < bookcreator.size(); i++) {
				s = bookcreator.getJSONObject(i);
				s.put("BOOKID", books.get("ID"));
				bookCreatorDao.save(s);
			}
		}
		books.put("state", 1);
		
		
		
		//2019/11/12
		// 生成简体html文件
		// 获取路径
		String path = vconfig.getConfigValue("BOOKURL");
		String str = "/epub/EPUB/";
		String str2 = "/epub/EPUBS/";
		File file = new File(path.concat(dir).concat(str));
		File[] fileList = file.listFiles();
		for (int h = 0; h < fileList.length; h++) {
			String fileType = fileList[h].getName().substring(fileList[h].getName().lastIndexOf('.') + 1,
					fileList[h].getName().length());
			if ("html".equals(fileType)) {
				createsimplified(fileList[h].getPath(), path.concat(dir).concat(str2).concat(fileList[h].getName()));
			}
		}
		// 将img赋值到EPUBS
		String oldimg = path.concat(dir).concat(str).concat("img");
		String newimg = path.concat(dir).concat(str2).concat("img");
		copy(oldimg, newimg);
		return books;
	}

	public void saveZttype(String ZTTYPEID, String BOOKID) {
		if (StringUtils.isNotBlank(ZTTYPEID)) {
			int length = getWordCount(ZTTYPEID);
			int a = 0;
			if (length % 3 == 0) {
				a = length / 3;
			}
			JSONObject zttype = DbOpt.getInstance().getObjByID(null, "WXK_ZTTYPE2", ZTTYPEID, new String[] { "ID" });
			if (zttype != null) {
				if (a > 0) {
					for (int i = 1; i <= a; i++) {
						String id = ZTTYPEID.substring(0, i * 3);
						String querySql = "SELECT ID, BOOKID FROM WXK_ZTTYPE2 WHERE ID = '"+id+"'";
						List<JSONObject> list = this.getJdbcTemplate().query(querySql, readRows);
						if (list.size() > 0) {
							JSONObject ztTypeObj = list.get(0);
							String bookId = ztTypeObj.getString("BOOKID");
							if (bookId != null && bookId.indexOf(BOOKID) > -1) {
								return;
							}
							// 数量+1
							String sql = "UPDATE WXK_ZTTYPE2 SET COUNT = IFNULL(COUNT,0)+1 WHERE ID = '" + id + "'";
							DbOpt.getInstance().getJdbcTemplate().update(sql.toString());
							// BOOKID+1
							String sql2 = "UPDATE WXK_ZTTYPE2 SET BOOKID= CONCAT('" + BOOKID
									+ "',',',IFNULL(BOOKID,'')) WHERE ID = " + id;
							DbOpt.getInstance().getJdbcTemplate().update(sql2.toString());
						}
					}
				}
			}
		}
	}

	public void delZttype(String ZTTYPEID, String BOOKID) {
		if (StringUtils.isNotBlank(ZTTYPEID)) {
			int length = getWordCount(ZTTYPEID);
			int a = 0;
			if (length % 3 == 0) {
				a = length / 3;
			}
			JSONObject wheredata = new JSONObject();
			wheredata.put("ID", ZTTYPEID);
			List<JSONObject> zttype = DbOpt.getInstance().getObjByData(null, "WXK_ZTTYPE2", wheredata,
					new String[] { "ID" }, new String[] { "ID", "COUNT" });
			if (zttype != null && zttype.size() > 0) {
				if (a > 0 && zttype.get(0).getInteger("COUNT") != null && zttype.get(0).getInteger("COUNT") > 0) {
					for (int i = 1; i <= a; i++) {
						String id = ZTTYPEID.substring(0, i * 3);
						// 数量-1
						String sql = "UPDATE WXK_ZTTYPE2 SET COUNT = IFNULL(COUNT,0)-1 WHERE ID = '" + id + "'";
						DbOpt.getInstance().getJdbcTemplate().update(sql.toString());
						// BOOKID-1
						String sql2 = "UPDATE WXK_ZTTYPE2 SET BOOKID= replace(BOOKID,'" + BOOKID + ",','') WHERE ID = "
								+ id;
						DbOpt.getInstance().getJdbcTemplate().update(sql2.toString());
					}
				}
			}
		}
	}

	public static int getWordCount(String s) {
		int length = 0;
		for (int i = 0; i < s.length(); i++) {
			int ascii = Character.codePointAt(s, i);
			if (ascii >= 0 && ascii <= 255)
				length++;
			else
				length += 2;

		}
		return length;

	}
	
	//2019/08/06根据新的格式修改
	@Override
	public JSONObject importExcelNewFormat(String FileID) throws Exception {
		int insertNum = 0;
		int updateNum = 0;
		JSONArray duplicateArr = new JSONArray();
		JSONArray errorArr = new JSONArray();
		JSONObject fileObj = DbOpt.getInstance().getObjByID(null, "CM_FILE", FileID, null);
		if (fileObj != null) {
			Config vconfig = ServiceFactory.getInstance().getConfig();
			String UPLOADFILEDIR = vconfig.getConfigValue("UPLOADFILEDIR");
			String filepath = UPLOADFILEDIR + fileObj.getString("FURL");
			// String filepath = "C:\\Users\\YiT\\Desktop\\11.xls";
			File file = new File(filepath);
			ExcelHelper eh;
			List<BookNew> list = new ArrayList<BookNew>();
			if (filepath.endsWith(".xlsx")) {
				eh = XssfExcelHelper.getInstance(file);
				list= eh.readExcel(BookNew.class, 0, true);
			} else if (filepath.endsWith(".xls")) {
				eh = HssfExcelHelper.getInstance(file);
				list= eh.readExcel(BookNew.class, 0, true);
			}
			JSONArray oldBookIdArr = bookCnmarcDao.getBookIdArr();
			JSONArray handBookIdArr = new JSONArray();
			//数据库中图法ID的数组
			JSONArray ztTypeArr = ztTypeDao.getZtSymbol();
			for(int i=0;i<list.size();i++){
				JSONObject data = list.get(i).toJson();
				//把BOOKID设置和CODE一样
				data.put("BOOKID", data.getString("CODE"));
				//把ZTTYPEIDPRIME设置和ZTTYPEID一样
				data.put("ZTTYPEIDPRIME", data.getString("ZTTYPEID"));
				System.out.println("剩余条数："+(list.size()-i));
				try{
					String nowBookId = list.get(i).getCODE();
					//判断有没有重复
					if(handBookIdArr.contains(nowBookId)){
						System.out.println("第"+(i+2)+"条重复了");
						JSONObject dplObj = new JSONObject();
						dplObj.put("行数", i+2);
						dplObj.put("正题名", list.get(i).getTITLE());
						dplObj.put("重复行数", this.getDuplicateLine(handBookIdArr, nowBookId));
						duplicateArr.add(dplObj);
					}else{
						String ztTypeId = this.handleZtype(data.getString("ZTTYPEID"), ztTypeArr);
						data.put("ZTTYPEID", ztTypeId);
						if (oldBookIdArr.contains(nowBookId)) {
							bookCnmarcDao.save(data);
							updateNum+=1;
						} else {
							DbOpt.getInstance().insert(null, "WXK_BOOK_CNMARC", data);
							insertNum+=1;
						}
						handBookIdArr.add(nowBookId);
						if(ztTypeId.equals("")){
							JSONObject err = new JSONObject();
							err.put("行数", i+2);
							err.put("正题名", data.getString("TITLE"));
							err.put("错误信息", "中图法分类号："+data.getString("ZTTYPEIDPRIME")+" 经处理后仍不存在,请手动修改");
							errorArr.add(err);				
						}
					}
				}catch(Exception e){
					System.out.println("!!!出错了，第"+(i+2)+"条数据!!!");
					JSONObject err = new JSONObject();
					err.put("行数", i+2);
					err.put("正题名", data.getString("TITLE"));
					errorArr.add(err);				
				}
			}
		} else {
			throw new BusException("找不到该文件", "找不到该文件" + FileID, BusException.TYPE_ERROR, "2");
		}
		JSONObject strObj = new JSONObject();
		strObj.put("1、共处理", insertNum+updateNum+errorArr.size()+duplicateArr.size());
		strObj.put("2、新增条数", insertNum);
		strObj.put("3、更新条数", updateNum);
		strObj.put("4、错误条数", errorArr.size());
		strObj.put("5、错误信息", errorArr);
		strObj.put("6、重复条数", duplicateArr.size());
		strObj.put("7、重复信息", duplicateArr);
		System.out.println("导入excel结果:"+strObj.toJSONString());
		return strObj;
	}
	
	public String handleZtype(String ztTypeId,JSONArray ztTypeArr){
		//处理中图法分类ID，取读取的中图法ID（/隔开的取第一个）
		//和数据库中图法进行比较，没有，往前进一比较
		ztTypeId = ztTypeId.toUpperCase();
		if(ztTypeId.indexOf("/")!=-1){
			ztTypeId = ztTypeId.substring(0, ztTypeId.indexOf("/")-1);
		}
		while(true){
			if(ztTypeArr.contains(ztTypeId)){
				break;
			}else if(ztTypeId.equals("")){
				return "";
			}else{
				ztTypeId = ztTypeId.substring(0, ztTypeId.length()-1);
			}
		}
		return ztTypeId;
	}
	
	public static int getDuplicateLine(JSONArray arr,String bookId){
		int line=-1;
		for(int i=0;i<arr.size();i++){
			if(arr.get(i).equals(bookId)){
				line = i+2;
				break;
			}
		}
		return line;
	}
	
	@Override
	public void importExcel(String FileID) throws Exception {
		JSONObject fileObj = DbOpt.getInstance().getObjByID(null, "CM_FILE", FileID, null);
		// JSONObject fileObj = new JSONObject();
		if (fileObj != null) {
			Config vconfig = ServiceFactory.getInstance().getConfig();
			String UPLOADFILEDIR = vconfig.getConfigValue("UPLOADFILEDIR");
			String filepath = UPLOADFILEDIR + fileObj.getString("FURL");
			// String filepath = "C:\\Users\\YiT\\Desktop\\11.xls";
			File file = new File(filepath);
			if (filepath.endsWith(".xls")) {
				try {
					ExcelHelper eh = HssfExcelHelper.getInstance(file);
					List<Book> Booklist = eh.readExcel(Book.class, 1, true);
					List<BookCode> bookCodelist = eh.readExcel(BookCode.class, 0, true);
					for (BookCode bookCode : bookCodelist) {
						for (Book book : Booklist) {
							JSONObject data = JSONObject.parseObject(book.toString());
							if (book.getBOOKID().equals(bookCode.getBOOKID())) {
								data.put("PAGECOUNT", bookCode.getPAGECOUNT());
								data.put("CODE", bookCode.getCODE());
								PageOpt po = new PageOpt();
								po.setCondition("BOOKID", data.getString("BOOKID"));
								// 查询所有图书
								JSONArray bookCn = bookCnmarcDao.list(po).getJSONArray("items");
								if (bookCn.size() > 0 && bookCn != null) {
									bookCnmarcDao.save(data);
								} else {
									DbOpt.getInstance().insert(null, "WXK_BOOK_CNMARC", data);
								}
							}
						}
					}
				} catch (Exception e) {
					throw new BusException("文件格式错误", "文件格式错误" + FileID, BusException.TYPE_ERROR, "2");
				}
			} else if (filepath.endsWith(".xlsx")) {
				try {
					ExcelHelper eh = XssfExcelHelper.getInstance(file);
					List<Book> Booklist = eh.readExcel(Book.class, 1, true);
					List<BookCode> bookCodelist = eh.readExcel(BookCode.class, 0, true);
					for (BookCode bookCode : bookCodelist) {
						for (Book book : Booklist) {
							JSONObject data = JSONObject.parseObject(book.toString());
							if (book.getBOOKID().equals(bookCode.getBOOKID())) {
								data.put("PAGECOUNT", bookCode.getPAGECOUNT());
								data.put("CODE", bookCode.getCODE());
								PageOpt po = new PageOpt();
								po.setCondition("BOOKID", data.getString("BOOKID"));
								// 查询所有图书
								JSONArray bookCn = bookCnmarcDao.list(po).getJSONArray("items");
								if (bookCn.size() > 0 && bookCn != null) {
									bookCnmarcDao.save(data);
								} else {
									DbOpt.getInstance().insert(null, "WXK_BOOK_CNMARC", data);
								}
							}
						}
					}
				} catch (Exception e) {
					throw new BusException("文件格式错误", "文件格式错误" + FileID, BusException.TYPE_ERROR, "2");
				}
			}
		} else {
			throw new BusException("找不到该文件", "找不到该文件" + FileID, BusException.TYPE_ERROR, "2");
		}
	}

	@Override
	public void importExcel2(String filepath) throws Exception {
		File file = new File(filepath);
		if (filepath.endsWith(".xls")) {
			ExcelHelper eh = HssfExcelHelper.getInstance(file);
			List<Book2> Booklist = eh.readExcel(Book2.class, 0, true);
			for (Book2 book : Booklist) {
				JSONObject bd = JSONObject.parseObject(book.toString());
				if (StringUtils.isNotBlank(bd.getString("BOOKID"))) {
					JSONObject data = new JSONObject();
					data.put("BOOKID", book.getBOOKID());
					data.put("TITLE", book.getTITLE());
					data.put("OTITLE", book.getOTITLE());
					data.put("FTITLE", book.getFTITLE());
					data.put("ZAUTHOR", book.getZAUTHOR());
					data.put("CAUTHOR", book.getCAUTHOR());
					data.put("BB", book.getBB());
					data.put("BBREMARK", book.getBBREMARK());
					data.put("PAID", book.getPAID());
					data.put("PUBLISHINGID", book.getPUBLISHINGID());
					data.put("DATE", book.getDATE());
					data.put("PAGECOUNT", book.getPAGECOUNT());
					data.put("HEIGHT", book.getHEIGHT());
					data.put("SERIES", book.getSERIES());
					data.put("CONTENTNOTE", book.getREMARK());
					data.put("ZTTYPEID", book.getZTTYPEID());
					data.put("EDUTYPEID", book.getEDUTYPEID());
					// data.put("EDUTYPENAME", book.getEDUTYPENAME());
					data.put("FLH", book.getFLH());
					data.put("FLTX", book.getFLTX());
					data.put("ZAUTHOR1", book.getZAUTHOR1());
					data.put("CAUTHOR1", book.getCAUTHOR1());
					data.put("ZAUTHOR2", book.getZAUTHOR2());
					data.put("CAUTHOR2", book.getCAUTHOR2());
					data.put("SSH1", book.getSSH1());
					data.put("CCH", book.getCCH());
					data.put("SSH2", book.getSSH2());
					PageOpt po = new PageOpt();
					po.setCondition("BOOKID", data.getString("BOOKID"));
					// 查询所有图书
					JSONArray bookCn = bookCnmarcDao.list(po).getJSONArray("items");
					if (bookCn != null && bookCn.size() > 0) {
						bookCnmarcDao.save(data);
					} else {
						DbOpt.getInstance().insert(null, "WXK_BOOK_CNMARC", data);
					}
				}
			}
		} else if (filepath.endsWith(".xlsx")) {
			ExcelHelper eh = XssfExcelHelper.getInstance(file);
			List<Book2> Booklist = eh.readExcel(Book2.class, 0, true);
			for (Book2 book : Booklist) {
				JSONObject bd = JSONObject.parseObject(book.toString());
				if (StringUtils.isNotBlank(bd.getString("BOOKID"))) {
					JSONObject data = new JSONObject();
					data.put("BOOKID", book.getBOOKID());
					data.put("TITLE", book.getTITLE());
					data.put("OTITLE", book.getOTITLE());
					data.put("FTITLE", book.getFTITLE());
					data.put("ZAUTHOR", book.getZAUTHOR());
					data.put("CAUTHOR", book.getCAUTHOR());
					data.put("BB", book.getBB());
					data.put("BBREMARK", book.getBBREMARK());
					data.put("PAID", book.getPAID());
					data.put("PUBLISHINGID", book.getPUBLISHINGID());
					data.put("DATE", bd.getString("DATE"));
					data.put("PAGECOUNT", book.getPAGECOUNT());
					data.put("HEIGHT", book.getHEIGHT());
					data.put("SERIES", book.getSERIES());
					data.put("CONTENTNOTE", book.getREMARK());
					data.put("ZTTYPEID", book.getZTTYPEID());
					data.put("EDUTYPEID", book.getEDUTYPEID());
					data.put("FLH", book.getFLH());
					data.put("FLTX", book.getFLTX());
					data.put("ZAUTHOR1", book.getZAUTHOR1());
					data.put("CAUTHOR1", book.getCAUTHOR1());
					data.put("ZAUTHOR2", book.getZAUTHOR2());
					data.put("CAUTHOR2", book.getCAUTHOR2());
					data.put("SSH1", book.getSSH1());
					data.put("CCH", book.getCCH());
					data.put("SSH2", book.getSSH2());
					PageOpt po = new PageOpt();
					po.setCondition("BOOKID", data.getString("BOOKID"));
					// 查询所有图书
					JSONArray bookCn = bookCnmarcDao.list(po).getJSONArray("items");
					if (bookCn.size() > 0 && bookCn != null) {
						bookCnmarcDao.save(data);
					} else {
						DbOpt.getInstance().insert(null, "WXK_BOOK_CNMARC", data);
					}
				}
			}
		}
	}

	@Override
	public JSONArray Test() throws Exception {
		// 去重
		String sql4 = "DELETE FROM WXK_BOOKKEYCOUNT where ID not in(select a.ID from(select max(ID) as ID from WXK_BOOKKEYCOUNT group by BOOKID,NAME,TYPE) a )";
		DbOpt.getInstance().getJdbcTemplate().execute(sql4.toString());
		return null;

	}
	
	
	
	public JSONArray ZTtree() {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		sql.append("select a.ID,a.PID,a.ZTNAME as NAME,a.ZTSYMBOL as CODE,a.ZTTHEME");
//		sql.append(" from WXK_ZTTYPE a where a.PID IS NULL ");
		sql.append(" from WXK_ZTTYPE a  ");
		sql.append(" where CHAR_LENGTH(a.ID) <= 9  ");
		sql.append(" order by convert(a.ID using gbk) ");
		String dosql = sql.toString();
		data = this.getJdbcTemplate().query(dosql, sqlParas.getVs(), sqlParas.getTypes(), readRows);
		JSONArray r = new JSONArray();
		r.addAll(data);
		for(int i=0;i<r.size();i++){
			r.getJSONObject(i).put("NAME", r.getJSONObject(i).getString("CODE")+" "+r.getJSONObject(i).getString("NAME"));
		}
//		return r;
		return getTree(r);

	}
	
	public JSONArray Edutree() {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		sql.append("select a.ID,a.PID,a.EDUNAME as NAME,a.EDUCODE as CODE");
//		sql.append(" from WXK_ZTTYPE a where a.PID IS NULL ");
		sql.append(" from WXK_EDUTYPE a  ");
		sql.append(" where CHAR_LENGTH(a.ID) <= 9  ");
		sql.append(" order by convert(a.ID using gbk) ");
		String dosql = sql.toString();
		data = this.getJdbcTemplate().query(dosql, sqlParas.getVs(), sqlParas.getTypes(), readRows);
		JSONArray r = new JSONArray();
		r.addAll(data);
//		return r;
		return getTree(r);

	}	
	
	
	private static JSONArray getTree(JSONArray items) {
		
		//定义返回菜单列表
		JSONArray tree = new JSONArray();
		//临时存放菜单项信息
		JSONObject object = new JSONObject();
		
		for(int i=0; i<items.size(); i++) {
			JSONObject item = items.getJSONObject(i);
			String id = item.getString("ID");
//			if (StringUtils.isBlank(id)) continue;
			object.put(id, item);
			String pid = item.getString("PID");
			if (StringUtils.isBlank(pid)) {
				tree.add(item);
			}
			else {
				JSONObject pItem = object.getJSONObject(pid);
				if (pItem != null) {
					if (pItem.getJSONArray("children") == null) {
						pItem.put("children", new JSONArray());
						pItem.put("leaf", false);
					}
					item.put("pid", pItem.getString("id"));
					pItem.getJSONArray("children").add(item);
				}
			}
			item.put("id", item.getString("CODE"));
			item.put("text", item.getString("NAME"));
			item.put("leaf", "true");
			item.put("expanded", false);
			
			item.remove("ID");
			item.remove("PID");
			item.remove("CODE");
			item.remove("NAME");
		}
		
		return tree;
	}	
	
	public static JSONObject getErrMsg(String metailBusInf,String shortBusInf,int type,JSONObject data){
		if(data == null){
			data = new JSONObject();
		}
		JSONObject errInf = new JSONObject();
		errInf.put("metailBusInf", metailBusInf);
		errInf.put("shortBusInf", shortBusInf);
		errInf.put("type", type);
		data.put("success", false);
		data.put("errInf", errInf);
		return data;
	}
	
	public JSONObject getErrorObj(String title,String msg){
		JSONObject obj = new JSONObject();
		obj.put("标题", title);
		obj.put("问题原因", msg);
		return obj;
	}

	@Override
	public void updateJson(String type, String dir) throws Exception {
		StringBuffer sql = new StringBuffer();
		sql.append(" SELECT ID,FILEPATH FROM WXK_BOOK2 ");
		if (type.equals("one")) {
			sql.append(" WHERE FILEPATH = '"+dir+"' ");
		} else if (type.equals("batch")) {
			sql.append(" WHERE FILEPATH LIKE '"+dir+"%' ");
		} else if (type.equals("all")) {
		} else {
			throw new BusException("参数错误");
		}
		List<JSONObject> list = this.getJdbcTemplate().query(sql.toString(), readRows);
		BookInfo2 info = new BookInfo2();
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String BOOKURL = vconfig.getConfigValue("BOOKURL");
		for (int i = 0; i < list.size(); i++) {
			System.out.println("正在处理：" + list.get(i));
			String fileName = list.get(i).getString("ID");
			String filePath = list.get(i).getString("FILEPATH");
			// 创建图书json文件
			try {
				JSONObject jsonBook = info.getDescribe(fileName, filePath);
				List<JSONObject> book2List = this.getJdbcTemplate()
						.query("SELECT ID,ZTTYPEID FROM WXK_BOOK2 WHERE ID = '"+fileName+"'", readRows);
				if (book2List.size() > 0 && StringUtils.isNotBlank(book2List.get(0).getString("ZTTYPEID"))) {
					jsonBook.put("ZTNAME", getZtName(book2List.get(0).getString("ZTTYPEID")));
				}
				CreateFileUtil.createJsonFileBak(BOOKURL, jsonBook, filePath, jsonBook.getString("ID"));
			} catch (Exception e) {
				System.out.println("mark数据没有");
			}
		}
		
	}

	@Override
	@Transactional
	public JSONObject updateOneBook(String bookId) throws Exception {
		JSONObject returnObj = new JSONObject();
		String sql = "SELECT ID,BATID,BOOKDIR FROM WXK_BOOK WHERE BOOKID = '"+bookId+"'";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		if (list.size() == 0) {
			returnObj.put("success", false);
			returnObj.put("message", "WXK_BOOK未查询到此书");
			return returnObj;
		}
		JSONObject one = list.get(0);
		String dir = one.getString("BOOKDIR");
		String fileName = dir.split("/")[1];
		String BATID = one.getString("BATID");
		
		JSONObject books = new JSONObject();
		BookInfo2 info = new BookInfo2();//解析路径  scanpic/m/
		// 截取fileName前六位：如G01193，去WXK_BOOK_CNMARC查找对应CODE的图书信息
		JSONObject bookcc = info.getBook(fileName);
		if (bookcc == null) {
			returnObj.put("state", 2);
			returnObj.put("info", getErrorObj(fileName, "图书信息未入库"));
			return returnObj;
		}
		//处理WXK_BOOK_CNMARC的数据，转为自定义的JSON
		JSONObject book = info.getBookInfo(fileName, BATID);
		System.out.println("当前book："+book.getString("TITLE")+"======="+ book.getString("BOOKID"));
		// 判断图书出版社信息是否存在，存在查询主键保存，不存在新增
		if (StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("KEYWORD", book.getString("PUBLISHINGID"));
			JSONObject publish = publicDao.list(po);
			JSONArray js = publish.getJSONArray("items");
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				book.put("PUBLISHINGID", s.get("ID"));
			} else {
				JSONObject pub = new JSONObject();
				pub.put("NAME", book.getString("PUBLISHINGID"));
				publicDao.save(pub);
				book.put("PUBLISHINGID", pub.get("ID"));
			}
		}
		// 判断图书出版地是否存在，存在查询主键保存，不存在新增
		if (StringUtils.isNotBlank(book.getString("PAID")) && StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			PageOpt po = new PageOpt();
			po.setCondition("PUBLISHINGID", book.getString("PUBLISHINGID"));
			po.setCondition("KEYWORD", book.getString("PAID"));
			JSONObject publish = publishOrgDao.list(po);
			JSONArray js = publish.getJSONArray("items");
			if (js.size() > 0) {
				JSONObject s = (JSONObject) js.get(0);
				book.put("PAID", s.get("ID"));
			} else {
				JSONObject add = new JSONObject();
				add.put("ADDRESS", book.getString("PAID"));
				add.put("PUBLISHINGID", book.getString("PUBLISHINGID"));
				publishOrgDao.save(add);
				book.put("PAID", add.get("ID"));
			}
		} else {
			book.remove("PAID");
		}
		// 保存图书信息
		book.put("BOOKDIR", dir);
		book.put("ID", one.getString("ID"));
		books = bookDao.save(book);
		JSONObject j = info.getDescribe(fileName, dir);
		if (j != null) {
			PageOpt po = new PageOpt();
			po.setCondition("ID", j.getString("ID"));
			JSONArray arr = book2Dao.list(po).getJSONArray("items");
			if (arr.size() < 1 || arr == null) {
				DbOpt.getInstance().insert(null, "WXK_BOOK2", j);
			} else {
				book2Dao.save(j);
			}
		}
		// // 创建图书索引
		BookWrite bookWrite = BookWrite.instance();
		File dockfile = new File(ConfigOpt.getConfigValue("BOOKURL")+dir+File.separator+"dockbook");
		if(dockfile.exists()){
			if (bookcc != null) {
				bookWrite.create3(fileName, dir, BATID);
			}
		}else{
			bookWrite.create(dir);
			bookWrite.create2(dir);
			// 创建图书json文件
			// 创建图书json文件
			BookInfo info_dir = new BookInfo();
			JSONObject book_dir = info_dir.getInfo(dir, BATID);
			JSONObject jsonBook_dir = info_dir.getDescribe(dir);
			JSONArray toc_dir = info_dir.getToc(dir);
			jsonBook_dir.put("CALEGORY", toc_dir);
			JSONObject zttype = info_dir.getCLC(dir);
			jsonBook_dir.put("ZTNAME", getZtName(zttype.getString("ZTTYPEID")));
			Config vconfig = ServiceFactory.getInstance().getConfig();
			String BOOKURL = vconfig.getConfigValue("BOOKURL");
			CreateFileUtil.createJsonFile(BOOKURL, jsonBook_dir, dir, jsonBook_dir.getString("ID"));
		}
		// 创建图书json文件
		JSONObject jsonBook = info.getDescribe(fileName, dir);
		if (StringUtils.isNotBlank(book.getString("ZTTYPEID"))) {
			jsonBook.put("ZTNAME", getZtName(book.getString("ZTTYPEID")));
		}
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String BOOKURL = vconfig.getConfigValue("BOOKURL");
		CreateFileUtil.createJsonFile (BOOKURL, jsonBook, dir, jsonBook.getString("ID"));
		// 图书的中图法分类信息
		if (StringUtils.isNotBlank(book.getString("ZTTYPEID"))) {
			System.out.println("中图法：" + book.getString("ZTTYPEID"));
			PageOpt po = new PageOpt();
			po.setCondition("ZTTYPE", book.getString("ZTTYPEID"));
			JSONObject zt = ztTypeDao.list(po);
			JSONArray js = zt.getJSONArray("items");
			JSONObject bzt = new JSONObject();
			if (js.size() > 0) {
				this.getJdbcTemplate().execute("DELETE FROM WXK_BOOKZTTYPE WHERE BOOKID = '"+books.get("ID")+"'");
				JSONObject s = (JSONObject) js.get(0);
				bzt.put("ZTTYPEID", s.get("ID"));
				bzt.put("BOOKID", books.get("ID"));
				bookZtDao.save(bzt);
				// 保存中图法数量
				saveZttype(s.getString("ID"), books.getString("BOOKID"));
			}
		}
		// 图书的学科分类信息
		if (StringUtils.isNotBlank(book.getString("EDUTYPEID"))) {
			PageOpt2 po = new PageOpt2();
			po.setCondition("EDUCODE", book.getString("EDUTYPEID"), "=", "and");
			JSONObject edu = eduTypeDao.list(po);
			JSONArray js = edu.getJSONArray("items");
			JSONObject bzt = new JSONObject();
			// 先删除
			this.getJdbcTemplate().execute("DELETE FROM WXK_BOOKEDUTYPE WHERE BOOKID = '"+books.getString("ID")+"'");
			if (js.size() > 0) {
				this.getJdbcTemplate().execute("DELETE FROM WXK_BOOKEDUTYPE WHERE BOOKID = '"+books.getString("ID")+"'");
				JSONObject s = js.getJSONObject(0);
				bzt.put("EDUTYPEID", s.getString("ID"));
				bzt.put("BOOKID", books.getString("ID"));
				bookEduDao.save(bzt);
			}
		}
		// 图书负责人信息
		JSONArray bookcreator = info.getCreator(fileName);
		this.getJdbcTemplate().execute("DELETE FROM WXK_BOOKCRATEOR WHERE BOOKID = '"+books.get("ID")+"'");
		if (bookcreator.size() > 0 && bookcreator != null) {
			JSONObject s = null;
			for (int i = 0; i < bookcreator.size(); i++) {
				s = bookcreator.getJSONObject(i);
				s.put("BOOKID", books.get("ID"));
				bookCreatorDao.save(s);
			}
		}
		books.put("state", 1);
		//2019/11/12
		// 生成简体html文件
		// 获取路径
		String path = vconfig.getConfigValue("BOOKURL");
		String str = "/epub/EPUB/";
		String str2 = "/epub/EPUBS/";
		File file = new File(path.concat(dir).concat(str));
		File[] fileList = file.listFiles();
		for (int h = 0; h < fileList.length; h++) {
			String fileType = fileList[h].getName().substring(fileList[h].getName().lastIndexOf('.') + 1,
					fileList[h].getName().length());
			if ("html".equals(fileType)) {
				createsimplified(fileList[h].getPath(), path.concat(dir).concat(str2).concat(fileList[h].getName()));
			}
		}
		// 将img赋值到EPUBS
		String oldimg = path.concat(dir).concat(str).concat("img");
		String newimg = path.concat(dir).concat(str2).concat("img");
		copy(oldimg, newimg);
		return books;
	}

	@Override
	public String getCustomerBooks(String customerId) {
		String date = DateOpt.getCurrentDateStr();
		StringBuffer buffer = new StringBuffer();
		buffer.append(" select ID, BOOKID from WXK_ZTTYPE2 ")
			  .append(" where ID in( ")
			  .append(" select distinct ZTTYPEID ")
			  .append(" from WXK_ZRREL ")
			  .append(" where length(ZTTYPEID) = 3 and RESOURCEPACKAGEID in ")
			  .append(" (select distinct RESOURCEID from CRM_ORDER ")
			  .append(" where CTID = '" + customerId + "' and ISVALID = '1' ")
			  .append(" and BEGINDATE <= '" + date + "' and ENDDATE >= '" + date + "') ) ");
		List<JSONObject> list = this.getJdbcTemplate().query(buffer.toString(), readRows);
		StringBuffer str = new StringBuffer();
		str.append("start,");
		for (int i = 0; i < list.size(); i++) {
			String bookid = list.get(i).getString("BOOKID");
			if (StringUtils.isNotBlank(bookid)) {
				str.append(bookid);
			}
		}
		return str.toString();
	}

	@Override
	public void clearAllCustomerBooksCache() {
		String sql = "select distinct CTID from CRM_ORDER";
		List<JSONObject> query = this.getJdbcTemplate().query(sql, readRows);
		for (JSONObject obj : query) {
			ConsumerBooksCache.clearCustomerCache(obj.getString("CTID"));
		}
	}
}
