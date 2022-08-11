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

import cn.com.angke.mgk.dao.PeopleRelDao;

@Service
public class PeopleRelDaoImpl extends PlatformBaseDaoImpl implements PeopleRelDao {

	public String TABLE_NAME = "WXK_PEOPLEREL";

	public String SQL_SELECT = "select a.ID, a.PEOPLE1ID, a.PEOPLE2ID, a.RELTYPE from WXK_PEOPLEREL a ";
	;
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_PEOPLEREL a  \n";

	public PeopleRelDaoImpl() {
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
			if(value==""){
				value = "1";
			}
			if (!(StringUtils.isBlank(value))) {
				value = value.trim();
				String field = con.getString("property");
				if (field.equals("ID")) {
					whereStr.append(" a.ID = ? and ");
					sqlParas.addPara(value, 12);
				}else if (field.equals("PEOPLE1ID")) {
					whereStr.append(" a.PEOPLE1ID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
					
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}

	
	/**
	 * 根据性别查询人物关系
	 * @param po 分页参数
	 * @param name 机构名称
	 * @return
	 */
	public JSONObject getList(PageOpt po){
		List data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_SELECT);
		//sql.append(" where name ="+name);
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

	
	public void calGetsSqlRel(PageOpt po, StringBuffer sql, SqlParas sqlParas) {
		if (po.getConditions() == null) {
			System.out.println(this.TABLE_NAME + ":条件是空的");
			return;
		}
		StringBuffer whereStr = new StringBuffer();
		whereStr.append(" where ");
		for (int i = 0; i < po.getConditions().size(); ++i) {
			JSONObject con = po.getConditions().getJSONObject(i);
			String value = con.getString("value");
			if(value ==""){
				value = "1";
			}
			if (!(StringUtils.isBlank(value))) {
				value = value.trim();
				String field = con.getString("property");
				if (field.equals("ID")) {
					whereStr.append(" a.ID = ? and ");
					sqlParas.addPara(value, 12);
				}else if (field.equals("PEOPLE1ID")) {
					whereStr.append(" a.PEOPLE1ID = NULL");
//					sqlParas.addPara(value, Types.VARCHAR);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}
	
	public JSONObject getlist(PageOpt po){
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		for (int i = 0; i < po.getConditions().size(); ++i) {
			JSONObject con = po.getConditions().getJSONObject(i);
			String field = con.getString("property");
			if (field.equals("PEOPLE1ID")) { // 年代
				sql.append("select a.* \n").append("from WXK_PEOPLEREL a where PEOPLE1ID = NULL \n");
				data = this.getJdbcTemplate().query(sql.toString(), null, null, readRows);
			}
		}
		JSONObject r = new JSONObject();
		r.put("total", data.size());
		JSONArray res = new JSONArray();
		res.addAll(data);
		r.put("items", res);
		return r;
	}
}
