package cn.com.angke.mgk.dao.impl;

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
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.dao.OtherNameDao;

@Service
public class OtherNameDaoImpl extends PlatformBaseDaoImpl implements OtherNameDao {
	
	public String TABLE_NAME = "WXK_OTHERNAME";

	public String SQL_SELECT = "select a.ID, PEOPLEID, NTYPE,NAME from WXK_OTHERNAME a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "select a.ID,  from WXK_OTHERNAME a ";
			
	public String SQL_COUNT = "select count(a.ID) from WXK_OTHERNAME a \n";

	public OtherNameDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}
	
	
	public JSONObject saveRes(JSONArray arr) {
		JSONObject obj = null;
		for (Object object : arr) {
			obj= JSONObject.parseObject(object.toString());
			if (StringUtils.isBlank(obj.getString("ID"))) {
				obj.put("ID", StringOpt.produceUUID());
				System.out.println(obj.toJSONString());
				DbOpt.getInstance().insert(null, TABLE_NAME, obj);
			} else {
				System.out.println(obj.toJSONString());
				DbOpt.getInstance().updateByKey(null, TABLE_NAME, obj, null);
			}
		}
		return obj;
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
				if (field.equals("ID")) {
					whereStr.append(" a.ID = ? and ");
					sqlParas.addPara(value, 12);
				}else if (field.equals("NTYPE")) {
					whereStr.append(" a.NTYPE = ? and ");
					sqlParas.addPara(value, 12);
				}else if (field.equals("PEOPLEID")) {
					whereStr.append(" a.PEOPLEID = ? and ");
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
	 * 查询笔名别名字号下拉列表
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

	
	
}
