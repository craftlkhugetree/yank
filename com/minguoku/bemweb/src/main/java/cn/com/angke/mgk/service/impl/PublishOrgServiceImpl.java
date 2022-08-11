package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.PublicDao;
import cn.com.angke.mgk.dao.PublishOrgDao;
import cn.com.angke.mgk.service.PublishOrgService;

@Service
public class PublishOrgServiceImpl extends PlatformBaseServiceImpl implements PublishOrgService {

	@Resource(name = "publishOrgDaoImpl")
	protected PublishOrgDao publishOrgDao;
	
	@Resource(name = "publicDaoImpl")
	protected PublicDao publicDao;
	
	public PlatformBaseDao getBaseDao() {
		return publishOrgDao;
	}

	@Override
	public JSONObject getList(PageOpt po) {
		return publishOrgDao.getList(po);
	}

	/**
	 * 新增或修改出版社地址及出版社信息
	 */
	public void saveRes(JSONObject obj) {
		if(StringUtils.isBlank(obj.getString("ID"))){
			JSONObject obs=new JSONObject();
			obs.put("PUBLISHINGID", obj.get("PUBLISHINGID"));
			obs.put("ADDRESS",obj.get("ADDRESS"));
			obs.put("SETDATE",obj.get("SETDATE"));
			obs.put("ENDDATE",obj.get("ENDDATE"));
			publishOrgDao.save(obs);
		}
		if(StringUtils.isNotBlank(obj.getString("ID"))){
			DbOpt.getInstance().updateByKey(null, "WXK_PA", obj, null);
		}
	}
	
	
	/**
	 * 级联删除
	 */
	public void deleteOrg(JSONArray ID){
			JSONObject obj = new JSONObject();
			obj.put("PUBLISHINGID", ID);
			//先删除出版社地址表
			DbOpt.getInstance().delByFieldValues(null, "WXK_PA", "PUBLISHINGID",(String[]) (String[]) ID.toArray(new String[0]));
			//删除出版社表
			publicDao.delete(ID);
	}
	
	
}
