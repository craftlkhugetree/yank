package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.PeopleDao;
import cn.com.angke.mgk.service.PeopleService;

@Service
public class PeopleServiceImpl extends PlatformBaseServiceImpl implements PeopleService {

	@Resource(name = "peopleDaoImpl")
	public PeopleDao peopleDao;
	
	public PlatformBaseDao geBaseDao(){
		return peopleDao;
	}
	
}
