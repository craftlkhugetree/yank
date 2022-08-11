package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.GeographyDao2;

@Service
public class GeographyDaoImpl2 extends PlatformBaseDaoImpl implements GeographyDao2{

	public String TABLE_NAME = "WXK_GEOGRAPHY";

	public String SQL_SELECT = "select ID, NAME from WXK_GEOGRAPHY a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_GEOGRAPHY a \n";

	public GeographyDaoImpl2() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}
	
}
