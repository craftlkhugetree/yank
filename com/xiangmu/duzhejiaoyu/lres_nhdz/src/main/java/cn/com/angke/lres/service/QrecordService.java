package cn.com.angke.lres.service;


import cn.com.angke.lres.pojo.LresQrecord;

public interface QrecordService {
	void saveQrecord(LresQrecord dto,boolean active);
	LresQrecord findQrecord(String resId);
}
