package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.PostPeopleDao2;
import cn.com.angke.mgk.service.PostPeopleService2;

@Service
public class PostPeopleServiceImpl2 extends PlatformBaseServiceImpl implements PostPeopleService2 {
	
	@Resource(name="postPeopleDaoImpl2")
	public PostPeopleDao2 postPeopleDao2;
	
	public PlatformBaseDao getBaseDao() {
		return postPeopleDao2;
	}

}
