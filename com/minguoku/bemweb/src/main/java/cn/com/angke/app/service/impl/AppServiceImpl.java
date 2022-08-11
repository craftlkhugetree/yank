package cn.com.angke.app.service.impl;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.config.service.Config;
import com.somenew.config.service.ConfigOpt;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.service.ServiceFactory;
import com.somenew.utils.DateOpt;

import cn.com.angke.app.service.AppService;
import cn.com.angke.mgk.dao.BookCnmarcDao;

@Service
public class AppServiceImpl extends PlatformBaseServiceImpl implements AppService {
	@Autowired
	private BookCnmarcDao bookCnmarcDao;
	
	@Override
	public JSONObject getFull(String dir,JSONArray arr) throws Exception{
		JSONObject r = new JSONObject();
		String url = ConfigOpt.getConfigValue("UPLOADFILEDIR");
		String urlDir = ConfigOpt.getConfigValue(dir);
		String time = DateOpt.getCurrentDatetimeLongStr();
		String fileName = url+time+".txt";
		File file = new File(fileName);
		FileWriter writer = new FileWriter(file);
		JSONArray bookIds = bookCnmarcDao.getBookIdArr();
		for(int i=0;i<arr.size();i++){
			writer.write("开始检查:"+arr.getString(i)+"\r\n");
			File fileDir = new File(urlDir+arr.getString(i));
			File[] files = fileDir.listFiles();
			int allNum = 0,hasNum =0,noNum=0;
			for(int j=0;j<files.length;j++){
				File oneFile = files[j];
				if(oneFile.isDirectory()){
					allNum+=1;
					String bookName = oneFile.getName();
					try {
						String bookId = bookName.substring(0, 6);
						if(bookIds.contains(bookId)){
							hasNum+=1;
						}else{
							writer.write(bookName+"\r\n");
							noNum+=1;
						}
					} catch (Exception e) {
						noNum+=1;
						writer.write(bookName+"\r\n");
					}
				}
			}
			writer.write("本批次结果:共"+allNum+"条,不存在"+noNum+"条 "+"\r\n\r\n");
		}
		writer.flush();
		writer.close();
		r.put("fileName", fileName);
		return r;
	}

	@Override
	public JSONObject getDir(String dir) {
		System.out.println("dir"+dir);
		Config config = ServiceFactory.getInstance().getConfig();
		String url = config.getConfigValue(dir);
		System.out.println("url:"+url);
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
		JSONObject r = new JSONObject();
		r.put("items", arr);
		return r;
	}
	
}
