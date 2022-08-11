package cn.com.angke.books;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.config.service.Config;
import com.somenew.db.DbOpt;
import com.somenew.service.ServiceFactory;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.utils.BookInfo2;

public class BookWrite {

	// private String filePath = "/root/mgk/mgk/Books";
	private String filePath;
	private String fileName = "/docbook/main.xml";

	private String zj;
	private String page;
	private String vpage;
	private String zttype;
	private String edutype;
	private StringBuffer sbContent;

	private LuceneWrite lunceneWrite;
	private BookInfo bookInfo;
	private BookInfo2 bookInfo2;
	private static BookWrite bookWrite = new BookWrite();

	public BookWrite() {
		lunceneWrite = new LuceneWrite();
		bookInfo = new BookInfo();
		bookInfo2 = new BookInfo2();
		Config vconfig = ServiceFactory.getInstance().getConfig();
		filePath = vconfig.getConfigValue("BOOKURL");
	}

	/** 返回一个单例 **/
	public static BookWrite instance() {
		return bookWrite;
	}

	public static String big5ToChinese(String s) {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		return converter.convert(s);
	}

	public static String ChineseTobig5(String s) {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.TRADITIONAL);
		return converter.convert(s);
	}

	/**
	 * 根据dir获取文件
	 * 
	 * @param dir
	 * @return
	 */
	public File getFile(String dir) {
		File file = new File(filePath.concat(dir));
		if (!file.exists() && !file.isDirectory()) {
			return null;
		} else {
			return file;
		}

	}

	/**
	 * 判断当前文件名是否符合文件要求
	 * 
	 * @param name
	 * @return
	 */
	public boolean IsValidType(String name) {
		if (name.equals("main.xml")) {
			return true;
		} else {
			return false;
		}
	}

	public void create(String dir) throws IOException, DocumentException {
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		String id = root.attributeValue("id");

		JSONObject ztype = bookInfo.getCLC(dir);
		String ztType = ztype.getString("ZTTYPEID");
		String ztType2="";
		if (StringUtils.isNotBlank(ztType)) {
			if (StringUtils.isNotBlank(getFTYPE(ztType))) {
				ztType2 = getFTYPE(ztType);
			}
		}
		JSONObject etype = bookInfo.getSubject(dir);
		String eduType = etype.getString("EDUTYPEID");
		JSONObject book = bookInfo.getInfo(dir, null);
		String title = book.getString("TITLE");
		String publish = book.getString("PUBLISHINGID");
		String address = book.getString("PAID");
		String pubdate = book.getString("DATE");
		String series = book.getString("SERIES");
		String tags = book.getString("TAGS");
		JSONObject auth = bookInfo.getDescribe(dir);
		String author = "";
		if (StringUtils.isNotBlank(auth.getString("AUTHOR")) && auth != null) {
			author = auth.getString("AUTHOR");
		}

		String content = bookInfo.getContent(root);
		lunceneWrite.start();
		lunceneWrite.analyze(id, dir, ztType,ztType2, eduType, title, publish, address, pubdate, series, tags, author, content);
		lunceneWrite.close();
	}

	public String getFTYPE(String zttype) {
		JSONObject wheredata = new JSONObject();
		wheredata.put("ZTSYMBOL", zttype);
		List<JSONObject> data = DbOpt.getInstance().queryByWhere(null, "WXK_ZTTYPE", new String[] { "ID", "ZTSYMBOL" },
				"ZTSYMBOL=?", wheredata, new String[] { "ZTSYMBOL" });
		if (data != null && data.size() > 0) {
			String fid = data.get(0).getString("ID").substring(0, 3);
			JSONObject fwheredata = new JSONObject();
			fwheredata.put("ID", fid);
			List<JSONObject> fdata = DbOpt.getInstance().queryByWhere(null, "WXK_ZTTYPE",
					new String[] { "ID", "ZTSYMBOL" }, "ID=?", fwheredata, new String[] { "ID" });
			if (fdata != null && fdata.size() > 0) {
				String ftype = fdata.get(0).getString("ZTSYMBOL");
				return ftype;
			}
		}
		return null;
	}

	public void create3(String FileName, String dir, String BATID) throws Exception {
		JSONObject book = bookInfo2.getBook(FileName);
		String id = book.getString("BOOKID");
		String ztType = "";
		String ztType2 = "";
		if (StringUtils.isNotBlank(book.getString("ZTTYPEID"))) {
			ztType = book.getString("ZTTYPEID");
			if (StringUtils.isNotBlank(getFTYPE(ztType))) {
				ztType2 = getFTYPE(ztType);
			}
		}
		String eduType = "";
		if (StringUtils.isNotBlank(book.getString("EDUTYPEID"))) {
			eduType = book.getString("EDUTYPEID");
		}
		String title = book.getString("TITLE");
		String publish = "";
		if (StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			publish = book.getString("PUBLISHINGID");
		}
		String address = "";
		if (StringUtils.isNotBlank(book.getString("PAID"))) {
			address = book.getString("PAID");
		}
		String pubdate = "";
		if (StringUtils.isNotBlank(book.getString("DATE"))) {
			pubdate = book.getString("DATE");
		}
		String series = "";
		if (StringUtils.isNotBlank(book.getString("SERIES"))) {
			series = book.getString("SERIES");
		}
		JSONObject auth = bookInfo2.getBookInfo(FileName, BATID);
		String author = "";
		if (StringUtils.isNotBlank(auth.getString("AUTHOR")) && auth != null) {
			author = auth.getString("AUTHOR");
		}
		String tags = "";
		if (StringUtils.isNotBlank(auth.getString("TAGS")) && auth != null) {
			tags = auth.getString("TAGS");
		}
		String content = "";
		lunceneWrite.start();
		lunceneWrite.analyze(id, dir,ztType ,ztType2, eduType, title, publish, address, pubdate, series, tags, author, content);
		lunceneWrite.close();
	}

	public void cerateIndex(String dir) throws IOException, DocumentException {
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		this.zj = "zj_0";
		this.page = "1";

		// 获取中图法分类
		JSONObject type = bookInfo.getCLC(dir);
		this.zttype = type.getString("ZTTYPEID");
		// 获取学科分类
		JSONObject edu = bookInfo.getSubject(dir);
		this.edutype = edu.getString("EDUTYPEID");
		String id = root.attributeValue("id");
		lunceneWrite.start();
		getNodes(id, dir, root);
		// series 丛书
		JSONObject book = bookInfo.getInfo(dir, null);
		String series = book.getString("SERIES");
		if (StringUtils.isNotBlank(series)) {
			lunceneWrite.analyze(id, dir, zj, page, vpage, zttype, "series", big5ToChinese(series));
		}
		// author 作者
		JSONArray creators = bookInfo.getCreator(dir);
		if (creators != null && creators.size() > 0) {
			for (int i = 0; i < creators.size(); i++) {
				String name = creators.getJSONObject(i).getString("NAME");
				lunceneWrite.analyze(id, dir, zj, page, vpage, zttype, "author", big5ToChinese(name));
			}
		}
		// 中图法
		if (StringUtils.isNotBlank(zttype)) {
			if (StringUtils.isNotBlank(getFTYPE(zttype))) {
				zttype = getFTYPE(zttype);
			}
			lunceneWrite.analyze(id, dir, zj, page, vpage, zttype, "zttype", zttype);
		}
		// 学科
		if (StringUtils.isNotBlank(edutype)) {
			lunceneWrite.analyze(id, dir, zj, page, vpage, zttype, "edutype", edutype);
		}
		lunceneWrite.close();
	}

	@SuppressWarnings("unchecked")
	public void getNodes(String id, String dir, Element node) throws IOException {
		String nodeName = node.getName().trim();
		if (nodeName.equals("pagenumber")) {
			page = node.attributeValue("pagenum").trim();
			vpage = node.attributeValue("vpagenum").trim();
		} else if (nodeName.equals("chapter") || nodeName.equals("part") || nodeName.equals("section")) {
			if (node.attributeValue("id").trim() != null) {
				zj = node.attributeValue("id").trim();
			}
		} else if (nodeName.equals("title") || nodeName.equals("para") || nodeName.equals("titleabbrev")
				|| nodeName.equals("subtitle") || nodeName.equals("emphasis") || nodeName.equals("abstract")
				|| nodeName.equals("year") || nodeName.equals("holder") || nodeName.equals("keyword")
				|| nodeName.equals("pubdate") || nodeName.equals("publishername") || nodeName.equals("address")
				|| nodeName.equals("date") || nodeName.equals("revremark") || nodeName.equals("seriesvolnums")
				|| nodeName.equals("endissuedate") || nodeName.equals("firstissuedate")
				|| nodeName.equals("collectionname")) // 判断哪些内容可以做索引
		{
			String content = node.getTextTrim();
			if (!((content == null) || (content.equals(""))))
				lunceneWrite.analyze(id, dir, zj, page, vpage, zttype, nodeName, big5ToChinese(content));
		}

		List<Element> listElement = node.elements();
		for (Element e : listElement) {
			this.getNodes(id, dir, e);
		}
	}

	public void create2(String dir) throws IOException, DocumentException {
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		this.zj = "zj_1";
		this.page = "1";
		this.vpage = "1";
		sbContent = new StringBuffer();
		String id = root.attributeValue("id");
		lunceneWrite.start();
		getNodes2(id, dir, root);
		lunceneWrite.close();
	}

	@SuppressWarnings("unchecked")
	public void getNodes2(String id, String dir, Element node) throws IOException {

		String nodeName = node.getName().trim();
		if (nodeName.equals("pagenumber")) {
			if (!page.equals(node.attributeValue("pagenum").trim())) {
				String content = sbContent.toString();
				lunceneWrite.analyze(id, dir, zj, page, vpage, nodeName, content);
				page = node.attributeValue("pagenum").trim();
				vpage = node.attributeValue("vpagenum").trim();
				sbContent = new StringBuffer();
			}
		} else if (nodeName.equals("chapter") || nodeName.equals("part") || nodeName.equals("section")) {
			if (node.attributeValue("id")!= null) {
				if (!zj.equals(node.attributeValue("id").trim())) {
					String content = sbContent.toString();
					lunceneWrite.analyze(id, dir, zj, page, vpage, nodeName, content);
					zj = node.attributeValue("id").trim();
					sbContent = new StringBuffer();
				}
			}
		} else if (nodeName.equals("title") || nodeName.equals("para") || nodeName.equals("titleabbrev")
				|| nodeName.equals("subtitle") || nodeName.equals("emphasis") || nodeName.equals("abstract")
				|| nodeName.equals("year") || nodeName.equals("holder") || nodeName.equals("keyword")
				|| nodeName.equals("pubdate") || nodeName.equals("publishername") || nodeName.equals("address")
				|| nodeName.equals("date") || nodeName.equals("revremark") || nodeName.equals("seriesvolnums")
				|| nodeName.equals("endissuedate") || nodeName.equals("firstissuedate")
				|| nodeName.equals("collectionname")) // 判断哪些内容可以做索引
		{
			String content = node.getTextTrim();
			if (!((content == null) || (content.equals(""))))
				sbContent.append(big5ToChinese(content));
			// lunceneWrite.analyze(id, dir, zj, page, vpage, nodeName,
			// big5ToChinese(content));
		}

		List<Element> listElement = node.elements();
		for (Element e : listElement) {
			this.getNodes2(id, dir, e);
		}
	}

	public void remove(String bookID) throws IOException {
		lunceneWrite.start();
		lunceneWrite.delete(bookID);
		lunceneWrite.close();
	}

	public void removeAll() throws IOException {
		lunceneWrite.start();
		lunceneWrite.deleteAll();
		lunceneWrite.close();
	}

}
