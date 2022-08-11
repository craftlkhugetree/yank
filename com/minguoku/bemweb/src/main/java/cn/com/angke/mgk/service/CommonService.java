package cn.com.angke.mgk.service;

import com.alibaba.fastjson.JSONObject;

public interface CommonService {
	/**
	 * 获取年代、朝代
	 * @param CODE
	 * @return
	 */
	public JSONObject getCodeList(String CODE);
	
	/**
	 * 获取纪年
	 * @param PID
	 * @return
	 */
	public JSONObject getYearList(String PID,String FILTER);
	
	/**
	 * 根据年份得出干支年
	 * @param YEAR
	 * @return
	 */
	public JSONObject getTGDZ(String YEAR);
	
	/**
	 * 获取中图法
	 * @param LVL
	 * @param TYPE
	 * @return
	 */
	public JSONObject getZTTYPE(String LVL,String TYPE);
	
	public JSONObject Test(String LVL);

}
