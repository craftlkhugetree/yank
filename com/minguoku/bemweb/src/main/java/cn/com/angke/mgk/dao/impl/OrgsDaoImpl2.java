package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.OrgsDao2;

@Service
public class OrgsDaoImpl2 extends PlatformBaseDaoImpl implements OrgsDao2 {
	
	public String TABLE_NAME = "WXK_ORG";

	public String SQL_SELECT = "select a.ID, NAME from WXK_ORG a ";
	// tree
	public String SQL_TREE = "select a.ID,a.PARENTID,NAME from WXK_ORG a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_ORG a \n";

	public OrgsDaoImpl2() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;

	}

}
