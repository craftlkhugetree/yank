package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.AccordingDao;
import cn.com.angke.mgk.service.AccordingService;

@Service
public class AccordingServiceImpl extends PlatformBaseServiceImpl implements AccordingService{
	
	@Resource(name="accordingDaoImpl")
	private AccordingDao  accordingDao;
	
	public PlatformBaseDao geBaseDao(){
		return accordingDao;
	}

	@Override
	public JSONObject getList(PageOpt po) {
		return accordingDao.getList(po);
	}

}
 