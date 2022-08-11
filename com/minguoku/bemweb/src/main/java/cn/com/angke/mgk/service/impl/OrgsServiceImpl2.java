package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.OrgsDao2;
import cn.com.angke.mgk.service.OrgsService2;

@Service
public class OrgsServiceImpl2 extends PlatformBaseServiceImpl implements OrgsService2 {

	@Resource(name = "orgsDaoImpl2")
	public OrgsDao2 orgsDao2;
	
	/*public PlatformBaseDao getBaseDao() {
		return  orgsDao2;
	}*/
	
	
}
