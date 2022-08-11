package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.PeopleDao;

@Service
public class PeopleDaoImpl extends PlatformBaseDaoImpl implements PeopleDao {
	
	public String TABLE_NAME = "WXK_PEOPLE";

	public String SQL_SELECT = "select a.ID, concat(IFNULL(LASTNAME,''),IFNULL(FIRSTNAME,'')) as PEOPLENAME, SEX  from WXK_PEOPLE a ";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_PEOPLE a \n";

	public PeopleDaoImpl() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;

	}


}
