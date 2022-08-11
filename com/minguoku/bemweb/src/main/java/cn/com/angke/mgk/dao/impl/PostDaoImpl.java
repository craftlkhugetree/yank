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

import cn.com.angke.mgk.dao.PostDao;

@Service
public class PostDaoImpl extends PlatformBaseDaoImpl implements PostDao{
	
public String TABLE_NAME = "WXK_POST";
    
	public String SQL_SELECT = "select a.ID, a.NAME, a.ORGID,b.NAME as ORGNAME,concat(b.NAME,a.NAME) as TONAME, a.SETDATE, a.ENDDATE, a.SOURCEPOSTID,c.NAME as SOURCENAME, a.DORDER "
			+ ",au.NAME as CREATER,a.CREATEDATE,aub.NAME as MODIFIER,a.MODIFYDATE "
			+ "from WXK_POST a "
			+ "left join WXK_ORG b on a.ORGID = b.ID "
			+ "left join WXK_POST c on a.SOURCEPOSTID=c.ID "
			+ "LEFT JOIN AU_USER au on a.CREATER=au.ID "
			+ "LEFT JOIN AU_USER aub on a.MODIFIER=aub.ID ";	
	//tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";
	
	public String SQL_VIEW = "";
	
	public String SQL_COUNT = "select count(a.ID) from WXK_POST a \n";
	
	public PostDaoImpl() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;
		
	}
	
	/**
	 * 保存创建人等信息
	 */
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
				}else if(field.equals("ORGID")){
					whereStr.append(" a.ORGID like ? and ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
				}else if(field.equals("SOURCEPOSTID")){
					whereStr.append(" a.SOURCEPOSTID like ? and ");
					sqlParas.addPara("%"+value+"%",Types.VARCHAR );
				}else if(field.equals("NAME")){
					whereStr.append(" a.NAME = ? and ");
					sqlParas.addPara(value,Types.VARCHAR );
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}

	
	/**
	 * 根据机构ID查询
	 * @param po 分页参数
	 * @param name 机构名称
	 * @return
	 */
	public JSONObject getPostListByOrgId(PageOpt po){
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
	
	
	/**
	 * 查找所有原职位
	 * @param po
	 * @return
	 */
	public JSONObject getListBySourcepostId(PageOpt po){
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
