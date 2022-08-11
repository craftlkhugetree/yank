package cn.com.angke.mgk.dao.impl;

import java.sql.Types;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PageSqlOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.db.SqlParas;

import cn.com.angke.mgk.dao.PeopleDaos;

@Service
public class PeopleDaosImpl extends PlatformBaseDaoImpl implements PeopleDaos {
	
	public String TABLE_NAME = "WXK_PEOPLE";
	public String SQL_SELECT = "select a.ID, FIRSTNAME, LASTNAME,concat(IFNULL(LASTNAME,''),IFNULL(FIRSTNAME,'')) as PEOPLENAME, YH, FH, DH, FORIGNNAME, a.SEX, a.JG, MZ, GJ, BIRTHDAY, BIRTHDAY2, DEADDAY, DEADDAY2, EDU, MAINBOOK, PHOTOID,au.NAME as CREATER,a.CREATEDATE,aub.NAME as MODIFIER,a.MODIFYDATE"+
	", a.STATUS from WXK_PEOPLE a "
	+" left join AU_USER au on a.CREATER=au.ID "
	+" left join AU_USER aub on a.MODIFIER=aub.ID "
	+" where a.STATUS=1";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_PEOPLE a where a.STATUS=1 \n";

	public PeopleDaosImpl() {
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
		whereStr.append(" and ");
		for (int i = 0; i < po.getConditions().size(); ++i) {
			JSONObject con = po.getConditions().getJSONObject(i);
			String value = con.getString("value");
			if (!(StringUtils.isBlank(value))) {
				value = value.trim();
				String field = con.getString("property");
				if (field.equals("ID")) {
					whereStr.append(" a.ID = ? and ");
					sqlParas.addPara(value, 12);
				}else if (field.equals("JG")) {
					whereStr.append(" a.JG = ? and ");
					sqlParas.addPara(value, 12);
				}else if(field.equals("KEYWORD")){
					whereStr.append(" a.FIRSTNAME like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.LASTNAME like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.YH like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.FH like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.DH like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.JG like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.GJ like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.SEX like ? or ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
					whereStr.append(" a.MZ like ? and ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
				}else if (field.equals("NAME")) {
					whereStr.append(" concat(IFNULL(a.LASTNAME,''),IFNULL(a.FIRSTNAME,'')) = ? and ");
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
	 * 查询人物列表
	 * @param po 分页参数
	 * @param name 机构名称
	 * @return
	 */
	public JSONObject getPeopleList(PageOpt po){
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_SELECT);
		//sql.append(" where name ="+name);
		SqlParas sqlParas = new SqlParas();
		calGetsSql(po, sql, sqlParas);
		if (po.getIsOrderby()) {
			sql.append(" order by ").append(new Date());
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
