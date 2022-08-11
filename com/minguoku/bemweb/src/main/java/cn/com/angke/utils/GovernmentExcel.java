package cn.com.angke.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;

public class GovernmentExcel {
	private String code;//政府代码
	private String org1;//一级
	private String org2;//二级
	private String org3;//三级
	private String org4;//四级
	private String org5;//五级
	private String fullName;//完整名称
	private String setYear;//设置年号
	private String setTime;//设置时间
	private String abolishTime;//废止时间
	private String power;//执掌
	private String governor;//行政主管
	private String childOrg;//下设机构
	private String alias;//别称
	private String modifyName;//后改名
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getOrg1() {
		return org1 == null ? "" : org1.replaceAll(" ", "");
	}
	public void setOrg1(String org1) {
		this.org1 = org1;
	}
	public String getOrg2() {
		return org2 == null ? "" : org2.replaceAll(" ", "");
	}
	public void setOrg2(String org2) {
		this.org2 = org2;
	}
	public String getOrg3() {
		return org3 == null ? "" : org3.replaceAll(" ", "");
	}
	public void setOrg3(String org3) {
		this.org3 = org3;
	}
	public String getOrg4() {
		return org4 == null ? "" : org4.replaceAll(" ", "");
	}
	public void setOrg4(String org4) {
		this.org4 = org4;
	}
	public String getOrg5() {
		return org5 == null ? "" : org5.replaceAll(" ", "");
	}
	public void setOrg5(String org5) {
		this.org5 = org5;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getSetYear() {
		return setYear;
	}
	public void setSetYear(String setYear) {
		this.setYear = setYear;
	}
	public String getSetTime() {
		if(StringUtils.isNotBlank(setTime)){
			if(ExcelUtil.ifAllNum(setTime)){
				this.setTime = ExcelUtil.forMatExcelDaysToDate(Integer.parseInt(setTime), new SimpleDateFormat("yyyy年MM月"));
			}
		}
		return setTime;
	}
	public void setSetTime(String setTime) {
		this.setTime = setTime;
	}
	public String getAbolishTime() {
		if(StringUtils.isNotBlank(abolishTime)){
			if(ExcelUtil.ifAllNum(abolishTime)){
				this.abolishTime = ExcelUtil.forMatExcelDaysToDate(Integer.parseInt(abolishTime), new SimpleDateFormat("yyyy年MM月"));
			}
		}
		return abolishTime;
	}
	public void setAbolishTime(String abolishTime) {
		this.abolishTime = abolishTime;
	}
	public String getPower() {
		return power;
	}
	public void setPower(String power) {
		this.power = power;
	}
	public String getGovernor() {
		return governor;
	}
	public void setGovernor(String governor) {
		this.governor = governor;
	}
	public String getChildOrg() {
		return childOrg;
	}
	public void setChildOrg(String childOrg) {
		this.childOrg = childOrg;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getModifyName() {
		return modifyName;
	}
	public void setModifyName(String modifyName) {
		this.modifyName = modifyName;
	}
	public JSONObject toJson(){
		JSONObject obj = (JSONObject) JSONObject.toJSON(this);
		JSONObject newObj = new JSONObject();
		//会有首字母大写的问题
		for(String key:obj.keySet()){
			newObj.put(key.toUpperCase(), obj.getString(key));
		}
		return newObj;
	}
	
	
	
	@Override
	public String toString() {
		return "GovernmentExcel [code=" + code + ", org1=" + org1 + ", org2=" + org2 + ", org3=" + org3 + ", org4="
				+ org4 + ", org5=" + org5 + ", fullName=" + fullName + ", setYear=" + setYear + ", setTime=" + setTime
				+ ", abolishTime=" + abolishTime + ", power=" + power + ", governor=" + governor + ", childOrg="
				+ childOrg + ", alias=" + alias + ", modifyName=" + modifyName + "]";
	}
	public String getFatherFullName(int level){
		try {
			if(level>1&&level<6){
				int fatherLength = 0;
				if(level==2){
					fatherLength = fullName.length()-org2.length();
				}else if(level==3){
					fatherLength = fullName.length()-org3.length();
				}else if(level==4){
					fatherLength = fullName.length()-org4.length();
				}else if(level==5){
					fatherLength = fullName.length()-org5.length();
				}
				return fullName.substring(0,fatherLength);
			}else{
				return null;
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(this.toString());
			return null;
		}
	}
}
