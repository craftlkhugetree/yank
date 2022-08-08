package cn.com.angke.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

public class FileUtil {
	public static void getFile(HttpServletRequest request, HttpServletResponse response,String fileName) throws IOException{
		InputStream inputStream =null;
        OutputStream outputStream=null;
		try{
			File file = new File(fileName);
			inputStream =  new FileInputStream(file);
			outputStream = response.getOutputStream();
	        response.setContentType("application/x-download");
	        response.addHeader("Content-Disposition", "attachment;filename="+file.getName());
	        IOUtils.copy(inputStream, outputStream);
	        outputStream.flush();
		    }catch (Exception e){
		        e.printStackTrace();
		    }finally{
		    	if(outputStream!=null){
		    		outputStream.close();
		    	}
		    	if(inputStream!=null){
		    		inputStream.close();
		    	}
		    }
		}
	
	public static void delFile(String name){
		File file = new File(name);
		file.delete();
	}
	
}
