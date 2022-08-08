package cn.com.angke.book.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.book.dao.ReadRecordDao;

@Service
public class ReadRecordDaoImpl extends PlatformBaseDaoImpl implements ReadRecordDao{
	public String TABLE_NAME = "WXK_READRECORD";

	public String SQL_SELECT = "select ID,BOOKID,CTMID,IP,DATETIME from WXK_READRECORD a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_READRECORD a \n";

	public ReadRecordDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}


}
