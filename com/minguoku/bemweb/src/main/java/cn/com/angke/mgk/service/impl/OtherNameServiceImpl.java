package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.OtherNameDao;
import cn.com.angke.mgk.service.OtherNameService;

@Service
public class OtherNameServiceImpl extends PlatformBaseServiceImpl implements OtherNameService {
	
	@Resource(name = "otherNameDaoImpl")
	public OtherNameDao otherNameDao;

	@Override
	public JSONObject getList(PageOpt po) {
		return otherNameDao.getList(po);
	}
	
	/**
	 * 删除
	 */
	public void deleteOtherName(JSONArray ID){
			JSONObject obj = new JSONObject();
			obj.put("PEOPLEID", ID);
			DbOpt.getInstance().delByFieldValues(null, "WXK_OTHERNAME", "PEOPLEID",(String[]) (String[]) ID.toArray(new String[0]));
	}
	
	/**
	 * 新增或修改
	 * @param obj
	 */
	public void saveRes(JSONObject obj) {
		if(StringUtils.isBlank(obj.getString("ID"))){
			JSONObject obs=new JSONObject();
			obs.put("PEOPLEID", obj.get("PEOPLEID"));
			obs.put("NTYPE",obj.get("NTYPE"));
			obs.put("NAME",obj.get("NAME"));
			otherNameDao.save(obs);
		}
		if(StringUtils.isNotBlank(obj.getString("ID"))){
			DbOpt.getInstance().updateByKey(null, "WXK_OTHERNAME", obj, null);
		}
	}
	
}
