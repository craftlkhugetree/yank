package cn.com.angke.mgk.service;

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;

public interface FileService {
	/**
	 * 从输入流保存文件
	 * @param filename
	 * @param fileinputstream
	 * @return 附件对象
	 */
	public JSONObject saveFile(String filename,InputStream fileinputstream);

	
	

	/**
	 * 把文件内容输出到response
	 * @param ID
	 * @param request
	 * @param response
	 */
	public void outFileContentToResponse(String ID,HttpServletRequest request, HttpServletResponse response);
	
	/**
	 * 使用附件，当某个对象关联到本附件时需要调用到方法
	 * @param ID 附件ID
	 * @param tableName 要使用本附件的表名
	 * @param fieldName　要使用本附件的表的字段名
	 * @param objID　要使用本附件的记录的主键值
	 */
	public void useFile(String ID,String tableName,String fieldName,String objID);
	

	/**
	 * 删除附件，本方法并不立即删除附件，只会把对本附件的使用信息删除，如果该附件不再其它表使用，则会在24小时后的专门清除附件的线程中清理该附件
	 * @param ID
	 * @param tableName
	 * @param fieldName
	 * @param objID
	 */
	public void delFile(String ID,String tableName,String fieldName,String objID);
	
	/**
	 * 获取附件路径及文件名
	 * @param ID
	 */
	public JSONObject getFilePath(String ID);
	
	/**
	 * 处理对象的文件
	 * @param data　新对象值
	 * @param oldData　原对象值　
	 * @param tableName　对象表名
	 * @param fieldName　关联附件的外键
	 */
	public void processObjFile(JSONObject data,JSONObject oldData,String tableName,String fieldName,boolean isNew);
	
}
