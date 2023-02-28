package cn.com.angke.lres.service;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

public interface FileUploadService {
	String uploadVideo(CommonsMultipartFile file) throws Exception;
	String uploadImage(CommonsMultipartFile file) throws Exception;
	String uploadFile(CommonsMultipartFile file) throws Exception;
}
