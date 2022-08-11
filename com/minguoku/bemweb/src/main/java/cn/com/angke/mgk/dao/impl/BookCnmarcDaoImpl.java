package cn.com.angke.mgk.dao.impl;

import java.sql.Types;
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

import cn.com.angke.mgk.dao.BookCnmarcDao;


@Service
public class BookCnmarcDaoImpl extends PlatformBaseDaoImpl implements BookCnmarcDao {

	public String TABLE_NAME = "WXK_BOOK_CNMARC";

	public String SQL_SELECT = "select a.*,b.ZTNAME from WXK_BOOK_CNMARC a left join WXK_ZTTYPE b on a.ZTTYPEID = b.ZTSYMBOL \n";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.BOOKID) from WXK_BOOK_CNMARC a \n";

	public BookCnmarcDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
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
				if (field.equals("BOOKID")) {
					whereStr.append(" a.BOOKID = ? and ");
					sqlParas.addPara(value, 12);
				}else if (field.equals("KEYWORD")) {
					whereStr.append(" a.TITLE LIKE ? and ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}

	
	public JSONObject getList(PageOpt po) {
		List<JSONObject> data = null;
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
	
	public JSONObject getBookByCode(String code) {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_SELECT+" a.CODE = '"+code+"'");
		String dosql = sql.toString();
		data = getJdbcTemplate().query(dosql, null, null, readRows);
		if (data.size()>0) return data.get(0);
		else return null;
	}
	
	public JSONObject save(JSONObject obj) {
		if (StringUtils.isBlank(obj.getString("BOOKID"))) {
			obj.put("BOOKID", StringOpt.produceUUID());
			System.out.println(obj.toJSONString());
			DbOpt.getInstance().insert(null, TABLE_NAME, obj);
		} else {
			System.out.println(obj.toJSONString());
			DbOpt.getInstance().updateByKey(null, TABLE_NAME, obj, null);
		}
		return obj;
	}
	
	
	/**
	 * 
	 * @Title: updateCnmarc  
	 * @Author:Liangjixiang
	 * @Description: 若图书未被加工，根据提交信息修改cnmarc表   
	 * @Time:2018年11月28日
	 * @param: @param book      
	 * @return: void      
	 * @throws
	 */
	public void updateCnmarc(JSONObject book) {
		JSONObject data = this.viewById(book.getString("BOOKID"));
		data.put("ZTTYPEID", book.getString("ZTTYPEID"));
		data.put("EDUTYPEID", book.getString("EDUTYPEID"));
		data.put("TEXTNOTE", book.getString("TEXTNOTE"));
		data.put("PAID", book.getString("PAID"));
		data.put("PUBLISHINGID", book.getString("PUBLISHINGID"));
		data.put("DATE", book.getString("DATE"));
		data.put("SERIES", book.getString("SERIES"));
		data.put("CONTENTNOTE", book.getString("CONTENTNOTE"));
		this.save(data);
	}

	@Override
	public JSONArray getBookIdArr() {
		String sql = "select BOOKID from WXK_BOOK_CNMARC";
		List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
		JSONArray arr = new JSONArray();
		for(int i=0;i<list.size();i++){
			arr.add(list.get(i).getString("BOOKID"));
		}
		return arr;
	}

}
