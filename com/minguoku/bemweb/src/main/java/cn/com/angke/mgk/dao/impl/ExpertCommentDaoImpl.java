package cn.com.angke.mgk.dao.impl;

import java.sql.Types;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.db.SqlParas;
import com.somenew.ids.client.LoginUser;
import com.somenew.utils.DateOpt;
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.dao.ExpertCommentDao;

@Service
public class ExpertCommentDaoImpl extends PlatformBaseDaoImpl implements ExpertCommentDao {

	public String TABLE_NAME = "WXK_EXPERTCOMMENT";

	public String SQL_SELECT = "select a.ID, a.AUTHOR,a.TITLE,a.CONTENT,a.COMMENTTIME,u.NAME as 'CREATORNAME',a.CREATOR,a.CREATETIME,a.ISSHOW from WXK_EXPERTCOMMENT a left join AU_USER u on(a.CREATOR=u.ID) ";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_EXPERTCOMMENT a \n";

	public ExpertCommentDaoImpl() {
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
				}else if (field.equals("KEYWORD")) {
					whereStr.append(" a.AUTHOR like ? or ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
					whereStr.append(" a.TITLE like ? and ");
					sqlParas.addPara("%"+value+"%", Types.VARCHAR);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}
	
	public JSONObject save(JSONObject obj) {
		if (StringUtils.isBlank(obj.getString("ID"))) {
			obj.put("ID", StringOpt.produceUUID());
//			obj.put("COMMENTTIME", DateOpt.datetimeToStr(new Date()));
			obj.put("CREATOR", LoginUser.getUserID());
			obj.put("CREATETIME", DateOpt.datetimeToStr(new Date()));
			DbOpt.getInstance().insert(null, this.TABLE_NAME, obj);
		} else {
			DbOpt.getInstance().updateByKey(null, this.TABLE_NAME, obj, null);
		}
		return obj;
	}

}
