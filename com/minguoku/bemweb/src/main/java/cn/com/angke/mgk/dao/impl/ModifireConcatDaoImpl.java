package cn.com.angke.mgk.dao.impl;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.db.DbOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.ids.client.LoginUser;
import com.somenew.utils.DateOpt;
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.dao.ModifireConcatDao;

@Service
public class ModifireConcatDaoImpl extends PlatformBaseDaoImpl implements ModifireConcatDao {

	public String TABLE_NAME = "CRM_MODIFIRECONTACT";

	public String SQL_SELECT = "select ID, CONTACT,CONTACTMOBILE, CONTACTEMAIL,CONTACTQQ,CTMID,DATETIME,USERID,REMARKfrom CRM_MODIFIRECONTACT a  ";
	// tree
	public String SQL_TREE = "";
	public String COLUNM_NAME = "";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from CRM_MODIFIRECONTACT a  \n";

	public ModifireConcatDaoImpl() {
		super();
		super.SQL_VIEW = SQL_VIEW;
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_COUNT = SQL_COUNT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
	}

	public JSONObject save(JSONObject obj) {
		if (StringUtils.isBlank(obj.getString("ID"))) {
			obj.put("ID", StringOpt.produceUUID());
			obj.put("DATETIME", DateOpt.datetimeToStr(new Date()));
			obj.put("USERID", LoginUser.getUserID());
			System.out.println(obj.toJSONString());
			DbOpt.getInstance().insert(null, this.TABLE_NAME, obj);
		} else {
			System.out.println(obj.toJSONString());
			DbOpt.getInstance().updateByKey(null, this.TABLE_NAME, obj, null);
		}
		return obj;
	}
}
