package cn.com.angke.lres.service;

import java.util.List;

import cn.com.angke.lres.pojo.LresReadertype;

public interface ReaderTypeService {
	List<LresReadertype> list();
	void syncReaderType();
}
