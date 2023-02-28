package cn.com.angke.lres.controller;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.lres.service.FileUploadService;
import cn.com.angke.lres.vo.ResultMessage;
import cn.com.angke.util.FileUploadUtil;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  UploadController   
 * @Description:TODO(文件上传转换控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:16:00   
 *     
 */  
@RestController
@RequestMapping("/upload")
@Api(tags = "文件上传接口")
public class UploadController {
	public final static String[] VIDEOS = {"avi","wmv","mpeg","mp4","mov","mkv","flv","f4v","m4v","rmvb","rm","3gp","dat","ts","mts","vob"};
	public final static String[] FILES = {"doc","docx","xls","xlsx","ppt","pptx","pdf"};
	public final static String[] IMAGES = {"bmp","jpg","jpeg","png","gif"};
	
	@Autowired
	FileUploadService fileUploadService;
	
	@PostMapping("/add")
	public ResultMessage<JSONObject> fileUpload(@RequestParam("file") CommonsMultipartFile file){
		if(null == file) {
			return new ResultMessage<>(false,"上传文件不能为空");
		}
		String fileUrl = null;
		JSONObject obj = new JSONObject();
		String postFix = FileUploadUtil.getPostfix(file.getOriginalFilename());
		postFix = postFix.toLowerCase();
		try {
			if(Arrays.asList(VIDEOS).contains(postFix)) {
				fileUrl = fileUploadService.uploadVideo(file);
			}else if(Arrays.asList(FILES).contains(postFix)) {
				fileUrl = fileUploadService.uploadFile(file);
			}else if(Arrays.asList(IMAGES).contains(postFix)) {
				fileUrl = fileUploadService.uploadImage(file);
			}else {
				return new ResultMessage<>(false,"不支持的文件格式");
			}
		} catch (Exception e) {
			return new ResultMessage<>(false,e.getMessage());
		}
		obj.put("fileUrl", fileUrl);
		return new ResultMessage<JSONObject>(true,obj);
		
	}
}
