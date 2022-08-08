package cn.com.angke.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;

public class Citation {

	/**
	 * 读取文件并替换其中的路径，然后保存文件
	 * 
	 * @param filePath
	 *            读取文件路径
	 * @param savePath
	 *            保存文件路径
	 * @throws IOException
	 */
	public void changeContent(String filePath, String savePath, JSONObject data) throws IOException {
		// filePath 要读取的文件 savePath 要写入的文件
		String content = "";
		FileInputStream fileinputstream = new FileInputStream(filePath);// 读取模板文件
		int length = fileinputstream.available();
		byte bytes[] = new byte[length];
		fileinputstream.read(bytes);
		fileinputstream.close();
		content = new String(bytes);
		String title = data.getString("TITLE");
		String author = data.getString("AUTHOR");
		String pubname = data.getString("PUBLISHNAME");
		String pudate = data.getString("PUBDATE");
		if (StringUtils.isNotBlank(title))
			content=content.replaceAll("###t###", title.trim());
		else
			content=content.replaceAll("###t###", "");
		if (StringUtils.isNotBlank(author))
			content=content.replaceAll("###a###", author.trim());
		else
			content=content.replaceAll("###a###", "");
		if (StringUtils.isNotBlank(pubname))
			content=content.replaceAll("###i###", pubname.trim());
		else
			content=content.replaceAll("###i###", "");
		if (StringUtils.isNotBlank(pudate))
			content=content.replaceAll("###d###", pudate.trim());
		else
			content=content.replaceAll("###d###", "");
		  // 保证创建一个新文件
        File file = new File(savePath);
        if (!file.getParentFile().exists()) { // 如果父目录不存在，创建父目录
            file.getParentFile().mkdirs();
        }
        if (file.exists()) { // 如果已存在,删除旧文件
            file.delete();
        }
        file.createNewFile();
		FileOutputStream fileoutputstream = new FileOutputStream(savePath);// 建立文件输出流
		byte tag_bytes[] = content.getBytes();
		fileoutputstream.write(tag_bytes);
		fileoutputstream.close();
	}

	public void create(JSONObject data, String filePath, String savePath) {
		if (data != null) {
		}
	}

}
