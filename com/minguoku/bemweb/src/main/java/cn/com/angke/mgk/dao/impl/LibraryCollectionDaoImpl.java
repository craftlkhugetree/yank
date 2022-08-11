package cn.com.angke.mgk.dao.impl;

import java.sql.Types;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PageSqlOpt;
import com.somenew.db.PlatformBaseDaoImpl2;
import com.somenew.db.SqlParas;

import cn.com.angke.mgk.dao.LibraryCollectionDao;

@Service
public class LibraryCollectionDaoImpl extends PlatformBaseDaoImpl2 implements LibraryCollectionDao {

	public String TABLE_NAME = "WXK_GC";

	public String SQL_SELECT = "select a.ID, a.LIBRARYID,wl.NAME,wl.OPAC, a.BOOKID,a.COLTIME "
			+ "from WXK_GC a left join WXK_LIBRARY wl on (wl.ID=a.LIBRARYID)";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_GC a left join WXK_LIBRARY wl on (wl.ID=a.LIBRARYID)\n";

	public LibraryCollectionDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}
	
	public void calGetsSql(PageOpt po, StringBuffer sql, SqlParas sqlParas) {
		if (po.getConditions() == null) {
			System.out.println("条件是空的");
			return;
		}
		JSONObject con;
		String field, value;
		StringBuffer whereStr = new StringBuffer();
		whereStr.append(" where ");
		for (int i = 0; i < po.getConditions().size(); i++) {
			con = po.getConditions().getJSONObject(i);
			value = con.getString("value");
			if (!StringUtils.isBlank(value)) {
				value = value.trim();
				field = con.getString("property");
				if (field.equals("ID")) {
					whereStr.append("a.ID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				} else if(field.equals("BOOKID")){
					whereStr.append("a.BOOKID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				} else if (field.equals("KEYWORD")) {
					whereStr.append(" (wl.NAME like ? or ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
					whereStr.append(" wl.OPAC like ? ) and ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}

	public JSONObject list2(PageOpt po) {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(SQL_SELECT);
		SqlParas sqlParas = new SqlParas();
		calGetsSql(po, sql, sqlParas);
		if (po.getIsOrderby()) {
			sql.append(" order by ").append(po.getOrderby());
		}
		String dosql = sql.toString();
		if (po.getIsPage()) {
			dosql = PageSqlOpt.getPaginationString(dosql, po.getStart(), po.getPageSize());
		}
		System.out.println(dosql);
		data = getJdbcTemplate().query(dosql, sqlParas.getVs(), sqlParas.getTypes(), readRows);

		sql = new StringBuffer();
		sql.append(this.SQL_COUNT);
		sqlParas = new SqlParas();
		calGetsSql(po, sql, sqlParas);
		int cnt = ((Integer) getJdbcTemplate().queryForObject(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
				Integer.class)).intValue();

		JSONObject r = new JSONObject();
		r.put("total", Integer.valueOf(cnt));
		JSONArray res = new JSONArray();
		res.addAll(data);
		r.put("items", res);
		return r;
	}
}
