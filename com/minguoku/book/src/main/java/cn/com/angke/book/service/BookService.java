package cn.com.angke.book.service;

import java.io.IOException;

import org.apache.lucene.queryparser.classic.ParseException;
import org.dom4j.DocumentException;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseService;

public interface BookService extends PlatformBaseService{
	
	/**
	 * 查询图书
	 * @param KEYWORD 关键词
	 * @throws IOException
	 */
	public JSONObject searchBook(JSONArray keyWord,int start,int limit,String ip) throws IOException, ParseException;

	/**
	 * 根据分类查询图书
	 * @param BOOKID
	 * @param start
	 * @param limit
	 * @param ip
	 * @return
	 * @throws IOException
	 */
	public JSONObject searchBookByType(String BOOKID,int start,int limit,String ip) throws IOException;

	/**
	 * 图书内关键词检索
	 * @param bookid
	 * @param keyword
	 * @return
	 */
	public JSONObject searchBookByID(String bookid, String keyword) throws IOException;
	
	
	/**
	 * 高级搜索
	 * @param key
	 * @param ip
	 * @return
	 * @throws IOException
	 * @throws ParseException
	 */
	public JSONObject advancedSearch(JSONObject key,String ip) throws IOException,ParseException;
	/**
	 * 高级搜索  数据库实现
	 * @param key
	 * @param ip
	 * @return
	 * @throws IOException
	 * @throws ParseException
	 */
	public JSONObject advancedSearchDb(JSONObject key,String ip) throws IOException,ParseException;
	
	/**
	 * 根据ip判断用户对此类型的书是否可阅读
	 * @param ip
	 * @param dir
	 * @param ZTSYMBOL
	 * @return
	 * @throws DocumentException
	 */
	public JSONObject readBook(String ip,String dir,String ZTSYMBOL) throws Exception;
	
	/**
	 * 图书内关键词检索
	 * @param BOOKID
	 * @param KEYWORD
	 * @return
	 * @throws IOException
	 */
	public JSONObject inBookSearch(String BOOKID,String KEYWORD,String DIR) throws IOException,DocumentException;
	
	
	/**
	 * 分类浏览
	 * @return
	 */
	public JSONObject categorySearch();
	
	/**
	 * 保存下载记录
	 * @param iP
	 * @param data
	 * @return
	 * @throws IOException
	 * @throws DocumentException
	 */
	public JSONObject saveDownRecord(String iP,JSONObject data) throws IOException,DocumentException;
	
	/**
	 * 保存引用记录
	 * @param iP
	 * @param data
	 * @return
	 */
	public JSONObject saveQuoteRecord(String iP,JSONObject data);
	
	/**
	 * 文献引用
	 * @param data
	 * @return
	 * @throws IOException
	 */
	public JSONObject citation(JSONObject data) throws IOException;
	
	
	/**
	 * 获取每页关键词
	 * @param bookid
	 * @param page
	 * @param type
	 * @return
	 */
	public JSONObject pageEntry(String bookid,Integer page,String type);
	
	/**
	 * 关键词提示信息
	 * @param name
	 * @param type
	 * @return
	 */
	public JSONObject getEntry(String name,String type);
	
	/**
	 * 中图库树
	 * @param 
	 * @return
	 */
	public JSONArray ZTtree() ;
	
	/**
	 * 根据ip获取客户
	 * @param Ip
	 * @return
	 */
	public JSONObject getCustomerForIp(String Ip);
	
	/**
	 * 创建索引的文件
	 * @param id
	 * @param type
	 * @return
	 */
	public String createQuote(String id, String type,String url);

	/**
	 * 检查批次
	 * @return
	 */
	public JSONObject checkHasText();
	
	/**
	 * 获取客户的书籍
	 * @param customer
	 * @return
	 */
	public String getCustomerBooks (String customer);

}
