package cn.com.angke.book.service.impl;

import java.io.File;
import java.io.IOException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.queryparser.classic.QueryParserBase;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.TermQuery;
import org.dom4j.DocumentException;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;
import com.somenew.cache.DataCacheOpt;
import com.somenew.config.service.Config;
import com.somenew.config.service.ConfigOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.PageSqlOpt;
import com.somenew.db.SqlParas;
import com.somenew.exception.BusException;
import com.somenew.ids.client.AuthFilterComm;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.service.ServiceFactory;
import com.somenew.utils.DateOpt;
import com.somenew.utils.StringOpt;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.book.dao.DownRecordDao;
import cn.com.angke.book.dao.OrderDao;
import cn.com.angke.book.dao.QuoteRecordDao;
import cn.com.angke.book.dao.ReadRecordDao;
import cn.com.angke.book.dao.SearchRecordDao;
import cn.com.angke.book.dao.VisitRecordDao;
import cn.com.angke.book.dao.ZrRelDao;
import cn.com.angke.book.dao.ZtTypeDao;
import cn.com.angke.book.service.BookService;
import cn.com.angke.util.ArrayPage;
import cn.com.angke.util.BookInfo;
import cn.com.angke.util.BookSearch;
import cn.com.angke.util.Citation;
import cn.com.angke.util.QuoteModel;
import cn.com.angke.util.WaterMarkUtils;
import cn.com.angke.util.cache.ConsumerBooksCache;

@Service
public class BookServiceImpl extends PlatformBaseServiceImpl implements BookService {

	@Resource(name = "ztTypeDaoImpl")
	private ZtTypeDao ztTypeDao;

	@Resource(name = "zrRelDaoImpl")
	private ZrRelDao zrRelDao;

	@Resource(name = "orderDaoImpl")
	private OrderDao orderDao;

	@Resource(name = "readRecordDaoImpl")
	private ReadRecordDao readRecordDao;

	@Resource(name = "searchRecordDaoImpl")
	private SearchRecordDao searchRecordDao;

	@Resource(name = "downRecordDaoImpl")
	private DownRecordDao downRecordDao;

	@Resource(name = "quoteRecordDaoImpl")
	private QuoteRecordDao quoteRecordDao;

	@Resource(name = "visitRecordDaoImpl")
	private VisitRecordDao visitRecordDao;

	public String getUserId() {
		String userid =null;
		HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		JSONObject user = AuthFilterComm.getCurrentUser(req);
		if(user!=null) {
			userid =  user.getString("ID");
		}
		return userid;
	}
	/**
	 * 根据关键词查询图书
	 * 
	 * @throws ParseException
	 */
	public JSONObject searchBook(JSONArray keyWord, int start, int limit, String ip)
			throws IOException, ParseException {
		BookSearch bookSearch = BookSearch.instance();
		JSONArray books = null;
		String cid = getCostomerByIp(ip);
		if (keyWord.size() == 1) {
			books = bookSearch.search(keyWord.getString(0));
			// 保存搜索关键词记录
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", cid);
			record.put("KEYWORD", keyWord.getString(0));
			record.put("TYPE", "search");
			record.put("USERID", getUserId());
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			searchRecordDao.save(record);
		} else {
			books = bookSearch.searchInResult(keyWord);
			// 保存搜索关键词记录
			JSONObject record = null;
			for (int i = keyWord.size() - 1; i < keyWord.size(); i++) {
				record = new JSONObject();
				record.put("IP", ip);
				record.put("CTMID",cid);
				record.put("KEYWORD", keyWord.getString(i));
				record.put("TYPE", "search");
				record.put("USERID", getUserId());
				record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
				searchRecordDao.save(record);
			}
		}
		// 得到的图书查询数据库是否存
		JSONArray BOOKID = new JSONArray();
		JSONArray newbooks = new JSONArray();
		// 根据ip地址查询数据库客户资源库内容
		JSONArray ztType = getZtType(ip);
		if (books.size() > 0) {
			JSONObject r = null;
			for (int i = 0; i < books.size(); i++) {
				r = books.getJSONObject(i);
				if (StringUtils.isBlank(r.getString("ZTTYPE"))) {
					r.put("ZTTYPE", "Z");
				}
				File dockfile = new File(ConfigOpt.getConfigValue("BOOKURL")+r.get("DIR")+File.separator+"docbook");
				if(dockfile.exists()){
					r.put("ISTEXT", '1');
				}else {
					r.put("ISTEXT", '0');
				}
				r.put("FILEPATH", r.get("ID") + ".json");
				if (ztType.contains(r.get("ZTTYPE"))) {
					r.put("ISLOOK", true);
				} else {
					r.put("ISLOOK", false);
				}
				BOOKID.add(r.get("ID"));
				newbooks.add(r);
			}
		}
		Object[] a = newbooks.toArray();
		ArrayPage page = new ArrayPage(a, start, limit);
		// 根据bookid取得分类目录
		JSONArray res = cataLog(BOOKID);
		JSONObject r = new JSONObject();
		r.put("Catalog", res);
		r.put("BOOKLIST", page.getDisplayResult());
		r.put("BOOKTOTAl", page.getTotalCount());
		return r;
	}

	public JSONObject searchBookByType(String BOOKIDS, int start, int limit, String ip) throws IOException {
		String[] bookId = BOOKIDS.split(",");
		JSONArray BOOKID = new JSONArray();
		if (bookId.length > 0) {
			for (int i = 0; i < bookId.length; i++) {
				BOOKID.add(bookId[i]);
			}
		}
		JSONArray r = new JSONArray();
		// JSONArray zttype = getZtType(ip);
		String cid = getCostomerByIp(ip);
		String consumerBooks = null;
		if (StringUtils.isNotBlank(cid)) {
			consumerBooks = ConsumerBooksCache.getConsumerBooks(cid);
		}
		BookSearch bookSearch = BookSearch.instance();
		JSONArray notExistBook = new JSONArray();
		JSONObject data = new JSONObject();
		for (int i = 0; i < bookId.length; i++) {
			JSONArray book = bookSearch.searchID(bookId[i]);
			Boolean isExit = false;
			for (int j = 0; j < book.size(); j++) {
				data = book.getJSONObject(j);
				if (StringUtils.isBlank(data.getString("ZTTYPE"))) {
					data.put("ZTTYPE", "Z");
				}
				if (StringUtils.isNotBlank(consumerBooks) && consumerBooks.contains(bookId[i] + ",")) {
					data.put("ISLOOK", true);
				} else {
					data.put("ISLOOK", false);
				}
				data.put("FILEPATH", data.get("ID") + ".json");
				r.add(data);
				isExit = true;
			}
			if (!isExit) {
				notExistBook.add(getBookObjById(bookId[i]));
			}
		}
		Object[] a = r.toArray();
		ArrayPage page = new ArrayPage(a, start, limit);
		JSONArray cate = cataLog(BOOKID);
		JSONObject res = new JSONObject();
		res.put("Catalog", cate);
		res.put("BOOKLIST", page.getDisplayResult());
		res.put("BOOKTOTAl", page.getTotalCount());
		res.put("NOTEXISTBOOK", notExistBook);
		return res;
	}
	
	public JSONObject getIsLookSearch (String bookId) {
		String sql = "select ID, ZTTYPEID ZTTYPE, FILEPATH DIR from WXK_BOOK2 where ID = '"+ bookId +"'";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		if (list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}
	
	public JSONObject getBookObjById (String bookId) {
		String sql = "select * from WXK_BOOK2 where ID = '"+bookId+"'";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		if (list.size() == 0) {
			JSONObject obj = new JSONObject();
			obj.put("ID", bookId);
			obj.put("EXIST", false);
			return obj;
		} else {
			return list.get(0);
		}
	}
	
	// 图书内检索关键词
	public JSONObject searchBookByID(String bookid, String keyword) throws IOException {
		BookSearch bookSearch = BookSearch.instance();
		JSONArray book = bookSearch.search(bookid, keyword);
		JSONObject r = new JSONObject();
		r.put("items", book);
		return r;
	}
	public JSONObject advancedSearchDb(JSONObject data, String ip) throws IOException, ParseException {
		List<JSONObject> rdata = null;
		JSONObject key = JSONObject.parseObject(data.getString("filter"));
		String title = key.getString("TITLE");
		String author = key.getString("AUTHOR");
		String series = key.getString("SERIES");
		String publishername = key.getString("PUBLISHERNAME");
		String address = key.getString("ADDRESS");
		String pubdate = key.getString("PUBDATE");
		String keyword = key.getString("KEYWORD");
		String zttype = key.getString("ZTTYPE");
		String edutype = key.getString("EDUTYPE");
		Integer start = StringUtils.isBlank(data.getString("start")) ? 0 : data.getInteger("start");
		Integer limit = StringUtils.isBlank(data.getString("limit")) ? 3 : data.getInteger("limit");
		StringBuffer lsql = new StringBuffer();
		StringBuffer dsql = new StringBuffer();
		StringBuffer csql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		PageOpt2 po = new PageOpt2();
		po.setPageSize(limit);
		po.setStart(start);
		dsql.append("SELECT ID,FILEPATH,ZTTYPEID as ZTTYPE ,ISTEXT FROM WXK_BOOK2 where ");
		csql.append("SELECT COUNT(ID) FROM WXK_BOOK2 where ");
		if (StringUtils.isNotBlank(title)) {
			lsql.append("  TITLE LIKE ?  AND");
			sqlParas.addPara("%"+title+"%", Types.VARCHAR);
		}
		// 作者
		if (StringUtils.isNotBlank(author)) {
			lsql.append("  AUTHOR LIKE ?  AND");
			sqlParas.addPara("%"+author+"%", Types.VARCHAR);
		}
		// 丛书
		if (StringUtils.isNotBlank(series)) {
			lsql.append("  SERIES LIKE ?  AND");
			sqlParas.addPara("%"+series+"%", Types.VARCHAR);
		}
		// 出版社
		if (StringUtils.isNotBlank(publishername)) {
			lsql.append("  PUBLISHINGID LIKE ?  AND");
			sqlParas.addPara("%"+publishername+"%", Types.VARCHAR);
		}
		// 出版地
		if (StringUtils.isNotBlank(address)) {
			lsql.append("  PAID LIKE ?  AND");
			sqlParas.addPara("%"+address+"%", Types.VARCHAR);
		}
		// 出版年
		if (StringUtils.isNotBlank(pubdate)) {
			lsql.append("  DATE LIKE ?  AND");
			sqlParas.addPara("%"+pubdate+"%", Types.VARCHAR);
		}
		// // 主题词
		if (StringUtils.isNotBlank(keyword)) {
			lsql.append("  ZTCC LIKE ?  AND");
			sqlParas.addPara("%"+keyword+"%", Types.VARCHAR);
		}
		// 中图法分类
		if (StringUtils.isNotBlank(zttype)) {
			lsql.append("  ZTTYPEID LIKE ?  AND");
			sqlParas.addPara(zttype+"%", Types.VARCHAR);
		}
		lsql.append(" ID IN (SELECT BOOKID FROM WXK_BOOK) ");
		dsql.append(lsql);
		String dosql = dsql.toString();
		dosql = PageSqlOpt.getPaginationString(dosql, po.getStart(), po.getPageSize());
		
		rdata = getJdbcTemplate().query(dosql, sqlParas.getVs(), sqlParas.getTypes(), readRows);
		csql.append(lsql);
		int cnt = ((Integer) getJdbcTemplate().queryForObject(csql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
				Integer.class)).intValue();
		
		JSONArray ztType = getZtType(ip);
		JSONArray newbooks = new JSONArray();
		JSONArray BOOKID = new JSONArray();
		if (rdata.size() > 0) {
			JSONObject r = null;
			for (int i = 0; i < rdata.size(); i++) {
				r = rdata.get(i);
				r.put("DIR", r.get("FILEPATH"));
				r.put("FILEPATH", r.get("ID") + ".json");
				
		
				if (ztType.contains(r.getString("ZTTYPE"))) {
					r.put("ISLOOK", true);
				} else {
					r.put("ISLOOK", false);
				}
				BOOKID.add(r.get("ID"));
				
				newbooks.add(r);
			}
		}
		saveRecord(title, author, series, publishername, pubdate, address, keyword, zttype, edutype, ip);
		JSONObject re = new JSONObject();
		JSONArray res = cataLog(BOOKID);
		re.put("BOOKLIST", newbooks);
		re.put("BOOKTOTAl", Integer.valueOf(cnt));
		re.put("Catalog", res);
		return re;
	}
	public JSONObject advancedSearch(JSONObject data, String ip) throws IOException, ParseException {
		JSONObject key = JSONObject.parseObject(data.getString("filter"));
		String title = key.getString("TITLE");
		String author = key.getString("AUTHOR");
		String series = key.getString("SERIES");
		String publishername = key.getString("PUBLISHERNAME");
		String address = key.getString("ADDRESS");
		String pubdate = key.getString("PUBDATE");
		String keyword = key.getString("KEYWORD");
		String zttype = key.getString("ZTTYPE");
		String edutype = key.getString("EDUTYPE");
		Integer start = StringUtils.isBlank(data.getString("start")) ? 0 : data.getInteger("start");
		Integer limit = StringUtils.isBlank(data.getString("limit")) ? 3 : data.getInteger("limit");
		BookSearch bookSearch = BookSearch.instance();
		JSONArray book = bookSearch.search(title, author, series, publishername, pubdate, address, keyword, zttype,
				edutype);
		// 保存搜索记录
		saveRecord(title, author, series, publishername, pubdate, address, keyword, zttype, edutype, ip);
		JSONArray newbooks = new JSONArray();
		JSONArray BOOKID = new JSONArray();
		// 查询数据库客户资源库内容
		JSONArray ztType = getZtType(ip);
		if (book.size() > 0) {
			JSONObject r = null;
			for (int i = 0; i < book.size(); i++) {
				r = book.getJSONObject(i);
				r.put("FILEPATH", r.get("ID") + ".json");
				 if (StringUtils.isBlank(r.getString("ZTTYPE"))) {
				 r.put("ZTTYPE", "Z8");
				 }
				if (ztType.contains(r.getString("ZTTYPE"))) {
					r.put("ISLOOK", true);
				} else {
					r.put("ISLOOK", false);
				}
				BOOKID.add(r.get("ID"));
				newbooks.add(r);
			}
		}
		Object[] a = newbooks.toArray();
		ArrayPage page = new ArrayPage(a, start, limit);
		// 根据bookid取得分类目录
		JSONArray res = cataLog(BOOKID);
		JSONObject r = new JSONObject();
		r.put("BOOKLIST", page.getDisplayResult());
		r.put("BOOKTOTAl", page.getTotalCount());
		r.put("Catalog", res);
		return r;
	}

	// 取得书Id,查询关联分类目录
	public JSONArray cataLog(JSONArray BOOKID) {
		StringBuffer inStr = new StringBuffer();
		if(BOOKID!=null && BOOKID.size()>0){
			for(int i=0;i<BOOKID.size();i++){
				inStr.append("'"+BOOKID.getString(i)+"',");
			}
			inStr.delete(inStr.length()-1, inStr.length());
		}
		// return null;
		// 根据返回图书查询人物库相关
		List<JSONObject> rwdata = new ArrayList<JSONObject>();
		if (BOOKID != null && BOOKID.size() >0) {
			StringBuffer rwsql = new StringBuffer();
			rwsql.append(
					"select COUNT(DISTINCT(a.BOOKID)) as 'NUMBER',GROUP_CONCAT(DISTINCT(a.BOOKID)) as 'BOOKIDS',a.`NAME`,a.TYPE from WXK_KEYCOUNT a where a.TYPE='01' ");
			rwsql.append(" and a.`NAME` in(select a.`NAME` from WXK_KEYCOUNT a where a.TYPE='01' and a.BOOKID in("
					+ inStr + ") GROUP BY a.`NAME`) ");
			rwsql.append(" and a.BOOKID in(" + inStr + ") ");
			rwsql.append(" GROUP BY a.`NAME`");
			System.out.println("rwsql:"+rwsql);
			rwdata = getJdbcTemplate().query(rwsql.toString(), null, null, readRows);
		}
		// 根据返回图书查询地理库相关
		List<JSONObject> dldata = new ArrayList<JSONObject>();
		if (BOOKID != null && BOOKID.size() >0) {
			StringBuffer dlsql = new StringBuffer();
			dlsql.append(
					"select COUNT(DISTINCT(a.BOOKID)) as 'NUMBER',GROUP_CONCAT(DISTINCT(a.BOOKID)) as 'BOOKIDS',a.`NAME`,a.TYPE from WXK_KEYCOUNT a where a.TYPE='02' ");
			dlsql.append(" and a.`NAME` in(select a.`NAME` from WXK_KEYCOUNT a where a.TYPE='02' and a.BOOKID in("
					+ inStr + ") GROUP BY a.`NAME`) ");
			dlsql.append(" and a.BOOKID in(" + inStr + ") ");
			dlsql.append(" GROUP BY a.`NAME`");
			dldata = getJdbcTemplate().query(dlsql.toString(), null, null, readRows);
		}
		// 根据返回图书查询机构库相关
		List<JSONObject> jgdata = new ArrayList<JSONObject>();
		if (BOOKID != null && BOOKID.size() >0) {
			StringBuffer jgsql = new StringBuffer();
			jgsql.append(
					"select COUNT(DISTINCT(a.BOOKID)) as 'NUMBER',GROUP_CONCAT(DISTINCT(a.BOOKID)) as 'BOOKIDS',a.`NAME`,a.TYPE from WXK_KEYCOUNT a where a.TYPE='03' ");
			jgsql.append(" and a.`NAME` in(select a.`NAME` from WXK_KEYCOUNT a where a.TYPE='03' and a.BOOKID in("
					+ inStr + ") GROUP BY a.`NAME`) ");
			jgsql.append(" and a.BOOKID in(" + inStr + ") ");
			jgsql.append(" GROUP BY a.`NAME`");
			jgdata = getJdbcTemplate().query(jgsql.toString(), null, null, readRows);
		}
		// 根据返回图书查询职位库相关
		List<JSONObject> zwdata = new ArrayList<JSONObject>();
		if (BOOKID != null && BOOKID.size() >0) {
			StringBuffer zwsql = new StringBuffer();
			zwsql.append(
					"select COUNT(DISTINCT(a.BOOKID)) as 'NUMBER',GROUP_CONCAT(DISTINCT(a.BOOKID)) as 'BOOKIDS',a.`NAME`,a.TYPE from WXK_KEYCOUNT a where a.TYPE='04' ");
			zwsql.append(" and a.`NAME` in(select a.`NAME` from WXK_KEYCOUNT a where a.TYPE='04' and a.BOOKID in("
					+ inStr + ") GROUP BY a.`NAME`) ");
			zwsql.append(" and a.BOOKID in(" + inStr + ") ");
			zwsql.append(" GROUP BY a.`NAME`");
			zwdata = getJdbcTemplate().query(zwsql.toString(), null, null, readRows);
		}
		// 根据返回图书查询出版社相关
		List<JSONObject> cbdata = new ArrayList<JSONObject>();
		if (BOOKID != null && BOOKID.size() >0) {
			StringBuffer cbsql = new StringBuffer();
			cbsql.append(
					"select COUNT(DISTINCT(a.BOOKID)) as 'NUMBER',GROUP_CONCAT(DISTINCT(a.BOOKID)) as 'BOOKIDS',a.`NAME`,a.TYPE from WXK_KEYCOUNT a where a.TYPE='05' ");
			cbsql.append(" and a.`NAME` in(select a.`NAME` from WXK_KEYCOUNT a where a.TYPE='05' and a.BOOKID in("
					+ inStr + ") GROUP BY a.`NAME`) ");
			cbsql.append(" and a.BOOKID in(" + inStr + ") ");
			cbsql.append(" GROUP BY a.`NAME`");
			cbdata = getJdbcTemplate().query(cbsql.toString(), null, null, readRows);
		}
		// 人物
		JSONArray rwarr = new JSONArray();
		rwarr.addAll(rwdata);
		JSONObject rw = new JSONObject();
		rw.put("NAME", "人物");
		// 地理
		JSONArray dlarr = new JSONArray();
		dlarr.addAll(dldata);
		JSONObject dl = new JSONObject();
		dl.put("NAME", "地理");

		// 机构
		JSONArray jgarr = new JSONArray();
		jgarr.addAll(jgdata);
		JSONObject jg = new JSONObject();
		jg.put("NAME", "机构");

		// 职位
		JSONArray zwarr = new JSONArray();
		zwarr.addAll(zwdata);
		JSONObject zw = new JSONObject();
		zw.put("NAME", "职官");

		// 出版社
		JSONArray cbarr = new JSONArray();
		cbarr.addAll(cbdata);
		JSONObject cb = new JSONObject();
		cb.put("NAME", "出版社");
		JSONArray res = new JSONArray();
		if (rwarr.size() > 0) {
			rw.put("CHILDREN", rwarr);
			rw.put("BOOKIDS", removeDuplicate(rwarr));
		}
		res.add(rw);
		if (dlarr.size() > 0) {
			dl.put("CHILDREN", dlarr);
			dl.put("BOOKIDS", removeDuplicate(dlarr));
		}
		res.add(dl);
		if (zwarr.size() > 0) {
			zw.put("CHILDREN", zwarr);
			zw.put("BOOKIDS", removeDuplicate(zwarr));
		}
		res.add(zw);
		// if (cbarr.size() > 0) {
		// cb.put("CHILDREN", cbarr);
		// cb.put("BOOKIDS", removeDuplicate(cbarr));
		// }
		// res.add(cb);
		if (jgarr.size() > 0) {
			jg.put("CHILDREN", jgarr);
			jg.put("BOOKIDS", removeDuplicate(jgarr));
		}
		res.add(jg);
		return res;
	}

	// 取得书Id,去除重复项
	public String removeDuplicate(JSONArray arr) {
		JSONArray bookid = new JSONArray();
		for (int i = 0; i < arr.size(); i++) {
			bookid.add(arr.getJSONObject(i).get("BOOKIDS"));
		}
		List<Object> list = new ArrayList<Object>();
		for (int i = 0; i < bookid.size(); i++) {
			if (!list.contains(bookid.get(i))) {
				list.add(bookid.get(i));
			}
		}
		String str = list.toString().substring(1, list.toString().length() - 1);
		String newStr = str.replaceAll(" ", "");
		Set<String> mLinkedSet = new LinkedHashSet<String>();
		String[] strArray = newStr.split(",");
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < strArray.length; i++) {
			if (!mLinkedSet.contains(strArray[i])) {
				mLinkedSet.add(strArray[i]);
				sb.append(strArray[i] + ",");
			}
		}
		return sb.toString().substring(0, sb.toString().length() - 1);
	}

	// 根据ip获取中图法分类
	public JSONArray getZtType(String ip) {
		// 根据ip地址查询数据库客户资源库内容
		String cid = getCustomer(ip);
		JSONArray ztType = new JSONArray();
		if (StringUtils.isNotBlank(cid)) {// 根据客户id获取可读的中图法分类
			StringBuffer sb = new StringBuffer();
			SqlParas sqlPara = new SqlParas();
			sb.append("SELECT z.ZTSYMBOL FROM WXK_ZTTYPE z where z.ID in");
			sb.append("(SELECT zr.ZTTYPEID from WXK_ZRREL zr where zr.RESOURCEPACKAGEID in ");
			sb.append(" (select cor.RESOURCEID from CRM_ORDER cor WHERE cor.CTID=? and cor.ISVALID='1'))");
			sqlPara.addPara(cid, Types.VARCHAR);
			List<JSONObject> zt = getJdbcTemplate().query(sb.toString(), sqlPara.getVs(), sqlPara.getTypes(), readRows);
			for (int j = 0; j < zt.size(); j++) {
				ztType.add(zt.get(j).get("ZTSYMBOL"));
			}
		}
		return ztType;

	}
	
	// 根据ip获取用户
	public String getCostomerByIp (String ip) {
		HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		JSONObject user = AuthFilterComm.getCurrentUser(req);
		if(user!=null) {
			return  user.getString("TID");
		}
		// 根据ip地址查询数据库客户资源库内容
		String sql = "select CTMID from WXK_CTMIP where INET_ATON(?) between INET_ATON(BEGINIP) and INET_ATON(ENDIP)";
		SqlParas sqlParas = new SqlParas();
		sqlParas.addPara(ip, Types.VARCHAR);
		List<JSONObject> ctm = getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(), readRows);
		if (ctm.size() > 0) {
			return ctm.get(0).getString("CTMID");
		} else {
			return null;
		}
	} 
	

	@Override
	public JSONObject readBook(String ip, String dir, String ZTSYMBOL) throws Exception {
		// 根据ip地址查询用户可以看哪些书
		String customer = getCustomer(ip);
		String customerBooks = null;
		if (StringUtils.isNotBlank(customer)) {
			customerBooks = ConsumerBooksCache.getConsumerBooks(customer);
		}
		JSONObject desc = new JSONObject();
		BookInfo info = new BookInfo();
		// BookInfo2 info2 = new BookInfo2();
		
		JSONArray toc = null;
		// String[] s = dir.split("/");
		// String fileName = "";
		if (info.isExist(dir)) {
			String sql = "select * from WXK_BOOK2 where FILEPATH = ?";
			SqlParas sqlPara = new SqlParas();
			sqlPara.addPara(dir, Types.VARCHAR);
			List<JSONObject> d = getJdbcTemplate().query(sql.toString(), sqlPara.getVs(), sqlPara.getTypes(), readRows);
			if (d.size() > 0) {
				desc = d.get(0);
			} else {
				desc = info.getDescribe(dir);
			}
			desc.put("TYPE", true);
			toc = info.getToc(dir);
		} else {
			// if (s.length > 0) {
			// fileName = s[1];
			// }
			String sql = "select * from WXK_BOOK2 where FILEPATH = ?";
			SqlParas sqlPara = new SqlParas();
			sqlPara.addPara(dir, Types.VARCHAR);
			List<JSONObject> d = getJdbcTemplate().query(sql.toString(), sqlPara.getVs(), sqlPara.getTypes(), readRows);
			if (d.size() > 0) {
				desc = d.get(0);
			}

			// desc = info2.getDescribe(fileName, dir);
			desc.put("TYPE", false);
		}
		if (toc == null || toc.size() < 1) {
			JSONObject ml = null;
			toc = new JSONArray();
			String pageNum = desc.getString("PAGECOUNT");
			int page = Integer.valueOf(getNumber(pageNum));
			for (int i = 1; i <= page; i++) {
				ml = new JSONObject();
				ml.put("PAGE", i);
				ml.put("PZJ", "");
				ml.put("TITLE", "第" + i + "页");
				ml.put("VPAGE", i);
				ml.put("ZJ", "zj_1");
				toc.add(ml);
			}
		}
		desc.put("CALEGORY", toc);
		// if (StringUtils.isBlank(ZTSYMBOL)) {
		// desc.put("ZTTYPE", "Z8");
		// ZTSYMBOL = "Z8";
		// }
		if (StringUtils.isNotBlank(ZTSYMBOL) && StringUtils.isBlank(desc.getString("ZTTYPEID"))) {
			desc.put("ZTTYPEID", ZTSYMBOL);
			desc.put("ZTNAME", getZtName(ZTSYMBOL));
		}
		
		// 检查是否有文字的html
		desc.put("HASTEXT", BookInfo.hasText(dir));
		if (StringUtils.isNotBlank(customerBooks) && customerBooks.contains(desc.getString("ID") + ",")) {
			desc.put("ISLOOK", true);
		} else {
			desc.put("ISLOOK", false);
		}
		if (desc.getBooleanValue("ISLOOK")) {
			// 保存阅读记录
			JSONObject record = new JSONObject();
			record.put("BOOKID", desc.getString("ID"));
			record.put("IP", ip);
			record.put("CTMID", customer);
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID", getUserId());
			readRecordDao.save(record);
		}
		return desc;
	}

	public static String getNumber(String s) {
		String regex = "[\u4e00-\u9fa5]";
		Pattern pat = Pattern.compile(regex);
		Matcher mat = pat.matcher(s);
		String repickStr = mat.replaceAll("");
		return repickStr;
	}

	/**
	 * 图书内关键词检索
	 * 
	 * @throws DocumentException
	 */
	@Override
	public JSONObject inBookSearch(String BOOKID, String KEYWORD, String DIR) throws IOException, DocumentException {
		BookSearch bookSearch = BookSearch.instance();
		JSONObject data = new JSONObject();
		JSONArray j = bookSearch.search(BOOKID, KEYWORD);
		BookInfo bookInfo = new BookInfo();
		System.out.println(j);
		JSONArray toc = bookInfo.getToc(DIR);
//		System.out.println(toc);
//		if (j != null && j.size() > 0) {
//			for (int i = 0; i < j.size(); i++) {
//				j.getJSONObject(i).put("ISRED", true);
//				toc.add(j.getJSONObject(i));
//			}
//		}
		for(Object singleToc : toc) {
			JSONObject singleTocJson = (JSONObject) singleToc;
			if(null != j && !j.isEmpty()) {
				for(Object jObj : j) {
					JSONObject jJson = (JSONObject) jObj;
					if(singleTocJson.getString("ZJ").equals(jJson.getString("ZJ"))) {
						//System.out.println(jJson);
						singleTocJson.put("ISRED", true);
					}
				}
			}
			
		}
		JSONObject desc = bookInfo.getDescribe(DIR);
		JSONObject zttype = bookInfo.getCLC(DIR);
		data.put("ZTNAME", getZtName(zttype.getString("ZTTYPEID")));
		data.put("PAGECOUNT", desc.getString("PAGECOUNT"));
		data.put("TITLE", desc.getString("TITLE"));
		data.put("AUTHOR", desc.getString("AUTHOR"));
		data.put("CALEGORY", toc);
		//System.out.println(toc);
		return data;
	}

	/**
	 * 分类浏览
	 */
	@Override
	public JSONObject categorySearch() {
		StringBuffer sql = new StringBuffer();
		// sql.append(
		// "(SELECT a.ID as id,a.PID as pId,a.ZTNAME as name,a.ZTSYMBOL as
		// CODE,c.COUNT,c.BOOKIDS from WXK_ZTTYPE a ");
		// sql.append(" LEFT JOIN (SELECT COUNT(b.ZTTYPEID) as
		// COUNT,GROUP_CONCAT(b.BOOKID) as BOOKIDS,b.ZTTYPEID");
		// sql.append(
		// " FROM (SELECT wb.BOOKID,bz.ZTTYPEID FROM WXK_BOOKZTTYPE bz LEFT JOIN
		// WXK_BOOK wb ON(bz.BOOKID=wb.ID))");
		// sql.append(" b GROUP BY b.ZTTYPEID) c ON (a.ID=c.ZTTYPEID)");
		// sql.append(" where a.PID<>'' and length(a.ID)<7 order by convert(a.ID
		// using gbk)) ");
		// sql.append("UNION all (select cc.PID as 'ID','' as 'PID',zt.ZTNAME as
		// NAME,zt.ZTSYMBOL as CODE,SUM(cc.COUNT) as COUNT,");
		// sql.append(
		// " GROUP_CONCAT(cc.BOOKIDS) as BOOKIDS from (select
		// a.ID,a.PID,a.ZTNAME as NAME,a.ZTSYMBOL as CODE,c.COUNT ");
		// sql.append(
		// ",c.BOOKIDS from WXK_ZTTYPE a LEFT JOIN (SELECT COUNT(b.ZTTYPEID) as
		// COUNT,GROUP_CONCAT(b.BOOKID) as BOOKIDS,b.ZTTYPEID ");
		// sql.append(
		// " FROM (SELECT wb.BOOKID,bz.ZTTYPEID FROM WXK_BOOKZTTYPE bz LEFT JOIN
		// WXK_BOOK wb ON(bz.BOOKID=wb.ID)) b ");
		// sql.append(
		// " GROUP BY b.ZTTYPEID) c ON (a.ID=c.ZTTYPEID) order by convert(a.ID
		// using gbk) )cc LEFT JOIN WXK_ZTTYPE zt on(zt.ID=cc.PID) ");
		// sql.append("where cc.PID<>'' and LENGTH(zt.ZTSYMBOL)=1 GROUP BY
		// cc.PID)");
		sql.append(
				"select ID as id,PID as pId,ZTNAME as name,COUNT,BOOKID as BOOKIDS from WXK_ZTTYPE2 where length(ID)<10 and COUNT>0 ");
		String dosql = sql.toString();
		List<JSONObject> data = this.getJdbcTemplate().query(dosql, null, null, readRows);

		StringBuffer edusql = new StringBuffer();
		// edusql.append(
		// "(SELECT a.ID as id,a.PID as pId,a.EDUNAME as name,a.EDUCODE as
		// CODE,c.COUNT,c.BOOKIDS from WXK_EDUTYPE a ");
		// edusql.append(" LEFT JOIN (SELECT COUNT(b.EDUTYPEID) as
		// COUNT,GROUP_CONCAT(b.BOOKID) as BOOKIDS,b.EDUTYPEID");
		// edusql.append(
		// " FROM (SELECT wb.BOOKID,bz.EDUTYPEID FROM WXK_BOOKEDUTYPE bz LEFT
		// JOIN WXK_BOOK wb ON(bz.BOOKID=wb.ID))");
		// edusql.append(" b GROUP BY b.EDUTYPEID) c ON (a.ID=c.EDUTYPEID)");
		// edusql.append(" where a.PID<>'' order by convert(a.ID using gbk))
		// UNION all");
		// edusql.append(
		// " (select cc.PID as 'id','' as 'pId',zt.EDUNAME as name,zt.EDUCODE as
		// CODE,SUM(cc.COUNT) as COUNT,");
		// edusql.append(
		// " GROUP_CONCAT(cc.BOOKIDS) as BOOKIDS from (select
		// a.ID,a.PID,a.EDUNAME as NAME,a.EDUCODE as CODE,c.COUNT ");
		// edusql.append(
		// ",c.BOOKIDS from WXK_EDUTYPE a LEFT JOIN (SELECT COUNT(b.EDUTYPEID)
		// as COUNT,GROUP_CONCAT(b.BOOKID) as BOOKIDS,b.EDUTYPEID ");
		// edusql.append(
		// " FROM (SELECT wb.BOOKID,bz.EDUTYPEID FROM WXK_BOOKEDUTYPE bz LEFT
		// JOIN WXK_BOOK wb ON(bz.BOOKID=wb.ID)) b ");
		// edusql.append(
		// " GROUP BY b.EDUTYPEID) c ON (a.ID=c.EDUTYPEID) order by convert(a.ID
		// using gbk) )cc LEFT JOIN WXK_EDUTYPE zt on(zt.ID=cc.PID) ");
		// edusql.append("where cc.PID<>'' and LENGTH(zt.EDUCODE)=3 GROUP BY
		// cc.PID)");
		edusql.append("select wt.ID as id,wt.PID as pId,a.BOOKIDS,a.COUNT,wt.EDUNAME as name from ");
		edusql.append(" (SELECT COUNT(b.EDUTYPEID) AS COUNT,GROUP_CONCAT(b.BOOKID) AS BOOKIDS,b.EDUTYPEID FROM");
		edusql.append(" (SELECT wb.BOOKID,bz.EDUTYPEID FROM WXK_BOOKEDUTYPE bz LEFT JOIN WXK_BOOK wb ON ");
		edusql.append(" (bz.BOOKID = wb.ID)) b GROUP BY b.EDUTYPEID) a LEFT JOIN WXK_EDUTYPE wt on(a.EDUTYPEID=wt.ID ");
		edusql.append(" AND length(wt.PID)=0) ORDER BY length(id) ");
		String edsql = edusql.toString();
		List<JSONObject> edudata = this.getJdbcTemplate().query(edsql, null, null, readRows);
		String csql = "select count(ID) FROM WXK_BOOK";
		int cnt = this.getJdbcTemplate().queryForObject(csql.toString(), null, null, Integer.class);
		JSONObject j = new JSONObject();
		j.put("CALEGORY", data);
		j.put("EDUCALEGORY", edudata);
		j.put("PAGECOUNT", cnt);
		return j;
	}

	// 保存下载记录
	@Override
	public JSONObject saveDownRecord(String ip, JSONObject data) throws IOException, DocumentException {
		//JSONObject res = getBook(data.getString("BOOKID"));
		data.put("BOOKID", data.getString("BOOKID"));
		data.put("USERIP", ip);
		data.put("CTMID", getCustomer(ip));
		if (StringUtils.isBlank(data.getString("CTMID"))) {
			throw new BusException("非法操作！");
		}
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		sql.append(" select BOOKID,CTMID from WXK_DOWNRECORD  WHERE BOOKID=?");
		sqlParas.addPara(data.getString("BOOKID"), Types.VARCHAR);
		sql.append(" and CTMID=? GROUP BY BOOKID,CTMID,PAGENUM ");
		sqlParas.addPara(data.getString("CTMID"), Types.VARCHAR);
//		List<JSONObject> record = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
//				readRows);
//		String page = res.getString("PAGECOUNT");
//		int count = Integer.valueOf(getNumber(page));
//		Integer candown = count / 2;
//		if (record.size() > candown) {
//			throw new BusException("已超出允许的下载次数，下载失败！");
//		}
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String imgPath = vconfig.getConfigValue("BOOKIMGURL");
		String targetPath = vconfig.getConfigValue("WATERURL");
		String targerSrc = targetPath.concat(StringOpt.produceUUID() + ".jpg");
		String srcImgPath = imgPath.concat(data.getString("IMGURL"));
		// srcImgPath = srcImgPath.replace("\\", "/");
		String iconPath = vconfig.getConfigValue("ICONPATH");
		WaterMarkUtils.pressImageWithText(srcImgPath, targerSrc, iconPath);
		JSONObject newObject = new JSONObject();
		// 检查文件夹， 不存在则创建
		File checkTargetPath = new File(targetPath);
		if (!checkTargetPath.exists() && !checkTargetPath.isDirectory()) {
			checkTargetPath.mkdir();
		}
		File file = new File(targerSrc);
		if (!file.exists() && !file.isDirectory()) {
			throw new BusException("下载文件不存在！");
		}
		data.remove("IMGURL");
		data.put("USERID",getUserId());
		DbOpt.getInstance().insert(null, "WXK_DOWNRECORD", data);
		//System.out.println("保存成功");
		newObject.put("IMGSRC", file.getName());
		return newObject;
	}

	// 根据中图法code获取中图法name
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

	// 根据图书编号获取数据库图书id
	public JSONObject getBook(String id) {
		SqlParas sqlParas = new SqlParas();
		String sql = "select ID,PAGECOUNT from WXK_BOOK2 where ID='"+id+"'";
		List<JSONObject> data = this.getJdbcTemplate().query(sql, readRows);
		String ID = null;
		String count = null;
		if (data != null && data.size() > 0) {
			ID = data.get(0).getString("ID");
			count = data.get(0).getString("PAGECOUNT");
		}
		JSONObject res = new JSONObject();
		res.put("ID", ID);
		res.put("PAGECOUNT", count);
		return res;
	}

	// 根据ip获取客户Id
	public String getCustomer(String IP) {
		HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		JSONObject user = AuthFilterComm.getCurrentUser(req);
		if(user!=null) {
			return  user.getString("TID");
		}
		SqlParas sqlParas = new SqlParas();
		String sql = "select CTMID from WXK_CTMIP where INET_ATON(?) between INET_ATON(BEGINIP) and INET_ATON(ENDIP)";
		sqlParas.addPara(IP, Types.VARCHAR);
		List<JSONObject> data = this.getJdbcTemplate().query(sql, sqlParas.getVs(), sqlParas.getTypes(), readRows);
		String CTMID = null;
		if (data != null && data.size() > 0) {
			CTMID = data.get(0).getString("CTMID");
		}
		return CTMID;
	}

	// 保存高级搜索记录
	public void saveRecord(String title, String author, String series, String publishername, String pubdate,
			String address, String keyword, String zttype, String edutype, String ip) {
		if (StringUtils.isNotBlank(title)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", title);
			record.put("TYPE", "title");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(author)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", author);
			record.put("TYPE", "author");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(series)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", series);
			record.put("TYPE", "series");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(publishername)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", publishername);
			record.put("TYPE", "publishername");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(pubdate)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", pubdate);
			record.put("TYPE", "pubdate");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(address)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", address);
			record.put("TYPE", "address");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(keyword)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", keyword);
			record.put("TYPE", "keyword");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(zttype)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", zttype);
			record.put("TYPE", "zttype");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
		if (StringUtils.isNotBlank(edutype)) {
			JSONObject record = new JSONObject();
			record.put("IP", ip);
			record.put("CTMID", getCustomer(ip));
			record.put("KEYWORD", edutype);
			record.put("TYPE", "edutype");
			record.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			record.put("USERID",getUserId());
			searchRecordDao.save(record);
		}
	}

	// 文献引用
	@Override
	public JSONObject citation(JSONObject data) throws IOException {
		Citation ca = new Citation();
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String filePath = vconfig.getConfigValue("BOOKURL");
		String path = vconfig.getConfigValue("WATERURL");
		String uuid = StringOpt.produceUUID();
		String targetPath = path.concat(uuid).concat("/");
		// enw
		String srcenw = filePath.concat("EndNote.enw");
		String tarenw = targetPath.concat("EndNote.enw");
		ca.changeContent(srcenw, tarenw, data);
		File enwfile = new File(tarenw);
		if (!enwfile.exists() && !enwfile.isDirectory()) {
			throw new BusException("下载文件不存在！");
		}
		// net
		String srcnet = filePath.concat("NoteExpress.net");
		String tarnet = targetPath.concat("NoteExpress.net");
		ca.changeContent(srcnet, tarnet, data);
		File netfile = new File(tarnet);
		if (!netfile.exists() && !netfile.isDirectory()) {
			throw new BusException("下载文件不存在！");
		}
		// ris
		String srcris = filePath.concat("RefMan.ris");
		String tarris = targetPath.concat("RefMan.ris");
		ca.changeContent(srcris, tarris, data);
		File risfile = new File(tarris);
		if (!risfile.exists() && !risfile.isDirectory()) {
			throw new BusException("下载文件不存在！");
		}
		// txt
		String srctxt = filePath.concat("NoteFirst.txt");
		String tartxt = targetPath.concat("NoteFirst.txt");
		ca.changeContent(srctxt, tartxt, data);
		File txtfile = new File(tartxt);
		if (!txtfile.exists() && !txtfile.isDirectory()) {
			throw new BusException("下载文件不存在！");
		}
		//
		String srcbib = filePath.concat("BibTeX.bib");
		String tarbib = targetPath.concat("BibTeX.bib");
		ca.changeContent(srcbib, tarbib, data);
		File bibfile = new File(tarbib);
		if (!bibfile.exists() && !bibfile.isDirectory()) {
			throw new BusException("下载文件不存在！");
		}
		JSONObject root = new JSONObject();
		root.put("EndNote", uuid.concat("/" + enwfile.getName()));
		root.put("RefMan", uuid.concat("/" + risfile.getName()));
		root.put("NoteFirst", uuid.concat("/" + txtfile.getName()));
		root.put("NoteExpress", uuid.concat("/" + netfile.getName()));
		root.put("BibTeX", uuid.concat("/" + bibfile.getName()));
		return root;
	}

	@Override
	public JSONObject pageEntry(String bookid, Integer page, String type) {
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		sql.append("select TYPE,NAME FROM WXK_BOOKKEYCOUNT where BOOKID=?");
		sqlParas.addPara(bookid, Types.VARCHAR);
		sql.append(" and PAGE=?");
		sqlParas.addPara(page, Types.INTEGER);
		List<JSONObject> data = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
				readRows);
		if (StringUtils.isNotBlank(type) && type.equals("1")) {
			// 简体转换繁体
			ZHConverter converter = ZHConverter.getInstance(ZHConverter.TRADITIONAL);
			for (int i = 0; i < data.size(); i++) {
				String name = converter.convert(data.get(i).getString("NAME"));
				data.get(i).put("NAME", name);
			}

		}
		JSONObject root = new JSONObject();
		root.put("items", data);
		return root;
	}

	@Override
	public JSONObject getEntry(String name, String type) {
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		// 人物
		if (type.equals("01")) {
			sql.append(
					"select ID,JG,SEX,BIRTHDAY,DEADDAY,MAINBOOK from WXK_PEOPLE where CONCAT(LASTNAME,FIRSTNAME) like ? limit 1");
			sqlParas.addPara("%" + name + "%", Types.VARCHAR);
		}
		// 地理
		if (type.equals("02")) {
			sql.append("select SOURCENAME,BELONG,FWLJ,SETYEAR,ENDYEAR from WXK_GEOGRAPHY where NAME like ? limit 1");
			sqlParas.addPara("%" + name + "%", Types.VARCHAR);
		}
		// 机构
		if (type.equals("03")) {
			sql.append("select NAME as MAINBOOK from WXK_ORG where NAME=? limit 1");
			sqlParas.addPara(name, Types.VARCHAR);
		}
		// 职位
		if (type.equals("04")) {
			sql.append("select NAME as MAINBOOK from WXK_POST where NAME=? limit 1");
			sqlParas.addPara(name, Types.VARCHAR);
		}
		// 出版社
		if (type.equals("05")) {
			sql.append("select NAME as MAINBOOK from WXK_PUBLISHING where NAME=? limit 1");
			sqlParas.addPara(name, Types.VARCHAR);
		}
		List<JSONObject> data = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
				readRows);
		JSONObject res = null;
		if (type.equals("01")) {
			String main = "";
			if (data.size() > 0) {
				for (int i = 0; i < data.size(); i++) {
					main += peopleInfo(data.get(i));
				}
			}
			res = new JSONObject();
			res.put("MAINBOOK", "人物名称。" + main);
			return res;
		}
		if (type.equals("02")) {
			String main = "";
			if (data.size() > 0) {
				for (int i = 0; i < data.size(); i++) {
					main += geographyInfo(data.get(i));
				}
			}
			res = new JSONObject();
			res.put("MAINBOOK", "地名。" + main);
			return res;
		}
		return data.get(0);
	}

	@Override
	public JSONArray ZTtree() {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		sql.append("select a.ID,a.PID,a.ZTNAME as NAME,a.ZTSYMBOL as CODE");
		sql.append(" from WXK_ZTTYPE a where a.PID IS NULL ");
		sql.append(" order by convert(ID using gbk) ");
		String dosql = sql.toString();
		data = this.getJdbcTemplate().query(dosql, sqlParas.getVs(), sqlParas.getTypes(), readRows);
		JSONArray r = new JSONArray();
		r.addAll(data);
		return r;

	}

	// 人物信息
	public String peopleInfo(JSONObject data) {
		String sex = "";
		if (StringUtils.isNotBlank(data.getString("SEX"))) {
			sex = "性别：" + data.getString("SEX") + ";";
		}
		String mainbook = "";
		if (StringUtils.isNotBlank(data.getString("MAINBOOK"))) {
			mainbook = "主要著述：" + data.getString("MAINBOOK") + "。";
		}
		String jg = "";
		if (StringUtils.isNotBlank(data.getString("JG"))) {
			jg = "籍贯：" + data.getString("JG") + "; ";
		} else {
			jg = "籍贯：不详; ";
		}
		String birth = "";
		if (StringUtils.isNotBlank(data.getString("BIRTHDAY"))) {
			birth = "生年：" + data.getString("BIRTHDAY") + "; ";
		} else {
			birth = "生年：不详; ";
		}
		String dead = "";
		if (StringUtils.isNotBlank(data.getString("DEADDAY"))) {
			dead = "卒年：" + data.getString("DEADDAY") + ";";
		} else {
			dead = "卒年：不详;";
		}
		// 人物关系
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		sql.append(
				"SELECT  GROUP_CONCAT(`PEOPLE2ID`)as 'PEOPLE2ID',RELTYPE FROM WXK_PEOPLEREL where PEOPLE1ID=? group BY PEOPLE1ID,RELTYPE ");
		sqlParas.addPara(data.getString("ID"), Types.VARCHAR);
		List<JSONObject> reldata = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
				readRows);
		String rel = "";
		if (reldata.size() > 0) {
			for (int i = 0; i < reldata.size(); i++) {
				rel += reldata.get(i).getString("RELTYPE") + ":" + reldata.get(i).getString("PEOPLE2ID") + "; ";
			}
		}
		// 人物称呼
		StringBuffer zhsql = new StringBuffer();
		SqlParas sqlParas2 = new SqlParas();
		zhsql.append(
				"SELECT  GROUP_CONCAT(`NAME`)as 'NAME',NTYPE FROM WXK_OTHERNAME where PEOPLEID=? group BY PEOPLEID,NTYPE ");
		sqlParas2.addPara(data.getString("ID"), Types.VARCHAR);
		List<JSONObject> zhdata = this.getJdbcTemplate().query(zhsql.toString(), sqlParas2.getVs(),
				sqlParas2.getTypes(), readRows);
		String zh = "";
		if (zhdata.size() > 0) {
			for (int i = 0; i < zhdata.size(); i++) {
				zh += zhdata.get(i).getString("NTYPE") + ":" + zhdata.get(i).getString("NAME") + "; ";
			}
		}
		String main = sex + zh + "\n" + birth + dead + "\n" + jg + rel + "\n" + mainbook;
		return main;
	}

	// 地理信息
	public String geographyInfo(JSONObject data) {
		String old = "";
		if (StringUtils.isNotBlank(data.getString("SOURCENAME"))) {
			old = "原始名：" + data.getString("SOURCENAME") + ";";
		}
		String ls = "";
		if (StringUtils.isNotBlank(data.getString("BELONG"))) {
			ls = "隶属：" + data.getString("BELONG") + "; ";
		}
		String fw = "";
		if (StringUtils.isNotBlank(data.getString("FWLJ"))) {
			fw = "如今方位：" + data.getString("FWLJ") + "。 ";
		}
		String set = "";
		if (StringUtils.isNotBlank(data.getString("SETYEAR"))) {
			set = "设置年代：" + data.getString("SETYEAR") + "; ";
		} else {
			set = "设置年代：不详; ";
		}
		String end = "";
		if (StringUtils.isNotBlank(data.getString("ENDYEAR"))) {
			end = "废止年代：" + data.getString("ENDYEAR") + "; ";
		} else {
			end = "废止年代：不详; ";
		}
		String main = old + ls + set + end + "\n" + fw;
		return main;
	}

	@Override
	public JSONObject getCustomerForIp(String Ip) {
		// 保存访问记录
		String customerId = null;
		JSONObject j = new JSONObject();
		HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		JSONObject user = AuthFilterComm.getCurrentUser(req);
		if(user!=null) {
			j.put("USERID",user.getString("ID"));
			customerId = user.getString("TID");
		}
		j.put("USERIP", Ip);
		j.put("DATETIME", DateOpt.datetimeToStr(new Date()));
		if(null == customerId) {
			customerId = getCustomer(Ip);
		}
		j.put("CTMID", customerId);

		visitRecordDao.save(j);
		SqlParas para = new SqlParas();
		String sql = "select NAME as 'SCHOOLNAME',NICKNAME from CRM_CUSTOMER where ID=? ";
		para.addPara(customerId, Types.VARCHAR);
		List<JSONObject> data = this.getJdbcTemplate().query(sql.toString(), para.getVs(), para.getTypes(), readRows);
		JSONObject res = null;
		if (data.size() > 0 && data != null) {
			return data.get(0);
		} else {
			res = new JSONObject();
			res.put("SCHOOLNAME", "游客访问");
			res.put("NICKNAME", "游客访问");
		}
		return res;
	}

	@Override
	public JSONObject saveQuoteRecord(String iP, JSONObject data) {
		data.put("USERIP", iP);
		String customerId = getCustomer(iP);
		data.put("CTMID", customerId);
		data.put("USERID",getUserId());
		quoteRecordDao.save(data);
		return data;
	}

	@Override
	public String createQuote(String id, String type,String url) {
		String sql = "select * from WXK_BOOK2 where ID = '"+id+"'";
		JSONObject obj = this.getJdbcTemplate().query(sql, readRows).get(0);
		translateObj(obj);
		obj.put("URL", url);
		String fileName = QuoteModel.createQuote(obj, type);
		return fileName;
	}
	
	public void translateObj(JSONObject obj){
		String ZAUTHOR = obj.getString("ZAUTHOR");
		String CAUTHOR = obj.getString("CAUTHOR"); 
		String TITLE = obj.getString("TITLE");
		String BLTITLE = obj.getString("BLTITLE");
		String PAID = obj.getString("PAID");
		String PUBLISHINGID = obj.getString("PUBLISHINGID");
		obj.put("DOUBLEAUTHOR", getCompileStr(new String[]{ZAUTHOR,CAUTHOR}, ";"));
		obj.put("DOUBLEAUTHORAND", getCompileStr(new String[]{ZAUTHOR,CAUTHOR}, " and "));
		obj.put("DOUBLEAUTHORDOU", getCompileStr(new String[]{ZAUTHOR,CAUTHOR}, "，"));
		obj.put("DOUBLETITLE", getCompileStr(new String[]{TITLE,BLTITLE}, "："));
		obj.put("DOUBLEPUBLISH",  getCompileStr(new String[]{PAID,PUBLISHINGID}, "，"));
		
		obj.put("NOWTIME", QuoteModel.getPatternTime("yyyy-MM-dd HH:mm:ss"));
	}
	
	public static String getCompileStr(String[] str,String split){
		StringBuffer buff = new StringBuffer();
		for(String oneStr:str){
			if(StringUtils.isNotBlank(oneStr)){
				buff.append(oneStr+split);
			}
		}
		if(buff.length()>0){
			buff.delete(buff.length()-split.length(), buff.length());
		}
		return buff.toString();
	}

	@Override
	public JSONObject checkHasText() {
		DataCacheOpt.setex("checkHasText", 3600 * 24, "正在处理");
		JSONObject res = getJG();
		DataCacheOpt.setex("checkHasText", 3600 * 24, res.toJSONString());
		return res;
	}
	
	// 获取加工目录的
	public JSONObject getJG () {
		JSONObject returnObj = new JSONObject();
		String basePath = ConfigOpt.getConfigValue("BOOKURL");
		JSONArray piciList = getDir("JIAGONG");
		BookInfo bookinfo = new BookInfo();
		int hasNum_all = 0, noNum_all = 0;
		JSONArray arr = new JSONArray();
		for (int i = 0; i < piciList.size(); i++) {
			String onePici = piciList.getString(i);
			File onePiciFile = new File(basePath + onePici);
			JSONObject onePiciObj = new JSONObject();
			int hasNum = 0, noNum = 0;
			if (onePiciFile.isDirectory()) {
				// 是一本书
				System.out.println("批次：" + onePici);
				File[] listFile = onePiciFile.listFiles();
				for (int j = 0; j < listFile.length; j++) {
					File oneFile = listFile[j];
					if (oneFile.isDirectory()) {
						boolean has = bookinfo.hasText(onePici + File.separator + oneFile.getName());
						if (has) {
							hasNum += 1;
							hasNum_all += 1;
						} else {
							noNum += 1;
							noNum_all += 1;
						}
					}
				}
			}
			onePiciObj.put(onePici, hasNum + "/" +  (hasNum + noNum));
			arr.add(onePiciObj);
		}
		returnObj.put("所有书本", hasNum_all + noNum_all);
		returnObj.put("有文本", hasNum_all);
		returnObj.put("无文本", noNum_all);
		returnObj.put("细节", arr);
		returnObj.put("success", true);
		return returnObj;
	}
	
	
	// 获取已发布的
	public JSONObject getPublished () {
		JSONObject returnObj;
		try {
			BookInfo bookinfo = new BookInfo();
			// 获取所有批次
			JSONArray arr = new JSONArray();
			String queryBatchSql = "SELECT ID,BATID FROM WXK_MAKEID";
			List<JSONObject> batchList = this.getJdbcTemplate().query(queryBatchSql, readRows);
			System.out.println(batchList);
			int hasNum_all = 0, noNum_all = 0;
			for (int i = 0; i < batchList.size(); i++ ) {
				JSONObject onePici = new JSONObject();
				String batId = batchList.get(i).getString("ID");
				String piciName = batchList.get(i).getString("BATID");
				onePici.put("批次名称", piciName);
				String bookSql = "SELECT BOOKDIR FROM WXK_BOOK WHERE BATID = '"+batId+"'";
				List<JSONObject> bookList = this.getJdbcTemplate().query(bookSql, readRows);
				System.out.println("bookList:" + bookList);
				int hasNum = 0, noNum = 0;
				for (int j = 0; j < bookList.size(); j++) {
					String bookdir = bookList.get(j).getString("BOOKDIR");
					System.out.println("bookdir:" + bookdir);
					boolean has = bookinfo.hasText(bookdir);
					if (has) {
						hasNum += 1;
						hasNum_all += 1;
					} else {
						noNum += 1;
						noNum_all += 1;
					}
				}
				onePici.put("书本数量", hasNum + noNum);
				onePici.put("有文本", hasNum);
				onePici.put("无文本", noNum);
				arr.add(onePici);
			}
			returnObj = new JSONObject();
			returnObj.put("所有书本", hasNum_all + noNum_all);
			returnObj.put("有文本", hasNum_all);
			returnObj.put("无文本", noNum_all);
			returnObj.put("细节", arr);
			returnObj.put("success", true);
			return returnObj;
		} catch (DataAccessException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public JSONArray getDir(String dir) {
		Config config = ServiceFactory.getInstance().getConfig();
		String url = config.getConfigValue(dir);
		File file = new File(url);
		File[] files = file.listFiles();
		JSONArray arr = new JSONArray();
		List<String> list = new ArrayList<>();
		for(int i=0;i<files.length;i++){
			if(files[i].isDirectory()){
				list.add(files[i].getName());
			}
		}
		Collections.sort(list);
		arr.addAll(list);
		return arr;
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
}
