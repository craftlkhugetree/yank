package cn.com.angke.books;

import java.io.IOException;
import java.nio.file.Paths;

import org.apache.commons.lang3.StringUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.wltea.analyzer.lucene.IKAnalyzer;

import com.somenew.config.service.Config;
import com.somenew.service.ServiceFactory;

public class LuceneWrite {

	// private String filePath2 = "/root/mgk/mgk/index2/";
	// private String filePath = "/root/mgk/mgk/index/";
	private String filePath;
	private String filePath2;
	private boolean useSmart;

	private IKAnalyzer analyzer;
	private IndexWriter writer;
	private IndexWriter writer2;

	public LuceneWrite() {
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public boolean getUseSmart() {
		return useSmart;
	}

	public void setUseSmart(boolean useSmart) {
		this.useSmart = useSmart;
	}

	public void destroy() {
		this.analyzer = null;
		this.writer = null;
		this.writer2 = null;
	}

	public void start() throws IOException {
		Config vconfig = ServiceFactory.getInstance().getConfig();
		filePath = vconfig.getConfigValue("INDEXURL1");
		filePath2 = vconfig.getConfigValue("INDEXURL2");

		this.useSmart = false;
		this.analyzer = new IKAnalyzer();
		this.analyzer.setUseSmart(this.useSmart);

		Directory directory = FSDirectory.open(Paths.get(filePath));
		// IndexWriter.isLocked(directory);
		IndexWriterConfig indexWriterConfig = new IndexWriterConfig(analyzer);
		indexWriterConfig.setOpenMode(OpenMode.CREATE_OR_APPEND);
		this.writer = new IndexWriter(directory, indexWriterConfig);

		Directory directory2 = FSDirectory.open(Paths.get(filePath2));
		// IndexWriter.isLocked(directory2);
		IndexWriterConfig indexWriterConfig2 = new IndexWriterConfig(analyzer);
		indexWriterConfig.setOpenMode(OpenMode.CREATE_OR_APPEND);
		this.writer2 = new IndexWriter(directory2, indexWriterConfig2);
	}

	public void close() throws IOException {
		this.writer.close();
		this.writer2.close();
	}

	/**
	 * @desc 对全文文本建索引
	 * @param id
	 *            图书ID
	 * @param dir
	 *            图书存放目录
	 * @param zj
	 *            文本所在图书章节
	 * @param page
	 *            文本所在图书页号
	 * @param type
	 *            表示该记录类型 charpte，toc、title、para等
	 * @param content
	 */

	public void analyze(String id, String dir, String zj, String page, String vpage, String zttype, String type,
			String content) throws IOException {

		Document document = new Document();
		document.add(new StringField("id", id, Field.Store.YES));
		document.add(new StringField("dir", dir, Field.Store.YES));
		document.add(new StringField("zj", zj, Field.Store.YES));
		document.add(new StringField("page", page, Field.Store.YES));
		// document.add(new StringField("vpage", vpage, Field.Store.YES));
		document.add(new StringField("zttype", zttype, Field.Store.YES));
		document.add(new StringField("type", type, Field.Store.YES));
		document.add(new TextField("content", content, Field.Store.NO));

		writer.addDocument(document);
	}

	/**
	 * @desc 对全文文本建索引
	 * @param id
	 *            图书ID
	 * @param dir
	 *            图书存放目录
	 * @param zj
	 *            文本所在图书章节
	 * @param page
	 *            文本所在图书页号
	 * @param type
	 *            表示该记录类型 charpte，toc、title、para等
	 * @param content
	 */

	public void analyze(String id, String dir, String zj, String page, String vpage, String type, String content)
			throws IOException {

		Document document = new Document();
		document.add(new StringField("id", id, Field.Store.YES));
		document.add(new StringField("dir", dir, Field.Store.YES));
		document.add(new StringField("zj", zj, Field.Store.YES));
		document.add(new StringField("page", page, Field.Store.YES));
		document.add(new StringField("vpage", vpage, Field.Store.YES));
		document.add(new StringField("type", type, Field.Store.YES));
		document.add(new TextField("content", content, Field.Store.NO));
		writer2.addDocument(document);
	}

	public void analyze(String id, String dir, String zttype,  String zttype2, String edutype, String title, String publish,
			String address, String pubdate, String series, String tags,String author, String content) throws IOException {
		Document document = new Document();
		document.add(new StringField("id", id, Field.Store.YES));
		document.add(new StringField("dir", dir, Field.Store.YES));
		if (StringUtils.isNotBlank(zttype))
			document.add(new StringField("zttype", zttype, Field.Store.YES));
		if (StringUtils.isNotBlank(zttype2))
			document.add(new StringField("zttype", zttype2, Field.Store.YES));
		if (StringUtils.isNotBlank(edutype))
			document.add(new StringField("edutype", edutype, Field.Store.YES));
		TextField titleField = new TextField("title", title, Field.Store.YES);
		titleField.setBoost(9F);
		document.add(titleField);
		// document.add(new TextField("title", title, Field.Store.YES));
		document.add(new TextField("publishername", publish, Field.Store.YES));
		document.add(new TextField("address", address, Field.Store.YES));
		document.add(new TextField("pubdate", pubdate, Field.Store.YES));
		if (StringUtils.isNotBlank(series))
			document.add(new TextField("series", series, Field.Store.YES));
		document.add(new TextField("tags", tags, Field.Store.YES));
		document.add(new TextField("author", author, Field.Store.YES));
		document.add(new TextField("content", content, Field.Store.NO));
		writer.addDocument(document);
	}

	public void delete(String id) throws IOException {
		writer.deleteDocuments(new TermQuery(new Term("id", id)));
		writer2.deleteDocuments(new TermQuery(new Term("id", id)));
	}

	public void deleteAll() throws IOException {
		writer.deleteAll();
		writer2.deleteAll();
	}
}
