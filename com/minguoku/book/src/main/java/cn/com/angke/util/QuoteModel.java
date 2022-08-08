package cn.com.angke.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.somenew.config.service.Config;
import com.somenew.service.ServiceFactory;
import com.somenew.utils.DateOpt;

public class QuoteModel {
	
	public static String createQuote(JSONObject info, String type) {
		String primaryStr = getTxt("quote-" + type + ".txt");
		if (type.equals("BibTeX")) {
			Iterator<String> keys = info.keySet().iterator();
			 while (keys.hasNext()) {
				String key = keys.next();
				if (StringUtils.isNotBlank(info.getString(key))) {
					info.put(key, "{" + info.getString(key) + "}");
				}
			}
		}
		primaryStr = compaile(primaryStr, "\\{\\{(.*?)\\}\\}", info, true);
		String downName = getDownloadName(type);
		File file = new File(downName);
		try {
			FileWriter fw = new FileWriter(file);
			fw.write(primaryStr);
			fw.flush();
			fw.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return downName;
	}

	// 获取原始文件
	public static String getTxt(String fileName) {
		String str = "";
		FileReader fr = null;
		BufferedReader br = null;
		URL url = QuoteModel.class.getClassLoader().getResource(fileName);
		File file = new File(url.getFile());
		try {
			fr = new FileReader(file);
			br = new BufferedReader(fr);
			String txt = "";
			while ((txt = br.readLine()) != null) {
				str += txt + "\n";
			}
			br.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return str;
	}

	public static String getDownloadName(String type) {
		Config config = ServiceFactory.getInstance().getConfig();
		String str = DateOpt.getCurrentDatetimeLongStr();
		String name = config.getConfigValue("UPLOADFILETMPDIR") + type + "_" + str.substring(0, 8) + "_"
				+ str.subSequence(8, 14) + ".txt";
		return name;
	}

	public static String compaile(String primaryStr, String patternStr, JSONObject info, boolean needDel) {
		Pattern pattern = Pattern.compile(patternStr);

		String[] str = primaryStr.split("\n");
		String tanslatedStr = "";
		for (int i = 0; i < str.length; i++) {
			String oneStr = str[i];
			if (StringUtils.isNotBlank(oneStr) && oneStr.contains("{{")) {
				Matcher matcher = pattern.matcher(oneStr);
				while (matcher.find()) {
					String column = matcher.group(1);
					String fullColumn = matcher.group();
					if ((!needDel) || (needDel && StringUtils.isNotBlank(info.getString(column)))) {
						oneStr = oneStr.replace(fullColumn,StringUtils.isBlank(info.getString(column)) ? "" : info.getString(column));
						tanslatedStr += (oneStr + "\r\n");
					}
				}
			} else if (StringUtils.isNotBlank(oneStr)) {
				tanslatedStr += (oneStr + "\r\n");
			}
		}
		return tanslatedStr;
	}

	public static String getPatternTime(String pattern) {
		SimpleDateFormat sd = new SimpleDateFormat(pattern);
		return sd.format(new Date());
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// String primaryStr = "name:{{name}}\nid:{{id}}";
		// System.out.println(primaryStr);
		 JSONObject obj = new JSONObject();
		 obj.put("id", "222");
		 obj.put("name", "jack");
		// primaryStr = compaile(primaryStr, "\\{\\{(.*?)\\}\\}", obj);
		// System.out.println(primaryStr);
		//createQuote(new JSONObject(), "EndNote");
		 Iterator<String> keys = obj.keySet().iterator();
		 while (keys.hasNext()) {
			String key = keys.next();
			obj.put(key, "{" + obj.getString(key) + "}");
		}
		System.out.println(obj);
	}

}
