package cn.com.angke.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.alibaba.fastjson.JSONObject;

public class CreateFileUtil {
	/**
	 * 生成.json格式文件
	 */
	public static boolean createJsonFile(String filePath, JSONObject jsonString, String dir, String fileName) {
		// 标记文件生成是否成功
		boolean flag = true;

		// 拼接文件完整路径
		String fullPath = new File(filePath.concat(dir).concat("/")) + File.separator + fileName + ".json";

		// 生成json格式文件
		try {
			// 保证创建一个新文件
			File file = new File(fullPath);
			if (!file.getParentFile().exists()) { // 如果父目录不存在，创建父目录
				file.getParentFile().mkdirs();
			}
			if (file.exists()) { // 如果已存在,删除旧文件
				file.delete();
			}
			file.createNewFile();

			// 格式化json字符串
			String json = jsonString.toJSONString();

			// 将格式化后的字符串写入文件
			Writer write = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
			write.write(json);
			write.flush();
			write.close();
		} catch (Exception e) {
			flag = false;
			e.printStackTrace();
		}

		// 返回是否成功的标记
		return flag;
	}
	
	public static void main(String[] args) {
		File file = new File("D:\\fileupload\\mgk\\jiagong\\20191206\\000001中华六法二 民律上\\000001.json");
		System.out.println(file.getName());
	}
	
	public static boolean createJsonFileBak(String filePath, JSONObject jsonString, String dir, String fileName) {
		// 标记文件生成是否成功
		boolean flag = true;
		String json = jsonString.toJSONString();
		try {
			String basePath = filePath + File.separator + dir;
			File baseFile = new File(basePath);
			if (baseFile.exists() && baseFile.isDirectory()) {
				File[] listFile = baseFile.listFiles();
				for (int i = 0; i < listFile.length; i++) {
					if (listFile[i].isFile() && listFile[i].getName().endsWith(".json")) {
						String oneName = listFile[i].getAbsolutePath();
						File fileBak = new File(oneName + "bak");
						if (!fileBak.exists()) {
							FileUtils.copyFile(listFile[i], fileBak);
						}
						listFile[i].delete();
						listFile[i].createNewFile();
						// 将格式化后的字符串写入文件
						Writer write = new OutputStreamWriter(new FileOutputStream(listFile[i]), "UTF-8");
						write.write(json);
						write.flush();
						write.close();
					}
				}
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		// 返回是否成功的标记
		return flag;
	}

	public static boolean createJsonFile(List<JSONObject> jsonString, String filePath, String dir, String fileName) {
		// 标记文件生成是否成功
		boolean flag = true;

		// 拼接文件完整路径
		String fullPath = new File(filePath.concat(dir).concat("/")) + File.separator + fileName + ".json";

		// 生成json格式文件
		try {
			// 保证创建一个新文件
			File file = new File(fullPath);
			if (!file.getParentFile().exists()) { // 如果父目录不存在，创建父目录
				file.getParentFile().mkdirs();
			}
			if (file.exists()) { // 如果已存在,删除旧文件
				file.delete();
			}
			file.createNewFile();

			// 格式化json字符串
			String json = jsonString.toString();

			// 将格式化后的字符串写入文件
			Writer write = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
			write.write(json);
			write.flush();
			write.close();
		} catch (Exception e) {
			flag = false;
			e.printStackTrace();
		}

		// 返回是否成功的标记
		return flag;
	}
}
