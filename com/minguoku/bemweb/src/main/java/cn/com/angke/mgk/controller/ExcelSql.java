package cn.com.angke.mgk.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.BaseAction;

import cn.com.angke.mgk.service.ExcelSqlService;

@Controller
@RequestMapping("/ExcelSql")
public class ExcelSql extends BaseAction {
	@Autowired
	private ExcelSqlService excelSqlService;
	
	/**
	 * 读取excel生成sql文件，中图法excel
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/ztf",method = RequestMethod.POST)
	@ResponseBody
	public void ztf(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String furl = request.getParameter("FURL");
		JSONObject r = excelSqlService.ztfExcel(furl);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 读取excel生成sql文件，纪年法excel
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/jn",method = RequestMethod.POST)
	@ResponseBody
	public void jn(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String furl = request.getParameter("FURL");
		JSONObject r = excelSqlService.jnExcel(furl);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 省县excel
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/sx",method = RequestMethod.POST)
	@ResponseBody
	public void sx(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String furl = request.getParameter("FURL");
		JSONObject r = excelSqlService.sxExcel(furl);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * tz excel
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/tz",method = RequestMethod.POST)
	@ResponseBody
	public void tz(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String furl = request.getParameter("FURL");
		JSONObject r = excelSqlService.tzExcel(furl);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * delSql 获取清理数据库的sql
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/delSql",method = RequestMethod.POST)
	@ResponseBody
	public void delSql(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject r = excelSqlService.delSql();
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * jg excel
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/jg",method = RequestMethod.POST)
	@ResponseBody
	public void jg(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String furl = request.getParameter("FURL");
		JSONObject r = excelSqlService.jgExcel(furl);
		ActionHelp.returnRes(request, response, r);
	}
	
	/**
	 * 获取图片到前台下载
	 * @param request
	 * @param response
	 * @throws IOException 
	 * @throws Exception
	 */
	@RequestMapping(value = "/getFile2",method = RequestMethod.GET)
	@ResponseBody
	public void getFile2(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String destFileName = request.getParameter("url");
		String agent = request.getHeader("user-agent");
		response.reset();
		response.setContentType("application/unknown;charset=utf-8");
		// response.setCharacterEncoding("UTF-8");
			try {
				if (agent.indexOf("MSIE") != -1) {// ie
					String fn;
					fn = URLEncoder.encode(destFileName, "UTF-8");
					if (fn.length() > 150) {
						fn = new String(destFileName.getBytes("GBK"), "ISO-8859-1");
					}
					response.addHeader("Content-Disposition", "attachment; filename=\"" + fn + "\"");
				} else {
					response.addHeader("Content-Disposition", "attachment; filename=\"" + new String((destFileName).getBytes("utf-8"), "iso-8859-1") + "\"");
				}
			} catch (UnsupportedEncodingException e) {
				throw new RuntimeException(e);
			}
			//获取文件输出流
			ServletOutputStream toClient;
			try {
				toClient = response.getOutputStream();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
			FileInputStream fins = new FileInputStream(destFileName);
			try {
//				fins = ;
				byte[] buff = new byte[1024];// 缓冲区
				while (fins.read(buff) != -1) {// 设置循环语句读取
					toClient.write(buff);
				}
			} catch (Throwable e) {
				throw new RuntimeException(e);
			} finally {
				fins.close();
				toClient.close();
			}
	}
	
	@RequestMapping(value = "/getFile",method = RequestMethod.GET)
	@ResponseBody
	public void getFile(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String destFileName = request.getParameter("url");
		String del = request.getParameter("del");
		InputStream inputStream =null;
        OutputStream outputStream=null;
		File file = null;
        try{
			file = new File(destFileName);
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
		    	if(StringUtils.isNotBlank(del)&&del.equals("true")&&file!=null){
		    		file.delete();
		    	}
		    }
		}
}
