package cn.com.angke.mgk.service.impl;

import java.sql.Types;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.SqlParas;
import com.somenew.ids.client.LoginUser;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.utils.DateOpt;

import cn.com.angke.mgk.dao.ResourcePackageDao;
import cn.com.angke.mgk.dao.ZrRelDao;
import cn.com.angke.mgk.service.ResourcePackageService;
import cn.com.angke.utils.ZListToTree;
import cn.com.angke.utils.cache.ConsumerBooksCache;

@Service
public class ResourcePackageServiceImpl extends PlatformBaseServiceImpl implements ResourcePackageService {

	@Resource(name = "resourcePackageDaoImpl")
	protected ResourcePackageDao resourcePackageDao;

	@Resource(name = "zrRelDaoImpl")
	protected ZrRelDao zrRelDao;

	@Override
	public JSONArray ZTtree(String RESOURCEPACKAGEID) {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		sql.append("select a.ID,a.PID,a.ZTNAME as NAME,a.ZTSYMBOL as CODE");
		if (StringUtils.isNotBlank(RESOURCEPACKAGEID)) {
			sql.append(",d.ZTTYPEID as checked ");
		}
		sql.append(" from WXK_ZTTYPE a ");
		if (StringUtils.isNotBlank(RESOURCEPACKAGEID)) {
			sql.append(" left join (SELECT b.ZTTYPEID FROM WXK_ZRREL b where ");
			sql.append(" b.RESOURCEPACKAGEID=? )d on a.ID = d.ZTTYPEID ");
			sqlParas.addPara(RESOURCEPACKAGEID, Types.VARCHAR);
		}
		sql.append(" where length(a.ID)=3 order by convert(ID using gbk) ");
		String dosql = sql.toString();
		data = this.getJdbcTemplate().query(dosql, sqlParas.getVs(), sqlParas.getTypes(), readRows);

		JSONArray r = ZListToTree.parseArrayZt(data, "WXK_ZTTYPE");
		return r;

	}

	/**
	 * 保存资源库
	 */
	@Override
	public void saveResource(JSONObject obj) {
		if (StringUtils.isBlank(obj.getString("ID"))) {
			obj.put("CREATER", LoginUser.getUserID());
			obj.put("CREATEDATE", DateOpt.datetimeToStr(new Date()));
		} else {
			obj.put("MODIFIER", LoginUser.getUserID());
			obj.put("MODIFYDATE", DateOpt.datetimeToStr(new Date()));
		}
		resourcePackageDao.save(obj);
		if (StringUtils.isNotBlank(obj.getString("ID"))) {
			String ID = obj.getString("ID");
			// 删除资源库和中图分类的关联数据
			PageOpt po = new PageOpt();
			po.setCondition("RESOURCEPACKAGEID", ID);
			JSONArray arr = zrRelDao.list(po).getJSONArray("items");
			JSONArray OLDID = new JSONArray();
			if (arr != null && arr.size() > 0) {
				for (int i = 0; i < arr.size(); i++) {
					JSONObject old = arr.getJSONObject(i);
					OLDID.add(old.getString("ID"));
				}
				zrRelDao.delete(OLDID);
			}
			// 添加新的资源库和中图分类关联
			JSONArray ZTTYPEIDS = obj.getJSONArray("ZTTYPEID");
			if (ZTTYPEIDS != null && ZTTYPEIDS.size() > 0) {
				for (int i = 0; i < ZTTYPEIDS.size(); i++) {
					String zttypeID = ZTTYPEIDS.getString(i);
					SqlParas sqlParas = new SqlParas();
					String sql = "select ID, PID, ZTNAME, ZTSYMBOL from WXK_ZTTYPE where ID LiKE ?";
					sqlParas.addPara(zttypeID + "%", Types.VARCHAR);
					List<JSONObject> zttype = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(),
							sqlParas.getTypes(), readRows);
					if (zttype.size() > 0) {
						JSONObject ztRel = null;
						for (int j = 0; j < zttype.size(); j++) {
							ztRel = new JSONObject();
							ztRel.put("ZTTYPEID", zttype.get(j).getString("ID"));
							ztRel.put("RESOURCEPACKAGEID", ID);
							zrRelDao.save(ztRel);
						}
					}
				}
			}
			// 删除相关客户的缓存
			String sql = "select distinct CTID from CRM_ORDER WHERE ISVALID = '1' and RESOURCEID = '" + ID +"'";
			List<JSONObject> list = this.getJdbcTemplate().query(sql, readRows);
			for (JSONObject one : list) {
				ConsumerBooksCache.clearCustomerCache(one.getString("CTID"));
			}
		}
	}

	@Override
	public void delResource(JSONArray IDs) {
		for (int i = 0; i < IDs.size(); i++) {
			// 删除资源库和中图分类的关联数据
			PageOpt po = new PageOpt();
			po.setCondition("RESOURCEPACKAGEID", IDs.getString(i));
			JSONArray arr = zrRelDao.list(po).getJSONArray("items");
			JSONArray OLDID = new JSONArray();
			if (arr != null && arr.size() > 0) {
				for (int j = 0; j < arr.size(); j++) {
					JSONObject old = arr.getJSONObject(j);
					OLDID.add(old.getString("ID"));
				}
				zrRelDao.delete(OLDID);
			}
		}
		resourcePackageDao.delete(IDs);
		// 删除相关的客户缓存
		String date = DateOpt.getCurrentDateStr();
		for (int i = 0; i < IDs.size(); i++) {
			String rid = IDs.getString(i);
			String sql = "select distinct CTID from CRM_ORDER where RESOURCEID = '"+rid+"' and ISVALID = '1' and BEGINDATE <= '" + date + "' and ENDDATE >= '"+ date +"' and CTID is not null  ";
			List<JSONObject> query = this.getJdbcTemplate().query(sql, readRows);
			for (JSONObject obj : query) {
				String ctid = obj.getString("CTID");
				ConsumerBooksCache.clearCustomerCache(ctid);
			}
		}
	}

}
