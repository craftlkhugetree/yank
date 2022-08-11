package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.CommonDao;
import cn.com.angke.mgk.service.CommonService;

@Service
public class CommonServiceImpl extends PlatformBaseServiceImpl implements CommonService {

	@Resource(name = "commonDaoImpl")
	protected CommonDao commonDao;
	

	@Override
	public JSONObject getCodeList(String CODE) {
		// TODO Auto-generated method stub
		return commonDao.getCodeList(CODE);
	}
	
	@Override
	public JSONObject getYearList(String PID,String FILTER) {
		// TODO Auto-generated method stub
		return commonDao.getYearList(PID,FILTER);
	}
	
	@Override
	public JSONObject getTGDZ(String YEAR) {
		// TODO Auto-generated method stub
		return commonDao.getTGDZ(YEAR);
	}

	@Override
	public JSONObject getZTTYPE(String LVL, String TYPE) {
		// TODO Auto-generated method stub
		return commonDao.getZTTYPE(LVL, TYPE);
	}

	@Override
	public JSONObject Test(String LVL) {
		// TODO Auto-generated method stub
		return commonDao.Test(LVL);
	}
}
