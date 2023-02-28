package cn.com.angke.lres.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import cn.com.angke.lres.pojo.LresConfig;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.ConfigService;

@Service
public class ConfigServiceImpl extends BaseService implements ConfigService {

	@Override
	public List<LresConfig> list() {
		return sqlManager().query(LresConfig.class).select();
	}

	@Override
	public LresConfig findByCode(String code) {
		return sqlManager().query(LresConfig.class).andEq("CONFIGKEY",code).single();
	}

}
