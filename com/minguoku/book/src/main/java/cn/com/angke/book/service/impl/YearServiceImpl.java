package cn.com.angke.book.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.book.dao.YearDao;
import cn.com.angke.book.service.YearService;

@Service
public class YearServiceImpl extends PlatformBaseServiceImpl implements YearService {

	@Autowired
	protected YearDao yearDao;

	@Override
	public JSONObject list(PageOpt po) {
		return yearDao.list(po);
	}
}
