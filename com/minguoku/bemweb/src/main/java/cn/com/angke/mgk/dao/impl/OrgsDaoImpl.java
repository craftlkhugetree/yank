package cn.com.angke.mgk.dao.impl;

import java.sql.Types;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import com.somenew.utils.Node;
import com.somenew.utils.StringOpt;

import cn.com.angke.mgk.dao.OrgsDao;

@Service
public class OrgsDaoImpl extends PlatformBaseDaoImpl implements OrgsDao {

	public String TABLE_NAME = "WXK_ORG";

	public String SQL_SELECT = "select a.ID, a.NAME, a.PARENTID,d.NAME as PARENTNAME, a.TYPE, a.SETACCORDING,a.ENDACCORDING,"+ 
		"b.NAME as ACCORDINGNAME, a.SETDATE, c.NAME as ENDACCORDINGNAME, a.ENDDATE,"+
		"a.SOURCEORGID,e.NAME as ORGSOURCENAME, a.DORDER, "
		+ "au.NAME as CREATER,a.CREATEDATE,aub.NAME as MODIFIER,a.MODIFYDATE "+
		"from WXK_ORG a "+
		"left join WXK_SETENDACCORDING b on a.SETACCORDING=b.ID "+
		"LEFT JOIN WXK_SETENDACCORDING c on a.ENDACCORDING=c.ID "+
		"left join WXK_ORG d on a.PARENTID=d.ID "+ 
		"left join WXK_ORG e on e.ID = a.SOURCEORGID "
		+ "LEFT JOIN AU_USER au on a.CREATER=au.ID "
		+ "LEFT JOIN AU_USER aub on a.MODIFIER=aub.ID";

	// tree
	public String SQL_TREE = "select a.ID,a.PARENTID,NAME from WXK_ORG a";
	public String COLUNM_NAME = "ID";

	public String SQL_VIEW = "";

	public String SQL_COUNT = "select count(a.ID) from WXK_ORG a \n";

	public OrgsDaoImpl() {
		super();
		super.TABLE_NAME = TABLE_NAME;
		super.SQL_SELECT = SQL_SELECT;
		super.SQL_TREE = SQL_TREE;
		super.COLUNM_NAME = COLUNM_NAME;
		super.SQL_VIEW = SQL_VIEW;
		super.SQL_COUNT = SQL_COUNT;

	}
	
	/**
	 * 保存创建人信息等
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
				}else if (field.equals("PARENTID")) {
					whereStr.append(" a.PARENTID = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				}else if (field.equals("NAME")) {
					whereStr.append(" a.NAME = ? and ");
					sqlParas.addPara(value, Types.VARCHAR);
				}else if (field.equals("KEYWORD")) {
					whereStr.append(" a.NAME like ? or ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
					whereStr.append(" a.TYPE like ? or ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
					whereStr.append(" a.SETACCORDING like ? or ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
					whereStr.append(" a.SETDATE like ? or ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
					whereStr.append(" a.ENDACCORDING like ? or ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
					whereStr.append(" a.ENDDATE like ? or ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
					whereStr.append(" a.SOURCEORGID like ? and ");
					sqlParas.addPara("%" + value + "%", Types.VARCHAR);
				}
			}
		}
		if (whereStr.length() > 7) {
			whereStr.delete(whereStr.length() - 4, whereStr.length());
			sql.append(whereStr);
		}
	}

	

	/**
	 * 根据父ID：parentID查询
	 * 
	 * @param po
	 * @return
	 */
	public JSONObject getListByParentId(PageOpt po) {

		List data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_SELECT);
		// sql.append(" where name ="+name);
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
	
	public static JSONArray convertSubItemsToChildren(JSONArray items, boolean haveChecked) {
		for (int i = 0; i < items.size(); ++i) {
			JSONObject item = items.getJSONObject(i);
			item.put("text", item.getString("NAME"));
			/*if (haveChecked) {
				if (StringUtils.isNotBlank(item.getString("checked")))
					item.put("checked", Boolean.valueOf(item.getBooleanValue("checked")));
				else
					item.put("checked", Boolean.valueOf(false));
			} else {
				item.remove("checked");
			}*/
			if (item.containsKey("subItems")) {
				JSONArray subItems = item.getJSONArray("subItems");
				subItems = convertSubItemsToChildren(subItems, haveChecked);
				item.remove("subItems");
				item.put("children", subItems);
				item.put("expanded", Boolean.valueOf(true));
			} else {
				item.put("leaf", Boolean.valueOf(true));
			}
		}
		return items;
	}

	/**
	 * 
	 */
	@Override
	public JSONArray getList(PageOpt po) {
		List data = null;
		StringBuffer sql = new StringBuffer();
		sql.append(this.SQL_TREE);
		SqlParas sqlParas = new SqlParas();
		calGetsSql(po, sql, sqlParas);
		if (po.getIsOrderby())
			sql.append(" order by ").append(po.getOrderby());
		else {
			sql.append(" order by convert(" + this.COLUNM_NAME + " using gbk) ");
		}
		String dosql = sql.toString();
		data = getJdbcTemplate().query(dosql, sqlParas.getVs(), sqlParas.getTypes(), readRows);

		JSONObject r = new JSONObject();
		JSONArray res = new JSONArray();
//		res.addAll(data);
		return convertSubItemsToChildren(parseArray(data, TABLE_NAME),true);
	}

	public static JSONArray parseArray(List<JSONObject> dataList, String tableName) {
		HashMap nodeList = new HashMap();

		Node root = new Node();
		for (Iterator it = dataList.iterator(); it.hasNext();) {
			JSONObject dataRecord = (JSONObject) it.next();
			Node node = new Node();

			node.OBJ_CODE = tableName;
			node.ID = ((dataRecord.getString("ID") == null) ? "" : dataRecord.getString("ID"));
			node.OBJ_ID = ((tableName + "_" + dataRecord.getString("ID") == null) ? "" : dataRecord.getString("ID"));
			node.NAME = ((dataRecord.getString("NAME") == null) ? "" : dataRecord.getString("NAME"));
			node.PID = ((dataRecord.getString("PARENTID") == null) ? "" : dataRecord.getString("PARENTID"));

			if (StringUtils.isNotBlank((String) dataRecord.get("checked"))) {
				node.checked = Boolean.valueOf(true);
			}
			if (StringUtils.isNotBlank((String) dataRecord.get("LEVELCODE")))
				node.LEVEL_CODE = ((String) dataRecord.get("LEVELCODE"));
			else if (StringUtils.isNotBlank((String) dataRecord.get("ORDERNUM")))
				node.LEVEL_CODE = ((String) dataRecord.get("ORDERNUM"));
			else {
				node.LEVEL_CODE = "1";
			}
			nodeList.put(node.ID, node);
		}

		Set entrySet = nodeList.entrySet();
		for (Iterator it = entrySet.iterator(); it.hasNext();) {
			Node node = (Node) ((Map.Entry) it.next()).getValue();
			if ((node.PID == null) || (node.PID.equals(""))) {
				root.addChild(node);
			} else if (nodeList.get(node.PID) != null) {
				((Node) nodeList.get(node.PID)).addChild(node);
			}
		}
		System.out.println(root.toString());
		return root.toJSONArray();
	}

	@Override
	public JSONObject getOrgListByFiled(PageOpt po) {
		// TODO Auto-generated method stub
		return null;
	}
}
