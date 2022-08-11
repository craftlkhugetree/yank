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
import com.somenew.ids.client.LoginUser;
import com.somenew.utils.DateOpt;
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.dao.GeographyDao;

@Service
public class GeographyDaoImpl extends PlatformBaseDaoImpl implements GeographyDao {

	public String TABLE_NAME = "WXK_GEOGRAPHY";

	public String SQL_SELECT = "select ID, SOURCENAME, OTHERNAME, NAME, FWLJ, SETYEAR, SETDYNASTY, NEWGOVLOCAL,OLDGOVLOCAL, MAREA, BACKNAME, ENDYEAR, ENDDYNASTY,SETREIGNTITLE,ENDREIGNTITLE,BELONG,TYPE "
			+ "from WXK_GEOGRAPHY a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "select a.ID, a.SOURCENAME, a.OTHERNAME, a.NAME, a.FWLJ, CONCAT(y.REIGNNAME,CONCAT('(',y.YEAR,')')) as SETYEARNAME,a.SETYEAR, d.NAME as SETDYNASTYNAME,a.SETDYNASTY, a.NEWGOVLOCAL,a.OLDGOVLOCAL,a.SETREIGNTITLE,a.ENDREIGNTITLE, a.BELONG,a.TYPE,a.MAREA, a.BACKNAME, a.ENDYEAR,CONCAT(ey.REIGNNAME,CONCAT('(',ey.YEAR,')')) as ENDYEARNAME, dy.NAME as ENDDYNASTYNAME,a.ENDDYNASTY,sr.NAME as SETREIGNNAME,er.NAME as ENDREIGNNAME "
			+",a.COURRENTNAME,au.NAME as CREATER,a.CREATEDATE,aub.NAME as MODIFIER,a.MODIFYDATE from WXK_GEOGRAPHY a left join WXK_CALENDAR y on(a.SETYEAR=y.ID) "
			+" left join WXK_CALENDAR d on(a.SETDYNASTY=d.ID) "
			+" left join WXK_CALENDAR dy on(a.ENDDYNASTY=dy.ID)"
			+" left join WXK_CALENDAR ey on(a.ENDYEAR=ey.ID)"
			+" left join WXK_CALENDAR sr on(a.SETREIGNTITLE=sr.ID)"
			+" left join WXK_CALENDAR er on(a.ENDREIGNTITLE=er.ID)"
			+" left join AU_USER au on a.CREATER=au.ID "
			+" left join AU_USER aub on a.MODIFIER=aub.ID ";

	public String SQL_COUNT = "select count(a.ID) from WXK_GEOGRAPHY a \n";

	public GeographyDaoImpl() {
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
				} else if (field.equals("KEYWORD")) {
					whereStr.append(" a.SOURCENAME like ? or ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
					whereStr.append(" a.OTHERNAME like ? or ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
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
		sql.append(SQL_VIEW);
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
			obj.put("CREATER",LoginUser.getUserID());
			obj.put("CREATEDATE", DateOpt.datetimeToStr(new Date()));
			DbOpt.getInstance().insert(null, this.TABLE_NAME, obj);
		} else {
			obj.put("MODIFIER",LoginUser.getUserID());
			obj.put("MODIFYDATE", DateOpt.datetimeToStr(new Date()));
			DbOpt.getInstance().updateByKey(null, this.TABLE_NAME, obj, null);
		}
		return obj;
	}

}
