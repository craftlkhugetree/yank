package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.OfficeTypeDao;
import cn.com.angke.mgk.service.OfficeTypeService;

@Service
public class OfficeTypeServiceImpl extends PlatformBaseServiceImpl implements OfficeTypeService {

	@Resource(name = "officeTypeDaoImpl")
	public OfficeTypeDao officeTypeDao;
	
	public PlatformBaseDao getBaseDao() {
		return officeTypeDao;
	}
	
}
