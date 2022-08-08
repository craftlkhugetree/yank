package cn.com.angke.book.dao.impl;

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

import cn.com.angke.book.dao.OrderDao;


@Service
public class OrderDaoImpl extends PlatformBaseDaoImpl implements OrderDao {

	public String TABLE_NAME = "CRM_ORDER";

	public String SQL_SELECT = "select ID,ORDERNAME,CTID,BEGINDATE,ENDDATE,ZJE,YF,RESOURCEID,OPERATER,OPERATETIME,CHECKER,CHECKTIME,ISVALID from CRM_ORDER a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from CRM_ORDER a \n";

	public OrderDaoImpl() {
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
		whereStr.append(" where a.ISVALID=1 and ");
		for (int i = 0; i < po.getConditions().size(); i++) {
			con = po.getConditions().getJSONObject(i);
			value = con.getString("value");
			if (!StringUtils.isBlank(value)) {
				value = value.trim();
				field = con.getString("property");
				if (field.equals("ID")) {
					whereStr.append(" a.ID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				} else if (field.equals("CTMID")) {
					whereStr.append(" a.CTID = ? and ");
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
		// 订单过期的状态更改
		String nDate = DateOpt.dateToStr(new Date());
		StringBuffer exsql = new StringBuffer();
		exsql.append(" update " + this.TABLE_NAME + " set ISVALID=0 where ENDDATE<'" + nDate + "'");
		DbOpt.getInstance().getJdbcTemplate().update(exsql.toString());
		// 更新订单已付款
		StringBuffer yfsql = new StringBuffer();
		yfsql.append("UPDATE CRM_ORDER a LEFT JOIN (SELECT sum(PAY) as PAY,ORDERID from CRM_PAY  GROUP BY ORDERID) c on a.ID=c.ORDERID set a.YF = c.PAY  ");
		DbOpt.getInstance().getJdbcTemplate().update(yfsql.toString());
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
