package cn.com.angke.lres.service;

import java.util.List;

import cn.com.angke.lres.pojo.LresConfig;

public interface ConfigService {
	List<LresConfig> list();
	LresConfig findByCode(String code);
}
