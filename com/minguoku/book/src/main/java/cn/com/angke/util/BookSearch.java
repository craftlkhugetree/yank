package cn.com.angke.util;

import java.io.IOException;

import org.apache.lucene.queryparser.classic.ParseException;

import com.alibaba.fastjson.JSONArray;
import com.spreada.utils.chinese.ZHConverter;

public class BookSearch {
	
	
	private LuceneSearch luceneSearch;
	private static BookSearch bookSearch=new BookSearch();
	
	public BookSearch(){
		luceneSearch = new LuceneSearch();
	}
	
	/** 返回一个单例 **/
	public static BookSearch instance(){
		return bookSearch;
	}
	
	public static String big5ToChinese(String s) {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		return converter.convert(s);
	}

	public static String ChineseTobig5(String s) {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.TRADITIONAL);
		return converter.convert(s);
	}
	
	public JSONArray search(String keyWord) throws IOException, ParseException{
		return luceneSearch.search(keyWord, LuceneSearch.SEARCH_LOGIC_OR);
	}
	
	public JSONArray search(String id ,String keyWord) throws IOException{
		return luceneSearch.search(id, keyWord, LuceneSearch.SEARCH_LOGIC_OR);
	}
	
	public JSONArray search(String id, String zj, String keyWord) throws IOException{
		return luceneSearch.search(id, zj, keyWord, LuceneSearch.SEARCH_LOGIC_OR);
	}
	
	public JSONArray searchID(String id) throws IOException{
		return luceneSearch.searchID(id,LuceneSearch.SEARCH_LOGIC_OR);
	}

	public JSONArray searchAll(String keyWord) throws IOException, ParseException{
		return luceneSearch.search(keyWord);
	}
	
	public JSONArray search(String title,String author,String series, String publishername, String pubdate,
			String address, String keyword,String zttype,String edutype) throws IOException, ParseException{
		return luceneSearch.search(title,author,series,publishername,pubdate,address,keyword,zttype,edutype);
	}
	
	public JSONArray searchInResult(JSONArray keyWords) throws IOException, ParseException{
		return luceneSearch.searchInResult(keyWords);
	}
	
}
