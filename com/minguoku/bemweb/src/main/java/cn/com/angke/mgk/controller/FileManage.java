package cn.com.angke.mgk.controller;

import java.io.File;
import java.io.InputStream;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;
import com.somenew.action.BaseAction;
import com.somenew.config.service.Config;
import com.somenew.db.DbOpt;
import com.somenew.service.ServiceFactory;
import com.somenew.utils.ResponseUtil;

import cn.com.angke.mgk.service.FileService;

@Controller
@RequestMapping("/FileManage")
public class FileManage extends BaseAction {

	@Resource(name = "fileServiceImpl")
	private FileService fileService;

	/**
	 * 上传图片
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/upload",method = RequestMethod.POST)
	@ResponseBody
	public void upload(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Config vconfig = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEMAXSIZE = vconfig.getConfigValue("UPLOADFILEMAXSIZE", "200");
		int iUPLOADFILEMAXSIZE = Integer.parseInt(UPLOADFILEMAXSIZE);
		String UPLOADFILETMPDIR = vconfig.getConfigValue("UPLOADFILETMPDIR");
		JSONObject res = new JSONObject();
		JSONArray files = new JSONArray();
		try {
			DiskFileItemFactory factory = new DiskFileItemFactory();// 创建一个解析器工厂
			factory.setRepository(new File(UPLOADFILETMPDIR));// 临时文件;
			ServletFileUpload upload = new ServletFileUpload(factory);// 得到解析器
			upload.setHeaderEncoding("utf-8");// 解决文件名为中文乱码的文件
			upload.setFileSizeMax(iUPLOADFILEMAXSIZE * 1024 * 1024);// 设置上传文件的最大值
			// upload.setProgressListener(new ProgressHandler());// 监听器
			List<FileItem> list = upload.parseRequest(request);// 对相应的请求进行解析，有几个输入项，就有几个FileItem对象
			for (FileItem item : list) {// 要迭代list集合，获取list集合中每一个输入项
				if (!item.isFormField()) {// 输入的类型如果是文件
					// 上传文件输入项
					String filename = item.getName();// 上传文件的文件名1.txt
					InputStream is = item.getInputStream();// 输入流
					try {
						JSONObject fileObj = fileService.saveFile(filename, is);
						files.add(fileObj);
					} finally {
						item.delete();// 临时文件的删除问题必须在关闭之后
					}
				}
			}
		} catch (Throwable e) {
			e.printStackTrace();
			ActionHelp.returnResponse(request, response, ResponseUtil.convertErrMsg("0005").toJSONString());
			return;
		}
		res.put("FILE", files);
		ActionHelp.returnResponse(request, response, ResponseUtil.addSucMsg(res).toJSONString());
	}

	/**
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/view")
	@ResponseBody
	public void view(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String data = request.getParameter("data");
		System.out.println(data);
		if(StringUtils.isBlank(data)){
			ActionHelp.returnResponse(request, response, ResponseUtil.convertErrMsg("1001").toJSONString());
			return;
		}
		JSONObject param = JSONObject.parseObject(data);
		String ID = param.getString("ID");
		JSONObject obj=DbOpt.getInstance().getObjByID(null, "CM_FILE", ID, new String[]{"ID","TITLE"});
		ActionHelp.returnResponse(request, response,ResponseUtil.addSucMsg(obj).toJSONString());
	};
	
	/**
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/get")
	@ResponseBody
	public void get(HttpServletRequest request, HttpServletResponse response) throws Exception {
//		String data = request.getParameter("data");
//		System.out.println(data);
//		JSONObject param = JSONObject.parseObject(data);
//		String ID = param.getString("ID");
		String ID = request.getParameter("ID");
		System.out.println("PHOTOID:"+ID);
		if(StringUtils.isBlank(ID)){
			ActionHelp.returnResponse(request, response, ResponseUtil.convertErrMsg("0009").toJSONString());
			return;
		}
		fileService.outFileContentToResponse(ID, request, response);
	};

}
