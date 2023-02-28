package cn.com.angke.lres.service;

import java.util.List;

import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.vo.CampusVo;

public interface CampusService {
	List<CampusVo> list();
	void add(String name,Integer type);
	void delete(String id) throws LresException;
	void update(String id, String name);
}
