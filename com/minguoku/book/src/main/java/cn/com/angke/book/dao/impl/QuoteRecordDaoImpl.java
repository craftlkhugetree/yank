package cn.com.angke.book.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.book.dao.QuoteRecordDao;


@Service
public class QuoteRecordDaoImpl extends PlatformBaseDaoImpl implements QuoteRecordDao {

	public String TABLE_NAME = "WXK_QUOTERECORD";

	public String SQL_SELECT = "select ID,BOOKID,USERIP,DATETIME from WXK_QUOTERECORD a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_QUOTERECORD a \n";

	public QuoteRecordDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}

}
