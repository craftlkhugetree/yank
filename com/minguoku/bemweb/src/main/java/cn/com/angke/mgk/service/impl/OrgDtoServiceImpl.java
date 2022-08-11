package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.OrgDaoDto;
import cn.com.angke.mgk.service.OrgDtoService;

@Service
public class OrgDtoServiceImpl extends PlatformBaseServiceImpl implements OrgDtoService {

	@Resource(name = "orgDaoDtoImpl")
	public OrgDaoDto orgDaoDto;
	
	@Override
	public JSONObject getGrid(PageOpt po) {
		return orgDaoDto.getGrid(po);
	}
	
	public JSONObject getGridById(PageOpt po) {
		return orgDaoDto.getGridById(po);
	}
	
	public int getCount(PageOpt po){
		return orgDaoDto.getCount(po);
	}

}
