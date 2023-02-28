package cn.com.angke.lres.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.beetl.sql.core.SQLManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.somenew.config.service.ConfigOpt;

import cn.com.angke.lres.dao.BaseDao;
import cn.com.angke.util.DateTimeUtil;
import cn.com.angke.util.UserUtil;

public class BaseService {
	private Logger Log = LogManager.getLogger(BaseService.class);
	@Autowired
	BaseDao baseDao;

    protected SQLManager excSQL() {
        return baseDao.getSql();
    }

	protected HttpServletRequest getRequest(){
        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return req;
    }
	protected HttpServletResponse getResponse(){
        HttpServletResponse resp = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getResponse();
        return resp;
    }
	
	protected String outPath() {
		return ConfigOpt.getConfigValue("UPLOADPATH", "e:/web");
	}
	protected String proPath() {
		return getRequest().getSession().getServletContext().getRealPath("/");
	}
	
	protected SQLManager sqlManager() {
		return baseDao.getSql();
	}
	
	protected <T> void fillBasePro(T t) {
		Class<T> clazz = (Class<T>) t.getClass();
        try {
            Method delete = clazz.getDeclaredMethod("setIsDelete", Integer.class);
            if(null != delete) {
            	 delete.invoke(t, 1);
            }
			Method time = clazz.getDeclaredMethod("setCreateTime", Date.class);
			if(null != time) {
				time.invoke(t, DateTimeUtil.getSystemDate());
            }
			Method tidMethod = clazz.getDeclaredMethod("setTid", String.class);
			if(null != tidMethod) {
				tidMethod.invoke(t, UserUtil.getTid());
            }
			
		} catch (Exception e) {
			//e.printStackTrace();
			Log.error(e.getMessage());
		} 
	}
	
	protected <T> void fillParamTID(T t) {
		Class<T> clazz = (Class<T>) t.getClass();
        try {
			Method tidMethod = clazz.getDeclaredMethod("setTid", String.class);
			tidMethod.invoke(t, UserUtil.getTid());
		} catch (Exception e) {
			//e.printStackTrace();
			Log.error(e.getMessage());
		} 
	}
	
	public HttpServletResponse download(String path, HttpServletResponse response) {
        try {
            // path是指欲下载的文件的路径。
            File file = new File(path);
            // 取得文件名。
            String filename = file.getName();
            // 取得文件的后缀名。
//            String ext = filename.substring(filename.lastIndexOf(".") + 1).toUpperCase();

            // 以流的形式下载文件。
            InputStream fis = new BufferedInputStream(new FileInputStream(path));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            // 清空response
            response.reset();
            // 设置response的Header
            response.addHeader("Content-Disposition", "attachment;filename=" + new String(filename.getBytes()));
            response.addHeader("Content-Length", "" + file.length());
            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
            response.setContentType("application/octet-stream");
            toClient.write(buffer);
            toClient.flush();
            toClient.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return response;
    }
	
	public void downloadLocal(HttpServletResponse response) throws FileNotFoundException {
        // 下载本地文件
        String fileName = "Operator.doc".toString(); // 文件的默认保存名
        // 读到流中
        InputStream inStream = new FileInputStream("c:/Operator.doc");// 文件的存放路径
        // 设置输出的格式
        response.reset();
        response.setContentType("bin");
        response.addHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        // 循环取出流中的数据
        byte[] b = new byte[100];
        int len;
        try {
            while ((len = inStream.read(b)) > 0)
                response.getOutputStream().write(b, 0, len);
            inStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
	
	@SuppressWarnings("unused")
	public void downloadNet(HttpServletResponse response) throws MalformedURLException {
        // 下载网络文件
        int bytesum = 0;
        int byteread = 0;

        URL url = new URL("windine.blogdriver.com/logo.gif");

        try {
            URLConnection conn = url.openConnection();
            InputStream inStream = conn.getInputStream();
            @SuppressWarnings("resource")
			FileOutputStream fs = new FileOutputStream("c:/abc.gif");

            byte[] buffer = new byte[1204];
            int length;
            while ((byteread = inStream.read(buffer)) != -1) {
                bytesum += byteread;
                System.out.println(bytesum);
                fs.write(buffer, 0, byteread);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
	
	public void downLoad(String filePath, HttpServletResponse response, boolean isOnLine) throws Exception {
        File f = new File(filePath);
        if (!f.exists()) {
            response.sendError(404, "File not found!");
            return;
        }
        BufferedInputStream br = new BufferedInputStream(new FileInputStream(f));
        byte[] buf = new byte[1024];
        int len = 0;

        response.reset(); // 非常重要
        if (isOnLine) { // 在线打开方式
            URL u = new URL("file:///" + filePath);
            response.setContentType(u.openConnection().getContentType());
            response.setHeader("Content-Disposition", "inline; filename=" + f.getName());
            // 文件名应该编码成UTF-8
        } else { // 纯下载方式
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename=" + f.getName());
        }
        OutputStream out = response.getOutputStream();
        while ((len = br.read(buf)) > 0)
            out.write(buf, 0, len);
        br.close();
        out.close();
    }
	
	public static void main(String[] args) {
//		BaseService baseService = new BaseService();
//		LresQuestclass l = new LresQuestclass();
//		baseService.fillBasePro(l);
//		System.out.println(l.getIsDelete());
	}
}
