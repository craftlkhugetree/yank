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
import com.somenew.db.RootDao;
import com.somenew.db.SqlParas;

import cn.com.angke.mgk.dao.FileDao;
@Service
public class FileDaoImpl extends RootDao implements FileDao {

	private void calGetsSql(PageOpt po, StringBuffer sql, SqlParas sqlParas) {
		if (po.getConditions()==null){
			return;
		}
		JSONObject con;
		String field,value;
		StringBuffer whereStr=new StringBuffer();
		whereStr.append(" where ");
		for (int i=0;i<po.getConditions().size();i++){
			con=po.getConditions().getJSONObject(i);
			value=con.getString("value");
			if (!StringUtils.isBlank(value)){
				value = value.trim();
				field=con.getString("property");
				if (field.equals("TITILE")){
					whereStr.append(" TITILE like ? and ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
				}else if (field.equals("ID")){
					whereStr.append(" ID = ? and ");
					sqlParas.addPara( value , Types.VARCHAR);
				}
			}
		}
		if (whereStr.length()>7){
			whereStr.delete(whereStr.length()-4, whereStr.length());
			sql.append(whereStr);
		}
	}
	
	@Override
	public JSONObject getFile(PageOpt po) {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		sql.append("select a.* ").append("from CM_FILE a ");
		SqlParas sqlParas = new SqlParas();
		calGetsSql(po, sql, sqlParas);
		if (po.getIsOrderby()) {
			sql.append(" order by ").append(po.getOrderby());
		}
		String dosql = sql.toString();
		if (po.getIsPage()) {
			dosql = PageSqlOpt.getPaginationString(dosql, po.getStart(), po.getPageSize());
		}
		data = this.getJdbcTemplate().query(dosql,sqlParas.getVs(), sqlParas.getTypes(), readRows);
		
		
		
		sql = new StringBuffer();
		sql.append("select count(a.ID) ").append("from CM_FILE a ");
		sqlParas = new SqlParas();
		calGetsSql(po, sql, sqlParas);
		int cnt= this.getJdbcTemplate().queryForObject(sql.toString(),sqlParas.getVs(), sqlParas.getTypes(), Integer.class);

		JSONObject r=new JSONObject();
		r.put("total",cnt);
		JSONArray res=new JSONArray();
		res.addAll(data);
		r.put("data",res);
		return r;
	}

	@Override
	public void delFile(JSONArray ID) {
		DbOpt.getInstance().delByFieldValues(null, "CM_FILE", "ID", (String[])ID.toArray(new String[0]));
	}

	@Override
	public JSONObject saveFile(JSONObject file) {
		//file.put("CREATETIME", new Date());
		DbOpt.getInstance().insert(null, "WXK_PEOPLE", file);
		return file;
	}

	@Override
	public JSONObject updateFile(JSONObject file) {
		DbOpt.getInstance().updateByKey(null, "CM_FILE", file,null);
		return null;
	}

}
