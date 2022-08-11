package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.LibraryDao;
import cn.com.angke.mgk.service.LibraryService;

@Service
public class LibraryServiceImpl extends PlatformBaseServiceImpl implements LibraryService {

	@Resource(name = "libraryDaoImpl")
	protected LibraryDao libraryDao;
	
	public PlatformBaseDao getBaseDao() {
		return libraryDao;
	}
	
	
}
