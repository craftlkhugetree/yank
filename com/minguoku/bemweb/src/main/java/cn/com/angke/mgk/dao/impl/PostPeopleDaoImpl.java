package cn.com.angke.mgk.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PageSqlOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.db.SqlParas;

import cn.com.angke.mgk.dao.PostPeopleDao;


@Service
public class PostPeopleDaoImpl extends PlatformBaseDaoImpl implements PostPeopleDao{
	
	public String TABLE_NAME = "WXK_POSTPEOPLE";
    
	public String SQL_SELECT = "select a.ID, a.POSTID,c.NAME as POSTNAME, a.PEOPLEID, SETORGID,b.NAME as ORGNAME,a.SETTYPE,a.ENDTYPE, a.SETDATE, e.NAME as SETTYPENAME,f.NAME as ENDTYPENAME, a.ENDDATE, concat(d.LASTNAME , IFNULL(d.FIRSTNAME,'')) as PEOPLENAME "
			+ "from WXK_POSTPEOPLE a left join WXK_ORG b on a.SETORGID=b.ID left join WXK_POST c on a.POSTID=c.ID left join WXK_PEOPLE d on a.PEOPLEID=d.ID left join WXK_OFFICETYPE e "
			+"on a.SETTYPE=e.ID left join WXK_OFFICETYPE f on a.ENDTYPE=f.ID";	
	//tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";
	
	public String SQL_VIEW = "";
	
	public String SQL_COUNT = "select count(a.ID) from WXK_POSTPEOPLE a \n";
	
	public PostPeopleDaoImpl() {
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
				if (field.equals("ID")) {
					whereStr.append(" a.ID = ? and ");
					sqlParas.addPara(value, 12);
				}else if (field.equals("POSTID")) {
					whereStr.append(" a.POSTID = ? and ");
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
	 * 根据POSTID查询职员信息
	 * @param po 分页参数
	 * @param name 机构名称
	 * @return
	 */
	public JSONObject getPeopleListByPostid(PageOpt po){
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
