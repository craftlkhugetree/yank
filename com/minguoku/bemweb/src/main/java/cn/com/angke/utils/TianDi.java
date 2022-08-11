package cn.com.angke.utils;

import java.text.ParseException;

/**
 * 根据日期计算天地干支
 * 
 * @author YiT
 *
 */
public class TianDi {
	public static void main(String[] args) throws ParseException {
		System.out.print("2017:"+getTGDZName(2017)+ "年属"+getAnimalYearName(2017));
	}

	private static final String[] arrTian = { "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸" };
	private static final String[] arrDi = { "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥" };
	private final static String[] animalYear = { "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪" };
	private final static int startYear = 1804;// 定义起始年，1804年为甲子年属鼠

	/** 获取当前年份与起始年之间的差值 **/
	public static int subtractYear(int year) {
		int jiaziYear = startYear;
		if (year < jiaziYear&&year>=0) {// 如果年份小于起始的甲子年(startYear = 1804),则起始甲子年往前偏移
			jiaziYear = jiaziYear - (60 + 60 * ((jiaziYear - year) / 60));// 60年一个周期
		}else if(year<0){
			jiaziYear = jiaziYear - (60 + 60 * ((jiaziYear - year) / 60))-1;// 60年一个周期
		}
		return year - jiaziYear;
	}

	/** 获取该年的天干名称 **/
	public static String getTianGanName(int year) {
		String name = arrTian[subtractYear(year) % 10];
		return name;
	}

	/** 获取该年的地支名称 **/
	public static String getDiZhiName(int year) {
		String name = arrDi[subtractYear(year) % 12];
		return name;
	}

	/**
	 * 
	 * 获取该年的天干、地支名称
	 * 
	 * @param year
	 *            年份
	 * 
	 * @return
	 * 
	 */
	public static String getTGDZName(int year) {
		String name = getTianGanName(year) + getDiZhiName(year);
		return name;
	}

	/**
	 * 
	 * 获取该年的生肖名称
	 * 
	 * @param year
	 *            年份
	 * 
	 * @return
	 * 
	 */

	public static String getAnimalYearName(int year) {
		String name = animalYear[subtractYear(year) % 12];
		return name;
	}

}
