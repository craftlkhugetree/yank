package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.PostDao2;
import cn.com.angke.mgk.service.PostService2;

@Service
public class PostServiceImpl2 extends PlatformBaseServiceImpl implements PostService2 {

	@Resource(name = "postDaoImpl2")
	public PostDao2 postDao2;
	
	public PlatformBaseDao getBaseDao() {
		return postDao2;
	}
	
}
