package cn.com.angke.util;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.queryparser.classic.QueryParserBase;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.TopFieldCollector;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.wltea.analyzer.core.IKSegmenter;
import org.wltea.analyzer.core.Lexeme;
import org.wltea.analyzer.lucene.IKAnalyzer;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.somenew.config.service.Config;
import com.somenew.config.service.ConfigOpt;
import com.somenew.service.ServiceFactory;

public class LuceneSearch {

	public final static Occur SEARCH_LOGIC_AND = BooleanClause.Occur.MUST;
	public final static Occur SEARCH_LOGIC_OR = BooleanClause.Occur.SHOULD;
	public final static Occur SEARCH_LOGIC_NOT = BooleanClause.Occur.MUST_NOT;

	private final static int MaxRows = 100000000;
	// private String filePath = "/root/mgk/mgk/index";
	private String filePath;
	// private String filePath2 = "/root/mgk/mgk/index2";
	private String filePath2;
	private IKAnalyzer analyzer;
	private IndexSearcher searcher;
	private IndexSearcher searcher2;
	
	private DirectoryReader directoryReader;
	private DirectoryReader directoryReader2;
	

	public LuceneSearch() {
		try {
			Config vconfig = ServiceFactory.getInstance().getConfig();
			filePath = vconfig.getConfigValue("INDEXURL1");
			filePath2 = vconfig.getConfigValue("INDEXURL2");

			this.analyzer = new IKAnalyzer();
			this.analyzer.setUseSmart(false);

			Directory directory = FSDirectory.open(Paths.get(filePath));
			directoryReader = DirectoryReader.open(directory);
			searcher = new IndexSearcher(directoryReader);

			Directory directory2 = FSDirectory.open(Paths.get(filePath2));
			directoryReader2 = DirectoryReader.open(directory2);
			searcher2 = new IndexSearcher(directoryReader2);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void rebuildSearch() throws IOException {
		DirectoryReader tdr = DirectoryReader.openIfChanged(directoryReader);
		if(tdr != null) {
			directoryReader.close();
			directoryReader = tdr;
			searcher = new IndexSearcher(directoryReader);
		}
	}

	public void rebuildSearch2() throws IOException {
		DirectoryReader tdr = DirectoryReader.openIfChanged(directoryReader2);
		if(tdr != null) {
			directoryReader2.close();
			directoryReader2 = tdr;
			searcher2 = new IndexSearcher(directoryReader2);
		}
	}
	

	// public void start() throws IOException{
	// this.useSmart = true;
	//
	// this.analyzer = new IKAnalyzer();
	// this.analyzer.setUseSmart(useSmart);
	//
	// Directory directory = FSDirectory.open(Paths.get(filePath));
	// DirectoryReader directoryReader = DirectoryReader.open(directory);
	// searcher = new IndexSearcher(directoryReader);
	// }
	//
	// public void destroy(){
	// this.analyzer = null;
	// this.searcher = null;
	// }
	/**
	 * @desc :按关键词搜索
	 * @param keyWord
	 * @return JSONArray
	 * @format [{"id":"****"},{},...,{}]
	 */
	@SuppressWarnings("deprecation")
	public JSONArray searchAll(String keyWord) throws IOException {
		if ((keyWord == null) || (keyWord.equals("")))
			return null;
		else {
			JSONArray array = new JSONArray();
			BooleanQuery query = new BooleanQuery();
			query.add(new TermQuery(new Term("content", keyWord)), SEARCH_LOGIC_AND);
			this.rebuildSearch();
			ScoreDoc[] hits = searcher.search(query, MaxRows).scoreDocs;
			System.out.println(hits.length);
			for (ScoreDoc doc : hits) {
				JSONObject jsonObject = new JSONObject();
				Document document = searcher.doc(doc.doc);
				jsonObject.put("ID", document.get("id"));
				jsonObject.put("ZJ", document.get("zj"));
				jsonObject.put("PAGE", document.get("page"));
				jsonObject.put("TYPE", document.get("type"));

				if (!array.contains(jsonObject))
					array.add(jsonObject);
			}
			return array;
		}
	}

	/**
	 * @desc :按关键词搜索
	 * @param keyWord
	 * @return JSONArray
	 * @throws ParseException
	 * @format [{"id":"****"},{},...,{}]
	 */
	@SuppressWarnings("deprecation")
	public JSONArray search(String keyWord, Occur logic) throws IOException, ParseException {
		if ((keyWord == null) || (keyWord.equals("")))
			return null;
		else {
			JSONArray array = new JSONArray();
			String key = keyWord.trim();
			BooleanQuery bq = new BooleanQuery();  
			String[] fields = {"author","content", "title" };
			for (int i = 0; i < fields.length; i++) {
				IKSegmenter se = new IKSegmenter(new StringReader(key), true);
				Lexeme le = null;
				while ((le = se.next()) != null) {
					String tKeyWord = le.getLexemeText();
					String tFeild = fields[i];
					TermQuery tq = new TermQuery(new Term(tFeild, tKeyWord));
					bq.add(tq, SEARCH_LOGIC_OR);
				}
			}
			Sort sort = new Sort(new SortField(null,SortField.Type.SCORE,false));  
			//记录的得分排序
			TopFieldCollector collector = TopFieldCollector.create(sort , MaxRows  ,  false , false , false);  

			this.rebuildSearch();
			searcher.search(bq,collector);
			TopDocs docs = collector.topDocs();
			ScoreDoc[] hits = docs.scoreDocs;
			System.out.println(hits.length);
			for (ScoreDoc doc : hits) {
				JSONObject jsonObject = new JSONObject();
				Document document = searcher.doc(doc.doc);
				jsonObject.put("ID", document.get("id"));
				jsonObject.put("ZTTYPE", document.get("zttype"));
				jsonObject.put("DIR", document.get("dir"));
				// System.out.println(document.get("content"));

				if (!array.contains(jsonObject))
					array.add(jsonObject);
			}
			return array;
		}
	}

	/**
	 * @desc 按书本ID和关键词搜索
	 * 
	 * @param bookID
	 * @param keyWord
	 * @return JSONArray
	 * @format [{"zj":"****","page":"*****"},{},...,{}]
	 */

	@SuppressWarnings("deprecation")
	public JSONArray search(String bookID, String keyWord, Occur logic) throws IOException {
		if ((bookID == null) || (bookID.equals("")) || (keyWord == null) || (keyWord.equals("")))
			return null;
		else {
			JSONArray array = new JSONArray();
			String[] key = keyWord.split("\\s+");

			BooleanQuery query = new BooleanQuery();
			TermQuery termQuery = new TermQuery(new Term("id", bookID));
			query.add(termQuery, SEARCH_LOGIC_AND);

			BooleanQuery querys = new BooleanQuery();
			for (int i = 0; i < key.length; i++) {
				if (i == 0)
					querys.add(new TermQuery(new Term("content", key[i])), SEARCH_LOGIC_AND);
				else
					querys.add(new TermQuery(new Term("content", key[i])), logic);
			}
			query.add(querys, SEARCH_LOGIC_AND);

			this.rebuildSearch2();
			ScoreDoc[] hits = searcher2.search(query, MaxRows).scoreDocs;
			for (ScoreDoc doc : hits) {
				
				JSONObject jsonObject = new JSONObject();
				Document document = searcher2.doc(doc.doc);
				if(!document.get("vpage").equals("0")) {
				jsonObject.put("PZJ", document.get("pzj"));
				jsonObject.put("PAGE", document.get("page"));
				jsonObject.put("TITLE", "第" + document.get("page") + "页");
				jsonObject.put("ZJ", document.get("zj"));
				jsonObject.put("VPAGE", document.get("vpage"));
				if (!array.contains(jsonObject))
					array.add(jsonObject);
				}
			}
			return jsonArraySort(array);

		}
	}

	/**
	 * @desc 按书本ID、章节ID和关键词组合搜索
	 * @param bookID
	 * @param zj
	 * @param keyWord
	 * @return JSONArray
	 * @format [{"zj":"****","page":"*****"},{},...,{}]
	 */
	@SuppressWarnings("deprecation")
	public JSONArray search(String bookID, String zj, String keyWord, Occur logic) throws IOException {
		if ((bookID == null) || (bookID.equals("")) || (keyWord == null) || (keyWord.equals("")))
			return null;
		else {
			JSONArray array = new JSONArray();
			String[] key = keyWord.split("\\s+");

			BooleanQuery query = new BooleanQuery();
			query.add(new TermQuery(new Term("id", bookID)), SEARCH_LOGIC_AND);
			query.add(new TermQuery(new Term("zj", zj)), SEARCH_LOGIC_AND);

			BooleanQuery querys = new BooleanQuery();
			for (int i = 0; i < key.length; i++) {
				if (i == 0)
					querys.add(new TermQuery(new Term("content", key[i])), SEARCH_LOGIC_AND);
				else
					querys.add(new TermQuery(new Term("content", key[i])), logic);
			}
			query.add(querys, SEARCH_LOGIC_AND);

			this.rebuildSearch();
			ScoreDoc[] hits = searcher.search(query, MaxRows).scoreDocs;
			for (ScoreDoc doc : hits) {
				JSONObject jsonObject = new JSONObject();
				Document document = searcher.doc(doc.doc);
				jsonObject.put("ZJ", document.get("zj"));
				jsonObject.put("PAGE", document.get("page"));
				if (!array.contains(jsonObject))
					array.add(jsonObject);
			}
			return array;
		}
	}

	/**
	 * @desc :按关键词泛化搜索
	 * @param keyWord
	 * @return JSONArray
	 * @format [{"id":"****"},{},...,{}]
	 */
	@SuppressWarnings("deprecation")
	public JSONArray search(String keyWord) throws IOException, ParseException {
		if ((keyWord == null) || (keyWord.equals("")))
			return null;
		else {
			// analyzer.setUseSmart(false);
			JSONArray array = new JSONArray();
			String[] key = keyWord.split("\\s+");
			BooleanQuery query = new BooleanQuery();
			for (int i = 0; i < key.length; i++) {
				QueryParser parser = new QueryParser("content", analyzer);
				query.add(parser.parse(key[i]), LuceneSearch.SEARCH_LOGIC_OR);
			}

			this.rebuildSearch();
			ScoreDoc[] hits = searcher.search(query, MaxRows).scoreDocs;
			System.out.println(hits.length);
			for (ScoreDoc doc : hits) {
				JSONObject jsonObject = new JSONObject();
				Document document = searcher.doc(doc.doc);
				jsonObject.put("ID", document.get("id"));
				jsonObject.put("ZTTYPE", document.get("classification"));
				jsonObject.put("DIR", document.get("dir"));
				// System.out.println(document.get("content"));

				if (!array.contains(jsonObject))
					array.add(jsonObject);
			}
			// analyzer.setUseSmart(true);
			return array;
		}
	}

	/**
	 * @desc 按书本ID搜索
	 * 
	 * @param bookID
	 * @return JSONArray
	 * @format [{"id":"****","dir":"*****"},{},...,{}]
	 */
	@SuppressWarnings("deprecation")
	public JSONArray searchID(String bookID, Occur logic) throws IOException {
		if ((bookID.equals("")))
			return null;
		else {
			JSONArray array = new JSONArray();
			BooleanQuery query = new BooleanQuery();
			TermQuery termQuery = new TermQuery(new Term("id", bookID));
			query.add(termQuery, SEARCH_LOGIC_AND);

			this.rebuildSearch();
			ScoreDoc[] hits = searcher.search(query, MaxRows).scoreDocs;
			for (ScoreDoc doc : hits) {
				JSONObject jsonObject = new JSONObject();
				Document document = searcher.doc(doc.doc);
				jsonObject.put("ID", document.get("id"));
				jsonObject.put("ZTTYPE", document.get("zttype"));
				jsonObject.put("DIR", document.get("dir"));
				File dockfile = new File(ConfigOpt.getConfigValue("BOOKURL")+jsonObject.get("DIR")+File.separator+"dockbook");
				if(!dockfile.exists()){
					jsonObject.put("ISTEXT", '1');
				}else {
					jsonObject.put("ISTEXT", '0');
				}
				if (!array.contains(jsonObject))
					array.add(jsonObject);
			}
			return array;
		}
	}

	/**
	 * @desc :按书名关键词搜索
	 * @param keyWord
	 * @return JSONArray
	 * @format [{"id":"****"},{},...,{}]
	 */
	@SuppressWarnings("deprecation")
	public JSONArray searchByTitle(String keyWord, Occur logic) throws IOException {
		if ((keyWord == null) || (keyWord.trim().equals("")))
			return null;
		else {
			JSONArray array = new JSONArray();
			String[] key = keyWord.split("\\s+");

			BooleanQuery query = new BooleanQuery();
			query.add(new TermQuery(new Term("type", "title")), SEARCH_LOGIC_AND);

			BooleanQuery querys = new BooleanQuery();
			for (int i = 0; i < key.length; i++) {
				if (i == 0)
					querys.add(new TermQuery(new Term("content", key[i])), SEARCH_LOGIC_AND);
				else
					querys.add(new TermQuery(new Term("content", key[i])), logic);
			}
			query.add(querys, SEARCH_LOGIC_AND);

			this.rebuildSearch();
			ScoreDoc[] hits = searcher.search(query, MaxRows).scoreDocs;
			for (ScoreDoc doc : hits) {
				JSONObject jsonObject = new JSONObject();
				Document document = searcher.doc(doc.doc);
				jsonObject.put("ID", document.get("id"));
				jsonObject.put("ZTTYPE", document.get("zttype"));
				jsonObject.put("DIR", document.get("dir"));
				if (!array.contains(jsonObject))
					array.add(jsonObject);
			}
			return array;
		}
	}

	/**
	 * 高级搜索
	 * 
	 * @param title
	 * @param author
	 * @param series
	 * @param publishername
	 * @param pubdate
	 * @param address
	 * @param keyword
	 * @param zttype
	 * @param edutype
	 * @return
	 * @throws IOException
	 * @throws ParseException
	 */
	public JSONArray search(String title, String author, String series, String publishername, String pubdate,
			String address, String keyword, String zttype, String edutype) throws IOException, ParseException {
		JSONArray array = new JSONArray();
		BooleanQuery.Builder queryBuilder = new BooleanQuery.Builder();
		IKAnalyzer analyzer2 = new IKAnalyzer();
		analyzer2.setUseSmart(false);
		// 书名
		if (StringUtils.isNotBlank(title)) {
			QueryParser parser = new QueryParser("title", this.analyzer);
			Query query = parser.parse(title);
//			Query query = new TermQuery(new Term("title", title));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// 作者
		if (StringUtils.isNotBlank(author)) {
			QueryParser parser = new QueryParser("author", analyzer2);
			Query query = parser.parse(author);
//			Query query = new TermQuery(new Term("author", author));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// 丛书
		if (StringUtils.isNotBlank(series)) {
			QueryParser parse = new QueryParser("series", analyzer2);
			Query query = parse.parse(series);
//			Query query = new TermQuery(new Term("series", series));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// 出版社
		if (StringUtils.isNotBlank(publishername)) {
			QueryParser parser = new QueryParser("publishername", analyzer2);
			Query query = parser.parse(QueryParserBase.escape(publishername));
//			Query query = new TermQuery(new Term("publishername", QueryParserBase.escape(publishername)));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// 出版地
		if (StringUtils.isNotBlank(address)) {
//			QueryParser parser = new QueryParser("address", analyzer2);
//			Query query = parser.parse(QueryParserBase.escape(address));
			Query query = new TermQuery(new Term("address", QueryParserBase.escape(address)));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// 出版年
		if (StringUtils.isNotBlank(pubdate)) {
			QueryParser parser = new QueryParser("pubdate", analyzer2);
			Query query = parser.parse(QueryParserBase.escape(pubdate));
//			Query query = new TermQuery(new Term("pubdate", QueryParserBase.escape(pubdate)));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// // 主题词
		if (StringUtils.isNotBlank(keyword)) {
			QueryParser parser = new QueryParser("tags", analyzer);
			Query query = parser.parse(keyword);
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// 中图法分类
		if (StringUtils.isNotBlank(zttype)) {
			Query query = new TermQuery(new Term("zttype", zttype));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		// 学科分类
		if (StringUtils.isNotBlank(edutype)) {
			Query query = new TermQuery(new Term("edutype", edutype));
			queryBuilder.add(query, SEARCH_LOGIC_AND);
		}
		BooleanQuery query = queryBuilder.build(); // 这才是最终的query
		
		this.rebuildSearch();
		ScoreDoc[] hits = searcher.search(query, MaxRows).scoreDocs;
		for (ScoreDoc doc : hits) {
			JSONObject jsonObject = new JSONObject();
			Document document = searcher.doc(doc.doc);
			jsonObject.put("ID", document.get("id"));
			jsonObject.put("ZTTYPE", document.get("zttype"));
			jsonObject.put("DIR", document.get("dir"));
			if (!array.contains(jsonObject))
				array.add(jsonObject);
		}
		return array;
	}

	// 在搜索oldkeyword的结果集中搜索keyword.
	public JSONArray searchInResult(JSONArray Keywords) throws ParseException, IOException {
		if (Keywords == null)
			return null;
		else {
			JSONArray array = new JSONArray();
			// 多条件必备神器
			BooleanQuery.Builder builder = new BooleanQuery.Builder();
			for (int i = 0; i < Keywords.size(); i++) {
				QueryParser parser = new QueryParser("content", analyzer);
				Query query = parser.parse(Keywords.getString(i).trim());
				builder.add(query, Occur.MUST);
			}
			BooleanQuery query = builder.build();
			
			this.rebuildSearch();
			ScoreDoc[] hits = searcher.search(query, MaxRows).scoreDocs;
			System.out.println(hits.length);
			for (ScoreDoc doc : hits) {
				JSONObject jsonObject = new JSONObject();
				Document document = searcher.doc(doc.doc);
				jsonObject.put("ID", document.get("id"));
				jsonObject.put("ZTTYPE", document.get("zttype"));
				jsonObject.put("DIR", document.get("dir"));

				if (!array.contains(jsonObject))
					array.add(jsonObject);
			}
			return array;
		}
	}
	
	 public static JSONArray jsonArraySort(JSONArray jsonArr) {
			JSONArray sortedJsonArray = new JSONArray();
			List<JSONObject> jsonValues = new ArrayList<JSONObject>();
			for (int i = 0; i < jsonArr.size(); i++) {
				jsonValues.add(jsonArr.getJSONObject(i));
			}
			Collections.sort(jsonValues, new Comparator<JSONObject>() {
				private static final String KEY_NAME = "PAGE";

				@Override
				public int compare(JSONObject a, JSONObject b) {
					String valA = new String();
					String valB = new String();
					try {
						 valA = a.getString(KEY_NAME);
						 valB = b.getString(KEY_NAME);
					} catch (JSONException e) {
					}
					return -valB.compareTo(valA);//倒序
				}
			});
			for (int i = 0; i < jsonArr.size(); i++) {
				sortedJsonArray.add(jsonValues.get(i));
			}
			return sortedJsonArray;
		}

}
