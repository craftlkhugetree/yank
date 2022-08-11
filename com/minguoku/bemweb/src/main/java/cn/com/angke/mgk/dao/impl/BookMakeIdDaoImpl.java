package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.BookMakeIdDao;


@Service
public class BookMakeIdDaoImpl extends PlatformBaseDaoImpl implements BookMakeIdDao {

	public String TABLE_NAME = "WXK_MAKEID";

	public String SQL_SELECT = "select ID,BATID,MAKER,BEGINID,ENDID from WXK_MAKEID a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_MAKEID a \n";

	public BookMakeIdDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}

}
