package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.OfficeTypeDao;

@Service
public class OfficeTypeDaoImpl extends PlatformBaseDaoImpl implements OfficeTypeDao {
	
	public String TABLE_NAME = "WXK_OFFICETYPE";

	public String SQL_SELECT = "select a.ID,TYPE, NAME from WXK_OFFICETYPE a";
	// tree
	public String SQL_TREE = "select a.ID,a.PARENTID,NAME from WXK_OFFICETYPE a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_OFFICETYPE a \n";

	public OfficeTypeDaoImpl() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;

	}


}
