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

import cn.com.angke.mgk.dao.BookDao2;


@Service
public class BookDaoImpl2 extends PlatformBaseDaoImpl implements BookDao2 {

	public String TABLE_NAME = "WXK_BOOK";

	public String SQL_SELECT = "select ID,TITLE,PAID,PUBLISHINGID,DATE,PAGECOUNT,HEIGHT,WIDTH,SERIES,TEXTNOTE,CONTENTNOTE,"
			+ "BOOKDIR,TAGS,BTYPE,BLANGUAGE,USERID,OPERATEDATE,BATID,BOOKID,CREATETIME,UPDATETIME from WXK_BOOK a";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "select a.ID,a.TITLE,wbc.`NAME` as AUTHOR,a.PAID,pa.ADDRESS,bz.ZTTYPEID,bz.ZTNAME,bz.ZTCODE,edu.EDUTYPEID,edu.EDUNAME,edu.EDUCODE,a.PUBLISHINGID,p.NAME as 'PUBLISHINGNAME',a.DATE,a.PAGECOUNT,a.HEIGHT,a.WIDTH,a.SERIES,a.TEXTNOTE,a.CONTENTNOTE,"
			+ "a.BOOKDIR,a.TAGS,a.BTYPE,a.BLANGUAGE,a.USERID,a.OPERATEDATE,a.BATID,a.BOOKID,a.CREATETIME,a.UPDATETIME from WXK_BOOK a"
			+ " left join WXK_PUBLISHING p on(p.id=a.PUBLISHINGID) "
			+ " left join WXK_PA pa on (pa.id=a.PAID) "
			+ " left join (select `b`.`ID` AS `ID`,`b`.`BOOKID` AS `BOOKID`,`b`.`ZTTYPEID` AS `ZTTYPEID`,`z`.`ZTNAME` AS `ZTNAME`,`z`.`ZTSYMBOL` AS `ZTCODE` from (`WXK_BOOKZTTYPE` `b` left join `WXK_ZTTYPE` `z` on((`b`.`ZTTYPEID` = `z`.`ID`)))) bz on (bz.BOOKID=a.ID)"
			+ " left join (select `be`.`ID` AS `ID`,`be`.`BOOKID` AS `BOOKID`,`be`.EDUTYPEID AS `EDUTYPEID`,`e`.EDUNAME AS `EDUNAME`,`e`.EDUCODE AS `EDUCODE` from (`WXK_BOOKEDUTYPE` `be` left join `WXK_EDUTYPE` `e` on((`be`.EDUTYPEID = `e`.`ID`)))) edu on(edu.BOOKID=a.ID) "
			+ " left join (select BOOKID,GROUP_CONCAT(`NAME`)as NAME,ROLETYPE from WXK_BOOKCRATEOR where ROLETYPE ='著' GROUP BY `BOOKID`) wbc ON (a.ID=wbc.BOOKID) ";

	public String SQL_VIEW2 = "select a.ID,a.TITLE,wbc.`NAME` as AUTHOR,a.PAID,pa.ADDRESS,bz.ZTTYPEID,bz.ZTNAME,bz.ZTCODE,edu.EDUTYPEID,edu.EDUNAME,edu.EDUCODE,a.PUBLISHINGID,p.NAME as 'PUBLISHINGNAME',a.DATE,a.PAGECOUNT,a.HEIGHT,a.WIDTH,a.SERIES,a.TEXTNOTE,a.CONTENTNOTE,"
			+ "a.BOOKDIR,a.TAGS,a.BTYPE,a.BLANGUAGE,a.USERID,a.OPERATEDATE,a.BATID,a.BOOKID,a.CREATETIME,a.UPDATETIME "
			+ ",cn.ZTCC,cn.BLTITLE,cn.JHX,cn.SUMMARY,cn.COVERTITLE "
			+ " from WXK_BOOK a "
			+ " left join WXK_PUBLISHING p on(p.id=a.PUBLISHINGID) "
			+ " left join WXK_PA pa on (pa.id=a.PAID) "
			+ " left join WXK_BOOK_CNMARC cn on(a.BOOKID = cn.BOOKID) "
			+ " left join (select `b`.`ID` AS `ID`,`b`.`BOOKID` AS `BOOKID`,`b`.`ZTTYPEID` AS `ZTTYPEID`,`z`.`ZTNAME` AS `ZTNAME`,`z`.`ZTSYMBOL` AS `ZTCODE` from (`WXK_BOOKZTTYPE` `b` left join `WXK_ZTTYPE` `z` on((`b`.`ZTTYPEID` = `z`.`ID`)))) bz on (bz.BOOKID=a.ID)"
			+ " left join (select `be`.`ID` AS `ID`,`be`.`BOOKID` AS `BOOKID`,`be`.EDUTYPEID AS `EDUTYPEID`,`e`.EDUNAME AS `EDUNAME`,`e`.EDUCODE AS `EDUCODE` from (`WXK_BOOKEDUTYPE` `be` left join `WXK_EDUTYPE` `e` on((`be`.EDUTYPEID = `e`.`ID`)))) edu on(edu.BOOKID=a.ID) "
			+ " left join (select BOOKID,GROUP_CONCAT(`NAME`)as NAME,ROLETYPE from WXK_BOOKCRATEOR where ROLETYPE ='著' GROUP BY `BOOKID`) wbc ON (a.ID=wbc.BOOKID) ";	
	
	public String SQL_COUNT = "select count(a.ID) from WXK_BOOK a \n";

	public BookDaoImpl2() {
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
				} else if (field.equals("BATID")) {
					whereStr.append(" a.BATID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				}else if (field.equals("BOOKID")) {
					whereStr.append(" a.BOOKID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				}else if (field.equals("KEYWORD")) {
					whereStr.append(" a.TITLE like ? and ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
				}else if (field.equals("PUBLISHINGID")) {
					whereStr.append(" a.PUBLISHINGID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				}else if (field.equals("ZTNAME")) {
					whereStr.append(" bz.ZTNAME = ? and ");
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
		sql.append(SQL_VIEW2);
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
