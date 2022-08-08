package cn.com.angke.book.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.book.dao.VisitRecordDao;


@Service
public class VisitRecordDaoImpl extends PlatformBaseDaoImpl implements VisitRecordDao {

	public String TABLE_NAME = "WXK_VISITRECORD";

	public String SQL_SELECT = "select ID,USERIP,DATETIME from WXK_VISITRECORD a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_VISITRECORD a \n";

	public VisitRecordDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}

}
