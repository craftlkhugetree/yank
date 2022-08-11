package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.PublicDao;
import cn.com.angke.mgk.service.PublicService;
@Service
public class PublicServiceImpl extends PlatformBaseServiceImpl implements PublicService {
	
	@Resource(name = "publicDaoImpl")
	public PublicDao publicDao;
	
	public PlatformBaseDao geBaseDao(){
		return publicDao;
	}

	@Override
	public JSONObject getOrgList(PageOpt po) {
		return publicDao.getOrgList(po);
	}

	public JSONObject save(JSONObject obj){
		return publicDao.save(obj);
	}
	
}
