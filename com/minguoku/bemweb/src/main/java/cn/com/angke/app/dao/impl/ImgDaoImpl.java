package cn.com.angke.app.dao.impl;

import java.io.File;
import java.sql.Types;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.config.service.Config;
import com.somenew.db.PageSqlOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.db.SqlParas;
import com.somenew.qywx.MyDate;
import com.somenew.service.ServiceFactory;

import cn.com.angke.app.dao.ImgDao;

@Service
public class ImgDaoImpl extends PlatformBaseDaoImpl implements ImgDao {

	public String TABLE_NAME = "WXK_IMG";

	public String SQL_SELECT = "select a.* from WXK_IMG a";
	// tree
	public String SQL_TREE = "select a.ID from WXK_IMG a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = SQL_SELECT;

	public String SQL_COUNT = "select count(a.ID) from WXK_IMG a \n";

	public ImgDaoImpl() {
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
				}else if (field.equals("STATUS")) {
					whereStr.append("a.STATUS = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				} else if (field.equals("NAME")) {
					whereStr.append("a.NAME = ? and ");
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
	public JSONArray getPICINames() {
		String sql = "select NAME from WXK_IMG";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		JSONArray arr = new JSONArray();
		for(int i=0;i<list.size();i++){
			arr.add(list.get(i).getString("NAME"));
		}
		return arr;
	}

	@Override
	public String getIdByName(String name) {
		String sql = "select ID from WXK_IMG where NAME = '"+name+"'";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		return list.get(0).getString("ID");
	}

	@Override
	public JSONObject getDir(String dir) {
		System.out.println("dir"+dir);
		Config config = ServiceFactory.getInstance().getConfig();
		String url = config.getConfigValue(dir);
		System.out.println("url:"+url);
		File file = new File(url);
		File[] files = file.listFiles();
		JSONArray arr = new JSONArray();
		for(int i=0;i<files.length;i++){
			if(files[i].isDirectory()){
				arr.add(files[i].getName());
			}
		}
		JSONObject r = new JSONObject();
		r.put("items", arr);
		return r;
	}


}
