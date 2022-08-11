package cn.com.angke.mgk.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.CfgDao;
import cn.com.angke.mgk.service.CfgService;

@Service
public class CfgServiceImpl extends PlatformBaseServiceImpl implements CfgService {

	@Autowired
	protected CfgDao cfgDao;
	
	public JSONObject list(PageOpt po){
		return cfgDao.list(po);
	}
	
	@Override
	public JSONObject save(JSONObject obj) {
		JSONObject r = new JSONObject();
		boolean b = cfgDao.checkCode(obj.getString("ID"),obj.getString("CODE"));
		if(!b){
			r.put("success", false);
			r.put("message", "CODE重复");
		}else{
			cfgDao.save(obj);			
			r.put("success", true);
			r.put("message", "成功");
		}
		return r;
	}
	
	@Override
	public void delete(JSONArray ID) {
		cfgDao.delete(ID);
	}
	@Override
	public JSONObject viewById(String ID) {
		return cfgDao.viewById(ID);
	}

	@Override
	public JSONObject viewByCode(String cODE) {
		return cfgDao.viewByCode(cODE);
	}
}
