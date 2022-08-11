package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.RelationDao;
import cn.com.angke.mgk.service.RelationService;

@Service
public class RelationServiceImpl extends PlatformBaseServiceImpl implements RelationService {

	
	@Resource(name = "relationDaoImpl")
	public RelationDao relationDao;
	
	
	@Override
	public JSONObject getRelationList(PageOpt po) {
		return relationDao.getRelationList(po);
	}

}
