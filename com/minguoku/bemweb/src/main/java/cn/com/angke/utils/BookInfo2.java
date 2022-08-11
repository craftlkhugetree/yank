package cn.com.angke.utils;

import java.io.File;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.DocumentException;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.config.service.Config;
import com.somenew.db.DbOpt;
import com.somenew.service.ServiceFactory;
import com.spreada.utils.chinese.ZHConverter;

/**
 * @author YiT
 * @date 2018年1月5日
 * 
 */
public class BookInfo2 {
	private String filePath;
	private String endPath = "/scanpic/m/";

	public BookInfo2() {
		Config vconfig = ServiceFactory.getInstance().getConfig();
		filePath = vconfig.getConfigValue("BOOKURL");
	}

	public static String big5ToChinese(String s) {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		return converter.convert(s);
	}

	public static String ChineseTobig5(String s) {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.TRADITIONAL);
		return converter.convert(s);
	}

	public JSONObject getBook(String fileName) throws Exception {
//		List<JSONObject> bookList = getBookList();
//		System.out.println("当前cnmarc数据："+bookList.size());
//		JSONObject book = null;
		String code = null;
//		if (fileName.contains("-")) {
//			code = fileName.split("-")[0];
//		}
		//modify by Liang  取消原来4位或5位扫描编码，统一改成六位扫描编码
//		if (fileName.contains("D") || fileName.contains("G")) {
//			code = fileName.substring(0, 5);
//		} else {
//			code = fileName.substring(0, 4);
//		}
		code = fileName.substring(0, 6);
		return this.getBookByCode(code);
//		for (int i = 0; i < bookList.size(); i++) {
//			book = bookList.get(i);
//			if (StringUtils.isNotBlank(book.getString("CODE")) && code.equals(book.getString("CODE"))) {
//				System.out.println(code+"==============="+book.getString("CODE")+book.getString("TITLE"));
//				return book;
//			}
//		}
//		return null;
	}

	public JSONObject getBookInfo(String fileName, String BATID) throws Exception {
		JSONObject json = new JSONObject();
		JSONObject book = getBook(fileName);//单条WXK_BOOK_CNMARC
		String authName = "";
		json.put("BATID", BATID);
		json.put("BOOKID", book.getString("BOOKID"));
		json.put("TITLE", big5ToChinese(book.getString("TITLE")));
		if (StringUtils.isNotBlank(book.getString("ZTTYPEID"))) {
			json.put("ZTTYPEID", big5ToChinese(book.getString("ZTTYPEID")));
		}
		if (StringUtils.isNotBlank(book.getString("EDUTYPEID"))) {
			json.put("EDUTYPEID", big5ToChinese(book.getString("EDUTYPEID")));
		}
		if (StringUtils.isNotBlank(book.getString("PAID"))) {
			json.put("PAID", big5ToChinese(book.getString("PAID")));
		}
		if (StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			json.put("PUBLISHINGID", big5ToChinese(book.getString("PUBLISHINGID")));
		}
		if (StringUtils.isNotBlank(book.getString("DATE"))) {
			json.put("DATE", big5ToChinese(book.getString("DATE")));
		}
		json.put("PAGECOUNT", book.getString("PAGECOUNT"));
		json.put("HEIGHT", book.getString("HEIGHT"));
		if (StringUtils.isNotBlank(book.getString("SERIES"))) {
			json.put("SERIES", book.getString("SERIES"));
		}
		if (StringUtils.isNotBlank(book.getString("TEXTNOTE"))) {
			json.put("TEXTNOTE", big5ToChinese(book.getString("TEXTNOTE")));
		}
		if (StringUtils.isNotBlank(book.getString("CONTENTNOTE"))) {
			json.put("CONTENTNOTE", book.getString("CONTENTNOTE"));
		}
		// 作者
		if (StringUtils.isNotBlank(book.getString("ZAUTHOR1"))) {
			authName += book.getString("ZAUTHOR1") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("CAUTHOR1"))) {
			authName += book.getString("CAUTHOR1") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("ZAUTHOR2"))) {
			authName += book.getString("ZAUTHOR2") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("CAUTHOR2"))) {
			authName += book.getString("CAUTHOR2") + ",";
		}
		if (StringUtils.isNotBlank(authName)) {
			authName = authName.substring(0, authName.length() - 1);
		}
		json.put("AUTHOR", big5ToChinese(authName));
		// 关键词
		String Tags = "";
		// 个人名称主题
		if (StringUtils.isNotBlank(book.getString("GRMCZT"))) {
			Tags += book.getString("GRMCZT") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("XKFF"))) {
			Tags += book.getString("XKFF") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("DQFF"))) {
			Tags += book.getString("DQFF") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("NDFF"))) {
			Tags += book.getString("NDFF") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("XSFF"))) {
			Tags += book.getString("XSFF") + ",";
		}
		// 学科名称主题
		if (StringUtils.isNotBlank(book.getString("XKMCZT"))) {
			Tags += book.getString("XKMCZT") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("XKFF2"))) {
			Tags += book.getString("XKFF2") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("DQFF2"))) {
			Tags += book.getString("DQFF2") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("NDFF2"))) {
			Tags += book.getString("NDFF2") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("XSFF2"))) {
			Tags += book.getString("XSFF2") + ",";
		}
		// 地理名称主题
		if (StringUtils.isNotBlank(book.getString("DLMCZT"))) {
			Tags += book.getString("DLMCZT") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("XKFF3"))) {
			Tags += book.getString("XKFF3") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("DQFF3"))) {
			Tags += book.getString("DQFF3") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("NDFF3"))) {
			Tags += book.getString("NDFF3") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("XSFF3"))) {
			Tags += book.getString("XSFF3") + ",";
		}
		if (StringUtils.isNotBlank(Tags))
			Tags = Tags.substring(0, Tags.length() - 1);
		json.put("TAGS", big5ToChinese(Tags));
		return json;
	}

	public JSONArray getCreator(String fileName) throws Exception {
		JSONArray array = new JSONArray();
		JSONObject book = getBook(fileName);
		JSONObject json1 = new JSONObject();
		JSONObject json2 = new JSONObject();
		JSONObject json3 = new JSONObject();
		JSONObject json4 = new JSONObject();
		if (StringUtils.isNotBlank(book.getString("ZAUTHOR1"))) {
			json1.put("NAME", book.getString("ZAUTHOR1"));
			json1.put("ROLETYPE", "著");
			json1.put("CTYPE", "个人");
			array.add(json1);
		}
		if (StringUtils.isNotBlank(book.getString("CAUTHOR1"))) {
			json1.put("NAME", book.getString("CAUTHOR1"));
			json1.put("ROLETYPE", "著");
			json1.put("CTYPE", "个人");
			array.add(json2);
		}
		if (StringUtils.isNotBlank(book.getString("ZAUTHOR2"))) {
			json1.put("NAME", book.getString("ZAUTHOR2"));
			json1.put("ROLETYPE", "著");
			json1.put("CTYPE", "团体");
			array.add(json3);
		}
		if (StringUtils.isNotBlank(book.getString("CAUTHOR2"))) {
			json1.put("NAME", book.getString("CAUTHOR2"));
			json1.put("ROLETYPE", "著");
			json1.put("CTYPE", "团体");
			array.add(json4);
		}
		return array;
	}

	public JSONObject getDescribe(String fileName, String dir) throws Exception {
		JSONObject jsonObject = new JSONObject();
		JSONObject book = getBook(fileName);
		String authName = "";
//		if (StringUtils.isNotBlank(book.getString("ZAUTHOR1"))) {
//			authName += book.getString("ZAUTHOR1") + ",";
//		}
//		if (StringUtils.isNotBlank(book.getString("CAUTHOR1"))) {
//			authName += book.getString("CAUTHOR1") + ",";
//		}
//		if (StringUtils.isNotBlank(book.getString("ZAUTHOR2"))) {
//			authName += book.getString("ZAUTHOR2") + ",";
//		}
//		if (StringUtils.isNotBlank(book.getString("CAUTHOR2"))) {
//			authName += book.getString("CAUTHOR2") + ",";
//		}
		
		if (StringUtils.isNotBlank(book.getString("ZAUTHOR"))) {
			authName += book.getString("ZAUTHOR") + ",";
		}
		if (StringUtils.isNotBlank(book.getString("CAUTHOR"))) {
			authName += book.getString("CAUTHOR") + ",";
		}
		if (StringUtils.isNotBlank(authName)) {
			authName = authName.substring(0, authName.length() - 1);
		}
		
		
		jsonObject.put("AUTHOR", big5ToChinese(authName));
		jsonObject.put("BOOKIMG", "scanpic/s/0001.png");
		if (StringUtils.isNotBlank(book.getString("ZTTYPEID"))) {
			jsonObject.put("ZTTYPEID", book.getString("ZTTYPEID"));
		}
		if (StringUtils.isNotBlank(book.getString("EDUTYPEID"))) {
			jsonObject.put("EDUTYPEID", book.getString("EDUTYPEID"));
		}
		jsonObject.put("FILEPATH", dir);
		if (StringUtils.isNotBlank(book.getString("DATE"))) {
			jsonObject.put("CREATEYEAR", big5ToChinese(book.getString("DATE")));
		}
		if (StringUtils.isNotBlank(book.getString("PUBLISHINGID"))) {
			jsonObject.put("HOLDER", big5ToChinese(book.getString("PUBLISHINGID")));
		}
		if (StringUtils.isNotBlank(book.getString("PAID"))) {
			jsonObject.put("ADDRESS", big5ToChinese(book.getString("PAID")));
		}
		jsonObject.put("TITLE", big5ToChinese(book.getString("TITLE")));
		jsonObject.put("ID", book.getString("BOOKID"));
		jsonObject.put("PAGECOUNT", getMaxName(dir));
		if (StringUtils.isNotBlank(book.getString("CONTENTNOTE"))) {
			jsonObject.put("BOOKDETAIL", big5ToChinese(book.getString("CONTENTNOTE")));
		}
		
		String[] str = new String[]{"BLTITLE","OTITLE","FTITLE","ZAUTHOR","CAUTHOR","BB","PAID","PUBLISHINGID","DATE",
				"JHX","SERIES","CONTENTNOTE","SUMMARY","ZTCC"};
		this.pushObj(str, book, jsonObject);
		
		return jsonObject;
	}
	
	public void pushObj(String[] str,JSONObject oldObj,JSONObject newObj){
		for(int i=0;i<str.length;i++){
			String column = str[i];
			if(StringUtils.isNotBlank(oldObj.getString(column))){
				newObj.put(column, oldObj.getString(column));
			}
		}
	}
	
	public JSONArray getTag(String dir) throws DocumentException {
		JSONArray array = new JSONArray();
		return array;
	}

	public List<JSONObject> getBookList() throws Exception {
		List<JSONObject> data = DbOpt.getInstance().query(null, "WXK_BOOK_CNMARC", null);
		return data;
	}

	public JSONObject getBookByCode(String code) throws Exception {
		String sql = "select * from WXK_BOOK_CNMARC where CODE='"+code+"'";
		List<JSONObject> data = DbOpt.getInstance().getJdbcTemplate().query(sql, DbOpt.readRows);
		if (data.size() == 0) System.out.println("========================================>"+code);
		if (data.size()>0) return data.get(0);
		else return null;
	}

	public int getMaxName(String dir) {
		String[] str = { "jpg", "gif", "png", "jpeg" };
		int i, max;
		try {
			File f = new File(filePath.concat(dir).concat(endPath));
			if (!f.exists()) {
				return 0;
			}
			File fa[] = f.listFiles();
			System.out.println(filePath.concat(dir).concat(endPath));
			max = Integer.valueOf(getFileNameNoEx(fa[0].getName()));
			for (i = 0; i < fa.length; i++) {
				File fs = fa[i];
				if (!fs.isDirectory()) {
					// 过滤非图片
					String fileType = fa[i].getName().substring(fa[i].getName().lastIndexOf('.') + 1,
							fa[i].getName().length());
					for (int t = 0; t < str.length; t++) {
						if (str[t].equals(fileType.toLowerCase())) {
							if (Integer.valueOf(getFileNameNoEx(fa[i].getName())) > max) // 判断最大值
								max = Integer.valueOf(getFileNameNoEx(fa[i].getName()));
						}
					}

				}
			}
		} catch (Exception e) {
			max = 0;
		}
		return max;
	}

	public String getFileNameNoEx(String filename) {
		filename=filename.replace("-", "");
		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('.');
			if ((dot > -1) && (dot < (filename.length()))) {
				return filename.substring(0, dot);
			}
		}
		return filename;
	}

	public static void main(String[] args) throws Exception {
		BookInfo2 info = new BookInfo2();
		JSONObject j = info.getBookInfo("D0003空大鼓-第3版", "");
		System.out.println(j);
	}
}
