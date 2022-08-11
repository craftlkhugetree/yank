package cn.com.angke.books;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.config.service.Config;
import com.somenew.service.ServiceFactory;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.utils.excel.StringUtil;

public class BookInfo {

	// private String filePath="/root/mgk/mgk/Books";
	private String filePath;
	private String endPath = "/scanpic/m/";
	private String fileName = "/docbook/main.xml";

	public BookInfo() {
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

	public Boolean isExist(String dir) {
		File file = new File(filePath.concat(dir).concat(fileName));
		if (!file.exists() && !file.isDirectory()) {
			return false;
		} else {
			return true;
		}
	}

	@SuppressWarnings("unchecked")
	public JSONObject getInfo(String dir, String batID) throws DocumentException {
		JSONObject json = new JSONObject();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
//		String id = root.attributeValue("id");
		//D:/fileupload/mgk/jiagong/C002_00_HW20170825/000101南洋旅行漫记
		String[] idHead = dir.split("/");
		String id = idHead[idHead.length-1].replaceAll("[^0-9]*", "");
		System.out.println(id);
		Node node = root.selectSingleNode("./info/title");
		if (node != null)
			json.put("TITLE", big5ToChinese(node.getText().trim()));
		node = root.selectSingleNode("./info/publisher/address");
		if (node != null)
			json.put("PAID", big5ToChinese(node.getText().trim()));
		node = root.selectSingleNode("./info/publisher/publishername");
		if (node != null)
			json.put("PUBLISHINGID", big5ToChinese(node.getText().trim()));
		node = root.selectSingleNode("./info/pubdate");
		if (node != null)
			json.put("DATE", big5ToChinese(node.getText().trim()));
		if (node != null)
			node = root.selectSingleNode("./info/eletotalcount");
		if (node != null && StringUtils.isNotBlank(node.getText().trim()))
			json.put("PAGECOUNT", Integer.parseInt(node.getText().trim()));
		else
			json.put("PAGECOUNT", getMaxName(dir));
		node = root.selectSingleNode("./info/height");
		if (node != null && StringUtils.isNotBlank(node.getText().trim()))
			json.put("HEIGHT", Integer.parseInt(node.getText().trim()));
		node = root.selectSingleNode("./info/width");
		if (node != null && StringUtils.isNotBlank(node.getText().trim()))
			json.put("WIDTH", Integer.parseInt(node.getText().trim()));
		node = root.selectSingleNode("./info/series/title");
		if (node != null)
			json.put("SERIES", big5ToChinese(node.getText().trim()));

		node = root.selectSingleNode("./info/revhistory/revision/revremark");
		if (node != null)
			json.put("TEXTNOTE", big5ToChinese(node.getText().trim()));
		node = root.selectSingleNode("./info/abstract");
		if (node != null)
			json.put("CONTENTNOTE", big5ToChinese(node.getText().trim()));
		node = root.selectSingleNode("./info/booktype");
		if (node != null)
			json.put("BTYPE", big5ToChinese(node.getText().trim()));
		node = root.selectSingleNode("./info/language");
		if (node != null)
			json.put("BLANGUAGE", big5ToChinese(node.getText().trim()));
		String authName = "";
		List<Element> aulist = root.element("info").element("authorgroup").elements("author");
		for (Element node2 : aulist) {
			String role = node2.element("personname").attributeValue("role");
			if (role.equals("著")) {
				authName = node2.element("personname").element("firstname").getTextTrim()
						+ node2.element("personname").element("surname").getTextTrim();
			}
		}
		json.put("AUTHOR", big5ToChinese(authName));
		json.put("BOOKDIR", dir);
		json.put("BATID", batID);
		json.put("BOOKID", id);

		String tagWord = "";
		List<Element> list = root.selectNodes(".//keyword");
		for (Element tag : list) {
			if (tagWord.equals(""))
				tagWord = big5ToChinese(tag.getText());
			else
				tagWord.concat(" ").concat(big5ToChinese(tag.getText()));
		}
		json.put("TAGS", tagWord);
		return json;

	}

	/**
	 * @describe 获取图书中图法分类
	 * @param filePath
	 * @param batID
	 * @return
	 */
	public JSONObject getCLC(String dir) throws DocumentException {

		JSONObject json = new JSONObject();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		String id = root.attributeValue("id");
		String role = root.element("info").element("classification").attribute("role").getText().trim();
		role = big5ToChinese(role);
		String type = root.element("info").element("classification").getText().trim();

		if (role.equals("中图法")) {
			json.put("ZTTYPEID", type);
			json.put("BOOKID", id);
		}

		return json;
	}

	/**
	 * @describe 获取图书学科分类
	 * @param filePath
	 * @param batID
	 * @return
	 */
	public JSONObject getSubject(String dir) throws DocumentException {

		JSONObject json = new JSONObject();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		String id = root.attributeValue("id");
		String role = root.element("info").element("classification").attribute("role").getText().trim();
		role = big5ToChinese(role);
		String type = root.element("info").element("classification").getText().trim();

		if (!role.equals("中图法")) {
			json.put("EDUTYPEID", type);
			json.put("BOOKID", id);
		}

		return json;
	}

	/**
	 * @desc 获取图书自定义标签
	 * @param filePath
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public JSONArray getTag(String dir) throws DocumentException {
		JSONArray array = new JSONArray();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		String id = root.attributeValue("id");

		List<Element> list = root.selectNodes(".//keyword");
		for (Element tag : list) {
			JSONObject json = new JSONObject();
			json.put("id", id);
			json.put("NAME", big5ToChinese(tag.getText()));

			array.add(json);
		}
		return array;
	}

	/**
	 * @描述：获取图书编写校撰人员信息
	 * @param filePath
	 * @return JSONArray
	 */
	@SuppressWarnings("unchecked")
	public JSONArray getCreator(String dir) throws DocumentException {

		JSONArray array = new JSONArray();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();

		root = root.element("info").element("authorgroup");
		List<Element> list = root.selectNodes(".//author");
		for (Element node : list) {
			JSONObject json = new JSONObject();
			String role = node.element("personname").attributeValue("role");
			String name = node.element("personname").element("firstname").getText()
					+ node.element("personname").element("surname").getText();
			json.put("NAME", big5ToChinese(name));
			json.put("ROLETYPE", big5ToChinese(role));
			if (node.element("personname").element("orgname") == null)
				json.put("CTYPE", "个人");
			else
				json.put("CTYPE", "团体");
			array.add(json);
		}
		return array;
	}

	/**
	 * @desc 获取出版社信息
	 * @param filePath
	 * @return
	 */
	public JSONObject getPublishing(String dir) throws DocumentException {
		JSONObject json = null;
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		Element node = root.element("info").element("copyright").element("holder");
		if (node != null) {
			json = new JSONObject();
			json.put("ID", root.attributeValue("id"));
			json.put("HOLDER", node.getTextTrim());
		}
		return json;
	}

	/**
	 * @desc 获取图书馆藏信息
	 * @param filePath
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public JSONArray getCollection(String dir) throws DocumentException {
		JSONArray array = new JSONArray();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		String id = root.attributeValue("id");

		Element element = root.element("info");
		List<Element> list = element.selectNodes(".//collection");
		for (Element node : list) {
			JSONObject json = new JSONObject();
			json.put("BOOKID", id);
			json.put("LIBRARYID", big5ToChinese(node.element("collectionname").getTextTrim()));
			array.add(json);
		}
		return array;
	}

	@SuppressWarnings("unchecked")
	public JSONObject getDescribe(String dir) throws DocumentException {
		JSONObject jsonObject = new JSONObject();

		String authName = "";
		StringBuffer name = new StringBuffer();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		List<Element> list = root.element("info").element("authorgroup").elements("author");
		for (Element node : list) {
			authName = node.element("personname").element("firstname").getTextTrim()
					+ node.element("personname").element("surname").getTextTrim();
			if (StringUtils.isNotBlank(authName)) {
				name.append(authName).append(",");
			}
		}

		jsonObject.put("BOOKIMG", "scanpic/s/0001.png");
		jsonObject.put("FILEPATH", filePath.concat(dir).trim());
		jsonObject.put("CREATEYEAR", big5ToChinese(root.selectSingleNode("./info/copyright/year").getText().trim()));
		jsonObject.put("BOOKCATEGORY", big5ToChinese(root.selectSingleNode("./info/booktype").getText().trim()));
		if (StringUtils.isNotBlank(name)) {
			jsonObject.put("AUTHOR", name.toString().substring(0, name.toString().length() - 1));
		}else{
			jsonObject.put("AUTHOR", authName);
		}
		jsonObject.put("HOLDER",
				big5ToChinese(root.element("info").element("copyright").element("holder").getTextTrim()));
		jsonObject.put("TITLE", big5ToChinese(root.selectSingleNode("./info/title").getText().trim()));
		jsonObject.put("ID", root.attributeValue("id").trim());
		if (root.selectSingleNode("./info/eletotalcount") != null
				&& StringUtils.isNotBlank(root.selectSingleNode("./info/eletotalcount").getText())) {
			jsonObject.put("PAGECOUNT",
					Integer.parseInt(root.selectSingleNode("./info/eletotalcount").getText().trim()));
		} else {
			jsonObject.put("PAGECOUNT", getMaxName(dir));
		}
		jsonObject.put("ADDRESS", big5ToChinese(root.selectSingleNode("./info/publisher/address").getText().trim()));
		jsonObject.put("BOOKDETAIL", big5ToChinese(root.selectSingleNode("./info/abstract").getText().trim()));
		return jsonObject;
	}

	/**
	 * @desc 获取文献目录信息
	 * @param filePath
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public JSONArray getToc(String dir) throws DocumentException {
		JSONArray jsonArray = new JSONArray();
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement()
				.element("toc");
		if (root != null) {
			if (root.selectNodes("./tocdiv") != null) {
				List<Element> elements = root.selectNodes("./tocdiv");
				for (Element node : elements) {
					this.getTocNodes(node, "", jsonArray);
				}
			}
		}
		return jsonArray;

	}

	/**
	 * @desc 获取图书目录信息
	 * @param node
	 * @param zj
	 * @param array
	 */
	@SuppressWarnings("unchecked")
	private void getTocNodes(Element node, String zj, JSONArray array) {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("TITLE", big5ToChinese(node.element("title").getTextTrim()));
		jsonObject.put("ZJ", node.element("levelid").getTextTrim());
		jsonObject.put("PAGE", node.element("tocentry").attributeValue("pagenum"));
		jsonObject.put("VPAGE", node.element("tocentry").attributeValue("vpagenum"));
		jsonObject.put("PZJ", zj);

		array.add(jsonObject);

		List<Element> elements = node.selectNodes("./tocdiv");
		for (Element e : elements) {
			this.getTocNodes(e, node.element("levelid").getTextTrim(), array);
		}
	}

	/**
	 * @desc 获取图书目录信息
	 * @param node
	 * @param zj
	 * @param array
	 */
	@SuppressWarnings("unchecked")
	public String getContent(Element root) {
		StringBuffer stringBuffer = new StringBuffer();
		List<Element> list = root.selectNodes("//title");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//para");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//titleabbrev");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//subtitle");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//emphasis");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//abstract");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//year");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//holder");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//keyword");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//pubdate");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//publishername");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//address");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//date");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//revremark");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("/riesvolnums");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//endissuedate");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//firstissuedate");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//collectionname");
		for (Element e : list)
			stringBuffer.append(big5ToChinese(e.getTextTrim()));

		list = root.selectNodes("//author");
		for (Element e : list) {
			String name = e.element("personname").element("firstname").getText()
					+ e.element("personname").element("surname").getText();
			stringBuffer.append(big5ToChinese(name));
		}

		String content = stringBuffer.toString();
		return content;

	}

	public int getMaxName(String dir) {
		String[] str = { "jpg", "gif", "png", "jpeg" };
		int i, max;
		File f = new File(filePath.concat(dir).concat(endPath));
		if (!f.exists()) {
			return 0;
		}
		File fa[] = f.listFiles();
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
		return max;
	}

	public String getFileNameNoEx(String filename) {
		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('.');
			if ((dot > -1) && (dot < (filename.length()))) {
				return filename.substring(0, dot);
			}
		}
		return filename;
	}

	@SuppressWarnings("unchecked")
	public String[] getCNMarc(String dir) throws DocumentException {
		String[] obj = new String[39];
		// 责任者
		String authName = "";
		StringBuffer name = new StringBuffer();
		String tradName = "";
		StringBuffer tname = new StringBuffer();
		File bfile = new File(filePath.concat(dir).concat(fileName));
		if (!bfile.exists() && !bfile.isDirectory()) {
			return null;
		}
		Element root = new SAXReader().read(new File(filePath.concat(dir).concat(fileName))).getRootElement();
		List<Element> list = root.element("info").element("authorgroup").elements("author");
		for (Element node : list) {
			authName = big5ToChinese(node.element("personname").element("firstname").getTextTrim()
					+ node.element("personname").element("surname").getTextTrim());
			name.append(authName).append("|");
			tradName = ChineseTobig5(node.element("personname").element("firstname").getTextTrim()
					+ node.element("personname").element("surname").getTextTrim());
			tname.append(tradName).append(",");
		}
		// 书id
		obj[0] = root.attributeValue("id").trim();
		// 题名
		String title = big5ToChinese(root.selectSingleNode("./info/title").getText().trim());
		String subtitle = big5ToChinese(root.selectSingleNode("./info/subtitle").getText().trim());
		String totitle = "";
		if (StringUtils.isNotBlank(subtitle)) {
			totitle = title + ":" + subtitle;
		} else {
			totitle = title;
		}
		// 题名
		obj[1] = totitle;
		// 责任者（繁）
		obj[2] = tname.toString().substring(0, tname.toString().length() - 1);
		// 责任者（简）
		obj[3] = name.toString().substring(0, name.toString().length() - 1);
		// 责任者（国）
		obj[4] = name.toString().substring(0, name.toString().length() - 1);
		// 版次
		Node node = root.selectSingleNode("./info/revision/revnumber");
		if (node != null) {
			obj[5] = "第" + node.getText().trim() + "版";
		} else {
			obj[5] = "";
		}

		// 出版社地址
		String address = big5ToChinese(root.element("info").element("publisher").element("address").getTextTrim());
		if (StringUtils.isNotBlank(address)) {
			obj[6] = address;
		} else {
			obj[6] = "[出版地不详]";
		}
		// 出版社
		obj[7] = big5ToChinese(root.element("info").element("publisher").element("publishername").getTextTrim());
		// 出版日期
		obj[8] = big5ToChinese(root.selectSingleNode("./info/pubdate").getText().trim());

		// 页码或卷册
		String jz = "";
		if (root.selectSingleNode("./info/pagenums") != null) {
			jz = root.selectSingleNode("./info/pagenums").getText().trim() + "页";
			obj[9] = jz;
		}
		if (root.selectSingleNode("./info/bookcount") != null) {
			jz = root.selectSingleNode("./info/bookcount").getText().trim() + "册";
			obj[9] = jz;
		}
		if (root.selectSingleNode("./info/bookcount") != null && root.selectSingleNode("./info/pagenums") != null) {
			jz = root.selectSingleNode("./info/bookcount").getText().trim() + "册("
					+ root.selectSingleNode("./info/pagenums").getText().trim() + "页)";
			obj[9] = jz;
		}
		// 图,地图,肖像
		obj[10] = "";
		// 高度宽度
		String hw = "";
		if (root.selectSingleNode("./info/height") != null
				&& StringUtils.isNotBlank(root.selectSingleNode("./info/height").getText())) {
			hw = Integer.valueOf(root.selectSingleNode("./info/height").getText().trim()) / 118 + "cm";
			obj[11] = hw;
		}
		if (root.selectSingleNode("./info/width") != null
				&& StringUtils.isNotBlank(root.selectSingleNode("./info/width").getText())) {
			hw = Integer.valueOf(root.selectSingleNode("./info/width").getText().trim()) / 118 + "cm";
			obj[11] = hw;
		}
		if (root.selectSingleNode("./info/height") != null && root.selectSingleNode("./info/width") != null
				&& StringUtils.isNotBlank(root.selectSingleNode("./info/height").getText())
				&& StringUtils.isNotBlank(root.selectSingleNode("./info/width").getText())) {
			hw = Integer.valueOf(root.selectSingleNode("./info/height").getText().trim()) / 118 + "×"
					+ Integer.valueOf(root.selectSingleNode("./info/width").getText().trim()) / 118 + "cm";
			obj[11] = hw;
		}
		// 丛书名
		if (root.selectSingleNode("./info/series/title") != null) {
			obj[13] = big5ToChinese(root.selectSingleNode("./info/series/title").getText().trim());
		}
		// 丛书卷册号
		if (root.selectSingleNode("./info/seriesvolnums") != null) {
			obj[14] = big5ToChinese(root.selectSingleNode("./info/seriesvolnums").getText().trim());
		}
		// 价格
		if (root.selectSingleNode("./info/price") != null) {
			obj[22] = big5ToChinese(root.selectSingleNode("./info/price").getText().trim());
		}
		// 中图法分类号
		String role = root.element("info").element("classification").attribute("role").getText().trim();
		role = big5ToChinese(role);
		if (role.equals("中图法")) {
			obj[28] = root.element("info").element("classification").getText().trim();
		}

		return obj;
	}
	
	/**
	 * 
	 * @Title: updateXml  
	 * @Author:Liangjixiang
	 * @Description: 若图书已被加工，更新main.xml文件
	 * @Time:2018年11月28日
	 * @param: @param book
	 * @param: @throws DocumentException
	 * @param: @throws IOException      
	 * @return: void      
	 * @throws
	 */
	public void updateXml(JSONObject book) throws DocumentException, IOException {
		String dir = book.getString("BOOKDIR");
		Document doc = new SAXReader().read(new File(filePath.concat(dir).concat(fileName)));
		Element root = doc.getRootElement();
		
		//修改图书责任人信息
//		String auth = book.getString("AUTHOR");
//		if (StringUtil.isNotBlank(auth)) {
//			//移除原来责任人信息
//			Element authorgroup = root.element("info").element("authorgroup");
//			List<Element> authors = authorgroup.elements("author"); 
//			for(Element author : authors) {
//				author.detach();
//			}
//			String[] auths = auth.split(",");
//			for (int i = 0; i < auths.length; i++) {
//				Element author = authorgroup.addElement("author");
//				Element person = author.addElement("personname");
//				person.addAttribute("role", "著");  //前端无法区分
//			}
//		}
		//修改中图法信息
		String zttype = book.getString("ZTTYPEID");
		if (StringUtil.isNotBlank(zttype)) {
			List<Element> classifications = root.element("info").elements("classification"); 
			boolean blfind = false;
			for(Element classification : classifications) {
				if (classification.attributeValue("role").equals("中图法")){
					classification.setText(zttype);
					blfind = true;
				}
			}
			if (!blfind) {
				Element classification = root.element("info").addElement("classification");
				classification.addAttribute("role", "中图法");
				classification.setText(zttype);
			}
		}
		//修改学科分类信息
		String edutype = book.getString("EDUTYPEID");
		if (StringUtil.isNotBlank(edutype)) {
			List<Element> classifications = root.element("info").elements("classification"); 
			boolean blfind = false;
			for(Element classification : classifications) {
				if (classification.attributeValue("role").equals("学科分类")){
					classification.setText(edutype);
					blfind = true;
				}
			}
			if (!blfind) {
				Element classification = root.element("info").addElement("classification");
				classification.addAttribute("role", "学科分类");
				classification.setText(edutype);
			}
		}
		
		//修改丛书名称
		String seriesTitle = book.getString("SERIES");
		if (StringUtil.isNotBlank(seriesTitle)) {
			Element series = root.element("info").element("series");
			if (series == null) {
				series = root.element("info").addElement("series");
				Element title = series.addElement("title");
				title.setText(seriesTitle);
			}
			else {
				Element title = series.element("title");
				title.setText(seriesTitle);
			}
		}
		
		//修改出版社  修改出版地
		String publishingname = book.getString("PUBLISHINGNAME");
		String address = book.getString("ADDRESS");
		if (StringUtil.isNotBlank(publishingname)) {
			Element publisher = root.element("info").element("publisher");
			if (publisher != null) {
				publisher.element("publishername").setText(publishingname);
				publisher.element("address").setText(address);
			}
			else {
				publisher = root.element("info").addElement("publisher");
				publisher.addElement("publishername").setText(publishingname);
				publisher.addElement("address").setText(address);
			}
				
		}
		
		//修改出版日期
		String pdate = book.getString("DATE");
		if (StringUtil.isNotBlank(pdate)) {
			Element pubdate = root.element("info").element("pubdate");
			if (pubdate != null) {
				pubdate.setText(pdate);
			}
			else {
				root.element("info").addElement("pubdate").setText(pdate);
			}
		}
		
		//修改出版日期
		String textnote = book.getString("TEXTNOTE");
		if (StringUtil.isNotBlank(textnote)) {
			Element tn = root.element("info").element("revhistory").element("revision").element("revremark");
			if (tn != null) {
				tn.setText(textnote);
			}
			else {
				root.element("info").addElement("revhistory").addElement("revision").addElement("revremark").setText(textnote);
			}
		}

		//修改出版日期
		String contentnote = book.getString("CONTENTNOTE");
		if (StringUtil.isNotBlank(contentnote)) {
			Element tn = root.element("info").element("abstract");
			if (tn != null) {
				tn.setText(contentnote);
			}
			else {
				root.element("info").addElement("abstract").setText(contentnote);
			}
		}

		FileOutputStream out =new FileOutputStream(filePath.concat(dir).concat(fileName));
        OutputFormat format=OutputFormat.createPrettyPrint();   //漂亮格式：有空格换行
        format.setEncoding("UTF-8");
        XMLWriter writer=new XMLWriter(out,format);
        writer.write(doc);
        writer.close();
	}

}
