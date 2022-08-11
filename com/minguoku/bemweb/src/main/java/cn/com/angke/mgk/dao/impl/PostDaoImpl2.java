package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.PostDao2;

@Service
public class PostDaoImpl2 extends PlatformBaseDaoImpl implements PostDao2 {

	public String TABLE_NAME = "WXK_POST";
    
	public String SQL_SELECT = "select  a.ID, NAME "
			+ "from WXK_POST a";	
	//tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";
	
	public String SQL_VIEW = "";
	
	public String SQL_COUNT = "select count(a.ID) from WXK_POST a \n";
	
	public PostDaoImpl2() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;
		
	}
}
