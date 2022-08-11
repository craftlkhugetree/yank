package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl2;

import cn.com.angke.mgk.dao.EduTypeDao;

@Service
public class EduTypeDaoImpl extends PlatformBaseDaoImpl2 implements EduTypeDao {

	public String TABLE_NAME = "WXK_EDUTYPE";

	public String SQL_SELECT = "select ID, PID, EDUCODE, EDUNAME,EDUDESC from WXK_EDUTYPE a";
	// tree
	public String SQL_TREE = "select ID, PID,EDUCODE, EDUNAME, EDUDESC from WXK_EDUTYPE a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_EDUTYPE a \n";

	public EduTypeDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}

}
