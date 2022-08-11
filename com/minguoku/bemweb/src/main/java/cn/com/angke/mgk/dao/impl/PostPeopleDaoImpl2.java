package cn.com.angke.mgk.dao.impl;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDaoImpl;

import cn.com.angke.mgk.dao.PostPeopleDao2;

@Service
public class PostPeopleDaoImpl2 extends PlatformBaseDaoImpl implements PostPeopleDao2{

	public String TABLE_NAME = "WXK_POSTPEOPLE";
    
	public String SQL_SELECT = "select a.ID, SETTYPE,ENDTYPE "
			+ "from WXK_POSTPEOPLE a ";	
	//tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";
	
	public String SQL_VIEW = "";
	
	public String SQL_COUNT = "select count(a.ID) from WXK_POSTPEOPLE a \n";
	
	public PostPeopleDaoImpl2() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;
		
	}
}
