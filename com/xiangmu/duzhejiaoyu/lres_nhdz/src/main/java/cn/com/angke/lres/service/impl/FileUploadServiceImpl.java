package cn.com.angke.lres.service.impl;

import java.io.File;
import java.util.concurrent.Callable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.somenew.file.service.FileUtils;
import com.somenew.utils.StringOpt;

import cn.com.angke.lres.pojo.ConvertLog;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.FileUploadService;
import cn.com.angke.util.ExecuteCodecs;
import cn.com.angke.util.Office2PDF;
import cn.com.angke.util.ThreadPoolUtil;

@Service
public class FileUploadServiceImpl extends BaseService implements FileUploadService {
	private static final Logger LOG = LogManager.getLogger(FileUploadServiceImpl.class);
	
	/**   
	 * <p>Title: uploadVideo</p>   
	 * <p>Description: 视频上传后，从线程池获取线程转换格式为MP4，并记录数据库转换时间</p>   
	 * @param file
	 * @return
	 * @throws Exception   
	 * @see cn.com.angke.lres.service.FileUploadService#uploadVideo(org.springframework.web.multipart.commons.CommonsMultipartFile)   
	 */
	@Override
	public String uploadVideo(CommonsMultipartFile file) throws Exception {
		String fileType = "."+FileUtils.getFileSufix(file.getOriginalFilename());
		String fileNameUUID = StringOpt.produceUUID();
		String copyFilePath = "/upload/videos/"+fileNameUUID+"old"+fileType;
		String outFilePath = "/upload/videos/" + fileNameUUID + ".mp4";
		String copyPath = outPath() + copyFilePath;
		String outPath = outPath() + outFilePath;
		File newFile = new File(copyPath);
		File fileParent = newFile.getParentFile();
		if(!fileParent.exists()){  
		    fileParent.mkdirs();  
		}  
		file.transferTo(newFile);
//		if(fileType.toLowerCase().equals(".mp4")) {
//			return outFilePath;
//		}
		ConvertLog cLog = new ConvertLog();
		cLog.setId(StringOpt.produceUUID());
		cLog.setSource(copyFilePath);
		cLog.setTarget(outPath);
		fillBasePro(cLog);
		ThreadPoolUtil.submit(new Callable<String>() {
			@Override
			public String call(){
				long startTime = System.currentTimeMillis();
				try {
					Thread.sleep(300);
					LOG.info("转码线程启动=========");
					ExecuteCodecs.exchangeToMp4(copyPath, outPath);
					long endTime = System.currentTimeMillis();
					String needTime = String.valueOf((endTime - startTime)/1000);
					cLog.setUseTime(needTime);
					cLog.setResultCode(1);
					sqlManager().insert(cLog);
					LOG.info("转码线程结束=========");
				} catch (Exception e) {
					LOG.info("转码异常========="+e.getMessage());
					long endTime = System.currentTimeMillis();
					String needTime = String.valueOf((endTime - startTime)/1000);
					cLog.setUseTime(needTime);
					cLog.setResultCode(0);
					sqlManager().insert(cLog);
				}
				return "OK";
			}
			
		});
		
		return outFilePath;
	}

	/**   
	 * <p>Title: uploadImage</p>   
	 * <p>Description: 图片上传</p>   
	 * @param file
	 * @return
	 * @throws Exception   
	 * @see cn.com.angke.lres.service.FileUploadService#uploadImage(org.springframework.web.multipart.commons.CommonsMultipartFile)   
	 */
	@Override
	public String uploadImage(CommonsMultipartFile file) throws Exception{
		String fileType = "."+FileUtils.getFileSufix(file.getOriginalFilename());
		String copyFileName = StringOpt.produceUUID()+fileType;
		String outFilePath = "/upload/images/"+copyFileName;
		String outPath = outPath() + outFilePath;
		File newFile = new File(outPath);
		File fileParent = newFile.getParentFile();
		if(!fileParent.exists()){  
		    fileParent.mkdirs();  
		}  
		file.transferTo(newFile);
		return outFilePath;
	}

	/**   
	 * <p>Title: uploadFile</p>   
	 * <p>Description: 文档上传后，从线程池获取线程转换格式为PDF，并记录数据库转换时间</p>   
	 * @param file
	 * @return
	 * @throws Exception   
	 * @see cn.com.angke.lres.service.FileUploadService#uploadFile(org.springframework.web.multipart.commons.CommonsMultipartFile)   
	 */
	@Override
	public String uploadFile(CommonsMultipartFile file) throws Exception{
		String fileType = "."+FileUtils.getFileSufix(file.getOriginalFilename());
		String fileNameUUID = StringOpt.produceUUID();
		String copyFilePath = "/upload/offices/"+fileNameUUID+"old"+fileType;
		String outFilePath = "/upload/offices/" + fileNameUUID + ".pdf";
		String copyPath = outPath() + copyFilePath;
		String outPath = outPath() + outFilePath;
		if(fileType.toLowerCase().equals(".pdf")) {
			File outFile = new File(outPath);
			File fileParent = outFile.getParentFile();
			if(!fileParent.exists()){  
			    fileParent.mkdirs();  
			}  
			file.transferTo(outFile);
			return outFilePath;
		}else {
			File newFile = new File(copyPath);
			File fileParent = newFile.getParentFile();
			if(!fileParent.exists()){  
			    fileParent.mkdirs();  
			}  
			file.transferTo(newFile);
		}
		ConvertLog cLog = new ConvertLog();
		cLog.setId(StringOpt.produceUUID());
		cLog.setSource(copyFilePath);
		cLog.setTarget(outPath);
		fillBasePro(cLog);
		ThreadPoolUtil.submit(new Callable<String>() {
			@Override
			public String call(){
				long startTime = System.currentTimeMillis();
				try {
					LOG.info("转PDF线程启动=========");
					Thread.sleep(300);
					Office2PDF.office2pdf(copyPath,outPath);
					long endTime = System.currentTimeMillis();
					String needTime = String.valueOf((endTime - startTime)/1000);
					cLog.setUseTime(needTime);
					cLog.setResultCode(1);
					sqlManager().insert(cLog);
					LOG.info("转PDF线程结束=========");
				} catch (InterruptedException e) {
					LOG.info("转PDF异常========="+e.getMessage());
					long endTime = System.currentTimeMillis();
					String needTime = String.valueOf((endTime - startTime)/1000);
					cLog.setUseTime(needTime);
					cLog.setResultCode(0);
					sqlManager().insert(cLog);
				}
				return "OK";
			}
			
		});
		
		return outFilePath;
	}

}
