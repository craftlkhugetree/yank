package cn.com.angke.mgk.dao;

import com.alibaba.fastjson.JSONObject;


public interface CommonDao  {
	
	/**
	 * 查询年代/朝代
	 * @param CODE
	 * @return
	 */
	public JSONObject getCodeList(String CODE);
	
	/**
	 * 查询纪年表
	 * @param PID
	 * @return
	 */
	public JSONObject getYearList(String PID,String FILTER);
	
	/**
	 * 根据年份的出干支年
	 * @param YEAR
	 * @return
	 */
	public JSONObject getTGDZ(String YEAR);
	
	/**
	 * 查询中图法
	 * @param LVL
	 * @param TYPE
	 * @return
	 */
	public JSONObject getZTTYPE(String LVL,String TYPE);

	public JSONObject Test(String LVL);
}
