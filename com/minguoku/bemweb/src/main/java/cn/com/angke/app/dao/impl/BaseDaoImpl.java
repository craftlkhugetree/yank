package cn.com.angke.app.dao.impl;

import org.beetl.sql.core.SQLManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.com.angke.app.dao.BaseDao;

@Component
public class BaseDaoImpl implements BaseDao {
	@Autowired
	SQLManager sqlManager;
	@Override
	public SQLManager getSql() {
		return sqlManager;
	}

}
