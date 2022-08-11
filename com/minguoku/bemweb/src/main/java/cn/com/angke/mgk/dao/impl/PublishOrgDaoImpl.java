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
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.dao.PublishOrgDao;

@Service
public class PublishOrgDaoImpl extends PlatformBaseDaoImpl implements PublishOrgDao {
	
	
	public String TABLE_NAME = "WXK_PA";

	public String SQL_SELECT = "select a.ID, a.PUBLISHINGID,b.NAME as NAME, SETDATE, ENDDATE, ADDRESS from WXK_PA a left join WXK_PUBLISHING b on a.PUBLISHINGID=b.ID";
	// tree
	public String SQL_TREE = "select a.ID from WXK_PA a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_PA a \n";

	public PublishOrgDaoImpl() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;

	}
	

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
				}else if (field.equals("PUBLISHINGID")) {
					whereStr.append(" a.PUBLISHINGID = ? and ");
					sqlParas.addPara(value, 12);	
				}else if (field.equals("KEYWORD")) {
					whereStr.append(" a.ADDRESS like ? or ");
					sqlParas.addPara("%" +value+ "%" , Types.VARCHAR);
					whereStr.append(" a.ENDDATE like ? or ");
					sqlParas.addPara("%" +value+ "%", Types.VARCHAR);
					whereStr.append(" a.SETDATE like ? and ");
					sqlParas.addPara("%" +value+ "%", Types.VARCHAR);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}
	
	public void saveRes(JSONObject obj){
		if(StringUtils.isBlank(obj.getString("ID"))){
			obj.put("ID", StringOpt.produceUUID());
		}
	}

	/**
	 * 查询出版社地址列表
	 */
	public JSONObject getList(PageOpt po) {
		List data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_SELECT);
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
	public JSONObject save(JSONObject obj, String NAME) {
		// TODO Auto-generated method stub
		return null;
	}

}
