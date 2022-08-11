package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl2;

import cn.com.angke.mgk.dao.BookEduDao;


@Service
public class BookEduDaoImpl extends PlatformBaseDaoImpl2 implements BookEduDao {

	public String TABLE_NAME = "WXK_BOOKEDUTYPE";

	public String SQL_SELECT = "select ID,BOOKID,EDUTYPEID from WXK_BOOKEDUTYPE a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_BOOKEDUTYPE a \n";

	public BookEduDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}

}
