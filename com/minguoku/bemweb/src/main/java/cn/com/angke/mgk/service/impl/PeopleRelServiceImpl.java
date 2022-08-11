package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.PeopleRelDao;
import cn.com.angke.mgk.service.PeopleRelService;

@Service
public class PeopleRelServiceImpl extends PlatformBaseServiceImpl implements PeopleRelService {
	
	@Resource(name = "peopleRelDaoImpl")
	public PeopleRelDao peopleRelDao;

	@Override
	public JSONObject getList(PageOpt po) {
		return peopleRelDao.getList(po);
	}
	
	/**
	 * 根据PEOPLEID1ID删除人物关系
	 * @param ID
	 */
	public void deletePeopleRel(JSONArray ID){
		DbOpt.getInstance().delByFieldValues(null, "WXK_PEOPLEREL", "PEOPLE1ID",(String[]) (String[]) ID.toArray(new String[0]));
	}
	
	/**
	 * 根据人物ID新增或修改人物关系表
	 * @param obj
	 */
	public void saveRes(JSONObject obj) {
		if(StringUtils.isBlank(obj.getString("ID"))){
			JSONObject obs=new JSONObject();
			obs.put("PEOPLE1ID", obj.get("PEOPLEID"));
			obs.put("PEOPLE2ID",obj.get("PEOPLE2ID"));
			obs.put("RELTYPE",obj.get("RELTYPE"));
			peopleRelDao.save(obs);
		}
		if(StringUtils.isNotBlank(obj.getString("ID"))){
			DbOpt.getInstance().updateByKey(null, "WXK_PEOPLEREL", obj, null);
		}
	}

	@Override
	public JSONObject getlist(PageOpt po) {
		// TODO Auto-generated method stub
		return peopleRelDao.getlist(po);
	}
}
