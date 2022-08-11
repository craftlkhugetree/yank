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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.DocumentException;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOpt2;
import com.somenew.config.service.Config;
import com.somenew.config.service.ConfigOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.RootDao;
import com.somenew.db.SqlParas;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.service.ServiceFactory;
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
import cn.com.angke.mgk.service.DataService;
import cn.com.angke.utils.BookInfo2;
import cn.com.angke.utils.CreateFileUtil;
import cn.com.angke.utils.CreateHTML;

@Service
public class DataSrviceImpl extends PlatformBaseServiceImpl implements DataService {
	
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
	
	@Override
	public void genHtml() {
		//System.out.println("执行了生成首页！0801");
		Map<String, Object> m = new HashMap<>();
		// 生成随机10本书的json文件
		StringBuffer booksql = new StringBuffer();
		booksql.append(
				"select b.ID,(CASE WHEN b.TITLE LIKE '%册' then SUBSTRING(b.TITLE,1,CHAR_LENGTH(b.TITLE)-3) else b.title end) as TITLE, ");
		booksql.append(
				" p.`NAME` as 'PUBLISHNAME',b.BOOKDIR,b.BOOKID,b.BOOKDIR,bzt.ZTSYMBOL as 'ZTTYPE' from WXK_BOOK b ");
		booksql.append("left join WXK_PUBLISHING p on(b.PUBLISHINGID=p.ID) left join ");
		booksql.append(
				"(select bz.BOOKID,bz.ZTTYPEID,z.ZTSYMBOL from WXK_BOOKZTTYPE bz LEFT JOIN WXK_ZTTYPE z ON bz.ZTTYPEID=z.ID ) bzt on (b.ID=bzt.BOOKID)");
		booksql.append(
				" GROUP BY (CASE WHEN b.TITLE LIKE '%册' then SUBSTRING(b.TITLE,1,CHAR_LENGTH(b.TITLE)-3) else b.title end)");
		booksql.append(" order by rand() limit 10");
		List<JSONObject> bdata = this.getJdbcTemplate().query(booksql.toString(), null, null, RootDao.readRows);
		for (int i = 0; i < bdata.size(); i++) {
			String path = bdata.get(i).getString("BOOKDIR");
			path = path.replace("\\", "/");
			bdata.get(i).put("BOOKDIR", path);
		}
		m.put("NEWARRIVAL", bdata);
		// 生成人物的json数据
		StringBuffer peoplesql = new StringBuffer();
		peoplesql.append("select CONCAT(p.LASTNAME,p.FIRSTNAME) as 'NAME',p.BIRTHDAY,p.YH,");
		peoplesql.append("o.Z,o.H,o.BC,p.JG from WXK_PEOPLE p");
		peoplesql.append(" LEFT JOIN (SELECT a.PEOPLEID, ");
		peoplesql.append("MAX( CASE WHEN a.`NTYPE`='字' THEN  a.`NAME` END  ) Z, ");
		peoplesql.append("MAX( CASE WHEN a.`NTYPE`='号' THEN  a.`NAME` END  ) H,");
		peoplesql.append("MAX( CASE WHEN a.`NTYPE`='别名' THEN a.`NAME` END ) BC ");
		peoplesql.append(" FROM (SELECT PEOPLEID, GROUP_CONCAT(`NAME`)as 'NAME',NTYPE ");
		peoplesql.append(" FROM WXK_OTHERNAME group BY PEOPLEID,NTYPE) a  group BY a.PEOPLEID) o ");
		peoplesql.append(" ON(p.ID=o.PEOPLEID) where p.BIRTHDAY<>''and p.JG<>'' order by RAND() limit 5");
		List<JSONObject> pdata = this.getJdbcTemplate().query(peoplesql.toString(), null, null, RootDao.readRows);
		m.put("MGMASTERCOMMENT", pdata);
		// 生成专家评论数据
		StringBuffer commentSql = new StringBuffer();
		commentSql.append(
				" select AUTHOR as EXPERTER,TITLE as EXPERTERCOMMENT,CONTENT,COMMENTTIME from WXK_EXPERTCOMMENT where ISSHOW='1' limit 4");
		List<JSONObject> cdata = this.getJdbcTemplate().query(commentSql.toString(), null, null, RootDao.readRows);
		m.put("EXPERTCOMMENT", cdata);
		Config vconfig = ServiceFactory.getInstance().getConfig();
		// 获取图片路径
		String path = vconfig.getConfigValue("IMGURL");
		// 获取首页模版地址
		String temppath = vconfig.getConfigValue("INDEXTEMP");
		m.put("IMGURL", path);
		CreateHTML cre = new CreateHTML();
		cre.geneHtmlFile("indexftl.html", m, temppath, "index.html", temppath);
	}

	@Override
	public void syncZttype() {
		System.out.println("正在更新WXK_ZTTYPE2");
		String bookIdSql = "select ID from WXK_BOOK2";
		List<JSONObject> bookList = this.getJdbcTemplate().query(bookIdSql, readRows);
		JSONArray bookIds = new JSONArray();
		for (int i = 0; i < bookList.size(); i++) {
			bookIds.add(bookList.get(i).getString("ID"));
		}
		String ztType2Sql = "select ID, BOOKID from WXK_ZTTYPE2 where BOOKID is not null";
		List<JSONObject> ztTypeList = this.getJdbcTemplate().query(ztType2Sql, readRows);
		for (JSONObject oneType: ztTypeList) {
			String ID = oneType.getString("ID");
			String BOOKID = oneType.getString("BOOKID");
			String[] bookIdArr = BOOKID.split(",");
			StringBuffer newBookId = new StringBuffer();
			int count = 0;
			for (int i = 0; i < bookIdArr.length; i++) {
				if (bookIds.contains(bookIdArr[i])) {
					newBookId.append(bookIdArr[i] + ",");
					count += 1;
				}
			}
			String upSql = "update WXK_ZTTYPE2 set BOOKID = '"+newBookId.toString()+"',COUNT = "+count+" where ID = '"+ID+"'";
			this.getJdbcTemplate().execute(upSql);
		}
		System.out.println("更新WXK_ZTTYPE2结束");
	}

	@Override
	public String checkPicLost() {
		String basePath = ConfigOpt.getConfigValue("BOOKURL");
		String querySql = " SELECT BOOKDIR "
						+ " FROM WXK_BOOK ";
		List<JSONObject> list = this.getJdbcTemplate().query(querySql, readRows);
		JSONArray arr = new JSONArray();
		for (JSONObject one: list) {
			String dir = one.getString("BOOKDIR");
			String fileName = null;
			try {
				fileName = basePath.concat(dir.concat(File.separator).concat("scanpic/m/0001.png"));
				System.out.println(fileName);
				File file = new File(fileName);
				if (!file.exists()) arr.add(dir);
			} catch (Exception e) {
				System.out.println(fileName);
				e.printStackTrace();
				break;
			} 
		}
		System.out.println("缺失：" + arr.toJSONString());
		return arr.toJSONString();
	}

	private JSONArray checkArr = new JSONArray();
	
	@Override
	public String checkBookLost(String batId) throws Exception {
		checkArr = new JSONArray();
		String queryMakeSql = " SELECT ID,BATID FROM WXK_MAKEID " + 
				(StringUtils.isBlank(batId) ? "" : "WHERE BATID = '" + batId + "'");
		List<JSONObject> makeList = this.getJdbcTemplate().query(queryMakeSql, readRows);
		for (JSONObject one: makeList) {
			String makeId = one.getString("ID");
			batId = one.getString("BATID");
			BookWrite bookWrite = BookWrite.instance();
			File file = bookWrite.getFile(batId);
			SubindexBuilder(file, batId, makeId);
		}
		System.out.println("======结束！！！！！！！！！！！！！！=======");
		return checkArr.toJSONString();
	}


	private void SubindexBuilder (File file, String batId, String makeId) throws Exception {
		File[] fileList = file.listFiles();
		for (int i = 0; i < fileList.length; i++) {
			File oneFile = fileList[i];
			if (oneFile.isDirectory() && (oneFile.getName().contains("dockbook")|| oneFile.getName().contains("docbook"))) {
				String filepath = batId.concat("/").concat(oneFile.getParentFile().getName());//例如 C001_01_20180515/G01193初级会计学
				//G01193初级会计学,C001_01_20180515/G01193初级会计学,记录ID
				System.out.println("进度：" + (i + 1) + "/" + fileList.length);
				JSONObject res = saveBook2(oneFile.getParentFile().getName(), filepath, makeId);
			} else if (oneFile.isDirectory()) {
				SubindexBuilder(oneFile, batId, makeId);
			}
		}
	}
	
	private JSONObject saveBook2 (String fileName, String dir, String makeId) throws Exception {
		JSONObject books = new JSONObject();
		BookInfo2 info = new BookInfo2();
		// 截取fileName前六位：如G01193，去WXK_BOOK_CNMARC查找对应CODE的图书信息
		JSONObject bookcc = info.getBook(fileName);
		if (bookcc == null) {
			checkArr.add(dir + "未入库");
			System.out.println(dir + "未入库");
			return null;
		}
		//处理WXK_BOOK_CNMARC的数据，转为自定义的JSON
		JSONObject book = info.getBookInfo(fileName, makeId);
		System.out.println("正在处理：" + book);
		// 判断图书是否解析过,查询WXK_BOOK
		PageOpt2 bp = new PageOpt2();
		bp.setCondition("BOOKID", book.getString("BOOKID"), "=", "and");
		JSONObject flow = bookDao.list(bp);
		JSONArray bookID = flow.getJSONArray("items");
		String bookId = null;
		if (bookID.size() > 0) {
			bookId = bookID.getJSONObject(0).getString("ID");
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
		book.put("BOOKDIR", dir);
		if (StringUtils.isBlank(bookId)) {
			checkArr.add("以前未处理：" + book);
			book.put("CREATETIME", DateOpt.datetimeToStr(new Date()));
		} else {
			book.put("ID", bookId);
		}
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
		
		// 创建图书索引
		BookWrite bookWrite = BookWrite.instance();
		File dockfile = new File(ConfigOpt.getConfigValue("BOOKURL")+dir+File.separator+"dockbook");
		if(dockfile.exists()){
			if (bookcc != null) {
				bookWrite.create3(fileName, dir, makeId);
			}
		}else{
			bookWrite.create(dir);
			bookWrite.create2(dir);
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
			// 先删除
			this.getJdbcTemplate().execute("DELETE FROM WXK_BOOKEDUTYPE WHERE BOOKID = '"+books.getString("ID")+"'");
			if (js.size() > 0) {
				JSONObject s = js.getJSONObject(0);
				bzt.put("EDUTYPEID", s.getString("ID"));
				bzt.put("BOOKID", books.getString("ID"));
				bookEduDao.save(bzt);
			}
		}
		// 图书负责人信息
		JSONArray bookcreator = info.getCreator(fileName);
		// 先删除
		this.getJdbcTemplate().execute("DELETE FROM WXK_BOOKCRATEOR WHERE BOOKID = '"+books.get("ID")+"'");
		if (bookcreator != null && bookcreator.size() > 0 ) {
			JSONObject s = null;
			for (int i = 0; i < bookcreator.size(); i++) {
				s = bookcreator.getJSONObject(i);
				s.put("BOOKID", books.get("ID"));
				bookCreatorDao.save(s);
			}
		}
		
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
		
		return null;
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
}
