package cn.com.angke.mgk.dao.impl;

import java.sql.Types;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PageSqlOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.db.SqlParas;

import cn.com.angke.mgk.dao.OrgDaoDto;

@Service
public class OrgDaoDtoImpl extends PlatformBaseDaoImpl implements OrgDaoDto {
	
	public String TABLE_NAME = "WXK_ORG";

	public String SQL_SELECT = "select a.ID, a.NAME, a.PARENTID , b.NAME as PARENTNAME, a.TYPE, a.SETACCORDING, a.ENDACCORDING, a.SETDATE, a.ENDDATE, a.SOURCEORGID, a.DORDER, "+
		"c.NAME as ACCORDINGNAME , d.NAME as ENDACCORDINGNAME,au.NAME as CREATER,a.CREATEDATE,aub.NAME as MODIFIER,a.MODIFYDATE "
		+ " from WXK_ORG a "
		+ "left join WXK_ORG b on b.ID = a.PARENTID "
		+ "left join WXK_SETENDACCORDING c on a.SETACCORDING=c.ID "
		+ "LEFT JOIN WXK_SETENDACCORDING d on a.ENDACCORDING=d.ID "
		+ "LEFT JOIN AU_USER au on a.CREATER=au.ID "
		+ "LEFT JOIN AU_USER aub on a.MODIFIER=aub.ID";
	// tree
	public String SQL_TREE = "select a.ID,a.PARENTID,NAME from WXK_ORG a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_ORG a \n";

	public OrgDaoDtoImpl() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;

	}
	
	/**
	 * 拼接SQL
	 */
	public void calGetsSql(PageOpt po, StringBuffer sql, SqlParas sqlParas) {
		if (po.getConditions() == null) {
			System.out.println(this.TABLE_NAME + ":条件是空的");
			return;
		}
		StringBuffer whereStr = new StringBuffer();
		whereStr.append(" where ");
		for (int i = 0; i < po.getConditions().size(); ++i) {
			JSONObject con = po.getConditions().getJSONObject(i);
			String value = con.getString("value");
			if (!(StringUtils.isBlank(value))) {
				value = value.trim();
				String field = con.getString("property");
					if (field.equals("PARENTID")) {
						whereStr.append(" a.PARENTID = ? and ");
						sqlParas.addPara(value, Types.VARCHAR);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}

	
	public void callGetsSql(PageOpt po, StringBuffer sql, SqlParas sqlParas) {
		if (po.getConditions() == null) {
			System.out.println(this.TABLE_NAME + ":条件是空的");
			return;
		}
		StringBuffer whereStr = new StringBuffer();
		whereStr.append(" where ");
		for (int i = 0; i < po.getConditions().size(); ++i) {
			JSONObject con = po.getConditions().getJSONObject(i);
			String value = con.getString("value");
			if (!(StringUtils.isBlank(value))) {
				value = value.trim();
				String field = con.getString("property");
					if (field.equals("ID")) {
						whereStr.append(" a.ID = ? and ");
						sqlParas.addPara(value, 12);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	} 
	
	/**
	 * 查询作为父机构的总记录数
	 */
	public int getCount(PageOpt po){
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_COUNT);
		SqlParas sqlParas = new SqlParas();
		calGetsSql( po, sql, sqlParas); 
		int account = ((Integer) getJdbcTemplate().queryForObject(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
				Integer.class)).intValue();
		return  account;
	}
	
	/**
	 * 查询单条机构记录信息
	 * @param po
	 * @return
	 */
	public JSONObject getGridById(PageOpt po) {

		List data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_SELECT);
		// sql.append(" where name ="+name);
		SqlParas sqlParas = new SqlParas();
		callGetsSql(po, sql, sqlParas);
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
		callGetsSql(po, sql, sqlParas);
		int cnt = ((Integer) getJdbcTemplate().queryForObject(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(),
				Integer.class)).intValue();

		JSONObject r = new JSONObject();
		r.put("total", Integer.valueOf(cnt));
		JSONArray res = new JSONArray();
		res.addAll(data);
		r.put("items", res);
		return r;

	}
	

	/**
	 * 查询父机构下的所有子机构信息
	 * @param po
	 * @return
	 */
	public JSONObject getGrid(PageOpt po) {

		List data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_SELECT);
		// sql.append(" where name ="+name);
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
