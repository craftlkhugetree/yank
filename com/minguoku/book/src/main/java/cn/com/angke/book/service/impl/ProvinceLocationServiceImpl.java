package cn.com.angke.book.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.book.dao.ProvinceLocationDao;
import cn.com.angke.book.service.ProvinceLocationService;

@Service
public class ProvinceLocationServiceImpl extends PlatformBaseServiceImpl implements ProvinceLocationService {

	@Autowired
	protected ProvinceLocationDao provinceLocationDao;

	@Override
	public JSONObject list(PageOpt po) {
		return provinceLocationDao.list(po);
	}
}
