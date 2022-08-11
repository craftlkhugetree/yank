package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.PeopleDtoDao;
import cn.com.angke.mgk.service.PeopleDtoService;

@Service
public class PeopleDtoServiceImpl extends PlatformBaseServiceImpl implements PeopleDtoService{
	
	@Resource(name="peopleDtoDaoImpl")
	public PeopleDtoDao peopleDtoDao;

}
