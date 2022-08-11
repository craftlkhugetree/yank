package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.RelationShipDao;


@Service
public class RelationShipDaoImpl extends PlatformBaseDaoImpl implements RelationShipDao {
	
	public String TABLE_NAME = "WXK_RELATION";

	public String SQL_SELECT = "select a.ID, RID ,MID, MSEX from WXK_RELATION a  ";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_RELATION a \n";

	public RelationShipDaoImpl() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;

	}

	

}
