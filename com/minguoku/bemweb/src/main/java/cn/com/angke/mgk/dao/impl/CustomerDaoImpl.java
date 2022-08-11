package cn.com.angke.mgk.dao.impl;

import java.sql.Types;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.PageSqlOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.db.SqlParas;
import com.somenew.utils.DateOpt;
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.dao.CustomerDao;

@Service
public class CustomerDaoImpl extends PlatformBaseDaoImpl implements CustomerDao {

	public String TABLE_NAME = "CRM_CUSTOMER";

	public String SQL_SELECT = "select ID, NAME, NICKNAME,ADDR,PRINCIPAL,PRINCIPALMOBILE,PRINCIPALEMAIL,PRINCIPALQQ,CONTACT,CONTACTMOBILE, "
			+ " CONTACTEMAIL,CONTACTQQ,PHONE,FAX,UNITTYPE,ISVALID,OPENBANK,OPENNUM,TAXNUM,SORTNUM,STATUS from CRM_CUSTOMER a where a.ISVALID=1 ";
//	public String SQL_SELECT = "select ID, NAME, VIEWCOUNT,DWFZR,DWFZRTEL,DWFZREMAIL,DWFZRQQ,DGFZR,DGFZRTEL,DGFZREMAIL, "
//			+ " DGFZRQQ,ADDRESS from CRM_CTM a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from CRM_CUSTOMER a where a.ISVALID=1 \n";

	public CustomerDaoImpl() {
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
		whereStr.append(" and ");
		for (int i = 0; i < po.getConditions().size(); i++) {
			con = po.getConditions().getJSONObject(i);
			value = con.getString("value");
			if (!StringUtils.isBlank(value)) {
				value = value.trim();
				field = con.getString("property");
				if (field.equals("ID")) {
					whereStr.append("a.ID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				} else if (field.equals("KEYWORD")) {
					whereStr.append(" a.NAME like ? and ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
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
	
	public JSONObject save(JSONObject obj) {
		if (StringUtils.isBlank(obj.getString("ID"))) {
			obj.put("ID", StringOpt.produceUUID());
			obj.put("SORTNUM", DateOpt.longDatetimeToStr(new Date()));
			obj.put("ISVALID", "1");
			System.out.println(obj.toJSONString());
			DbOpt.getInstance().insert(null, this.TABLE_NAME, obj);
		} else {
			System.out.println(obj.toJSONString());
			DbOpt.getInstance().updateByKey(null, this.TABLE_NAME, obj, null);
		}
		return obj;
	}
	
	public int setDelete(JSONArray ID) {
		String[] byValues=(String[]) (String[]) ID.toArray(new String[0]);
		StringBuffer sql = new StringBuffer();
		sql.append("update " + TABLE_NAME + " set  ISVALID=0 ").append(" where ID in (");
		for (int i = 0; i < byValues.length; ++i) {
			sql.append("'"+byValues[i]+"',");
		}
		sql.delete(sql.length() - 1, sql.length());
		sql.append(")");
		return DbOpt.getInstance().getJdbcTemplate().update(sql.toString());
	
	}

}
