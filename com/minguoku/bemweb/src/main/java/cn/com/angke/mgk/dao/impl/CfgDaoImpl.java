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

import cn.com.angke.mgk.dao.CfgDao;

@Service
public class CfgDaoImpl extends PlatformBaseDaoImpl implements CfgDao {

	public String TABLE_NAME = "CM_CFG";

	public String SQL_SELECT = "select a.* from CM_CFG a";
	// tree
	public String SQL_TREE = "select a.ID from CM_CFG a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from CM_CFG a \n";

	public CfgDaoImpl() {
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
				}else if (field.equals("CODE")) {
					whereStr.append("a.CODE = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				} else if (field.equals("CFGGROUPID")) {
					whereStr.append("a.CFGGROUPID = ? and ");
					System.out.println(value);
					sqlParas.addPara(value, Types.VARCHAR);
				}   
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}

	public JSONObject list(PageOpt po) {
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

	@Override
	public boolean checkCode(String ID, String CODE) {
		String sql = "select ID from CM_CFG where CODE= '"+CODE+"' ";
		if(StringUtils.isNotBlank(ID)){
			sql +=" and ID != '"+ID+"'";
		}
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		if(list.size()>0){
			return false;
		}
		return true;
	}
	
	@Override
	public JSONObject viewById(String id) {
		String sql = "select * from CM_CFG where ID = '"+id+"'";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		JSONObject r = new JSONObject();
		if(list.size()==1){
			JSONObject item = list.get(0);
			item.put("CFGVALUE", JSONObject.parse(item.getString("CFGVALUE")));
			r.put("item", item);
		}else{
			r.put("item", new JSONObject());
		}
		return r;
	}

	@Override
	public JSONObject viewByCode(String CODE) {
		String sql = "select * from CM_CFG where CODE = '"+CODE+"'";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		JSONObject r = new JSONObject();
		if(list.size()==1){
			JSONObject item = list.get(0);
			return JSONObject.parseObject(item.getString("CFGVALUE"));
		}else{
			return new JSONObject();
		}
	}
}
