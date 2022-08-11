package cn.com.angke.mgk.service;

import java.io.IOException;

import org.dom4j.DocumentException;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService2;

public interface BookService extends PlatformBaseService2{
	
	/**
	 * 解析文件，保存图书
	 * @param dir 文件路径
	 * @param BATID 批次号
	 * @return
	 * @throws IOException
	 * @throws DocumentException
	 */
	public JSONObject saveBook(String dir,String BATID) throws IOException, DocumentException;
	
	/**
	 * 保存批次号，直接获取批次号下的图书，并保存、建立索引
	 * @param data
	 * @return
	 * @throws IOException
	 * @throws DocumentException
	 */
	public JSONObject saveMakeID(JSONObject data) throws  Exception;
	
	/**
	 * 删除图书
	 * @param IDs
	 * @throws IOException
	 */
	public void delBook(JSONArray IDs) throws IOException;
	
	
	/**
	 * 删除批次号，同时删除批次号下的图书
	 * @param IDs
	 * @return
	 */
	public void delMakeID(JSONArray IDs) throws IOException;

	public void importExcel(String FileID) throws Exception;
	
	public void importExcel2(String filepath) throws Exception;
	
	
	public JSONArray Test() throws Exception;
	
	public JSONObject updateBook(JSONObject book) throws Exception;
	
	public JSONArray ZTtree() ;

	public JSONArray Edutree() ;

	public JSONObject importExcelNewFormat(String FileID) throws Exception;

	public void updateJson (String type, String id) throws Exception;

	public JSONObject updateOneBook(String bookId) throws Exception;

//	public void savePeople() throws Exception;
	
	public String getCustomerBooks (String customer);
	
	public void clearAllCustomerBooksCache();
	
}
