package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl2;

import cn.com.angke.mgk.dao.BookDao;


@Service
public class BookDaoImpl extends PlatformBaseDaoImpl2 implements BookDao {

	public String TABLE_NAME = "WXK_BOOK";

	public String SQL_SELECT = "select ID,TITLE,PAID,PUBLISHINGID,DATE,PAGECOUNT,HEIGHT,WIDTH,SERIES,TEXTNOTE,CONTENTNOTE,"
			+ "BOOKDIR,TAGS,BTYPE,BLANGUAGE,USERID,OPERATEDATE,BATID,BOOKID,CREATETIME,UPDATETIME from WXK_BOOK a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_BOOK a \n";

	public BookDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}

}
