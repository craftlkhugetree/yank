package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-08
*/
@Table(name="LRES_USER")
public class LresUser   {
	
	/*
	用户ID
	*/
	@AssignID
	private String id ;
	private Integer isDelete ;
	/*
	性别
	*/
	private Integer sex ;
	/*
	条形码
	*/
	private String barcode ;
	/*
	校区ID
	*/
	private String campusId ;
	private String createId ;
	/*
	组织结构
	*/
	private String dept ;
	private String qqcard ;
	private String mobile;
	/*
	邮箱
	*/
	private String email ;
	/*
	年级
	*/
	private String grade ;
	/*
	用户名
	*/
	private String name ;
	/*
	昵称
	*/
	private String nickName ;
	/*
	登录账号（证件号）
	*/
	private String readerId ;
	/*
	读者类型
	*/
	private String readerType ;
	private String ispass;
	private String firstlogin;
	private String tid ;
	private Date createTime ;
	private String idcard;
	private Integer readerFlag;
	
	public LresUser() {
	}
	
	/**
	* 用户ID
	*@return 
	*/
	public String getId(){
		return  id;
	}
	/**
	* 用户ID
	*@param  id
	*/
	public void setId(String id ){
		this.id = id;
	}
	
	public Integer getIsDelete(){
		return  isDelete;
	}
	public void setIsDelete(Integer isDelete ){
		this.isDelete = isDelete;
	}
	
	/**
	* 性别
	*@return 
	*/
	public Integer getSex(){
		return  sex;
	}
	/**
	* 性别
	*@param  sex
	*/
	public void setSex(Integer sex ){
		this.sex = sex;
	}
	
	/**
	* 条形码
	*@return 
	*/
	public String getBarcode(){
		return  barcode;
	}
	/**
	* 条形码
	*@param  barcode
	*/
	public void setBarcode(String barcode ){
		this.barcode = barcode;
	}
	
	/**
	* 校区ID
	*@return 
	*/
	public String getCampusId(){
		return  campusId;
	}
	/**
	* 校区ID
	*@param  campusId
	*/
	public void setCampusId(String campusId ){
		this.campusId = campusId;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	/**
	* 组织结构
	*@return 
	*/
	public String getDept(){
		return  dept;
	}
	/**
	* 组织结构
	*@param  dept
	*/
	public void setDept(String dept ){
		this.dept = dept;
	}
	
	/**
	* 邮箱
	*@return 
	*/
	public String getEmail(){
		return  email;
	}
	/**
	* 邮箱
	*@param  email
	*/
	public void setEmail(String email ){
		this.email = email;
	}
	
	
	public String getQqcard() {
		return qqcard;
	}

	public void setQqcard(String qqcard) {
		this.qqcard = qqcard;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	/**
	* 年级
	*@return 
	*/
	public String getGrade(){
		return  grade;
	}
	/**
	* 年级
	*@param  grade
	*/
	public void setGrade(String grade ){
		this.grade = grade;
	}
	
	/**
	* 用户名
	*@return 
	*/
	public String getName(){
		return  name;
	}
	/**
	* 用户名
	*@param  name
	*/
	public void setName(String name ){
		this.name = name;
	}
	
	/**
	* 昵称
	*@return 
	*/
	public String getNickName(){
		return  nickName;
	}
	/**
	* 昵称
	*@param  nickName
	*/
	public void setNickName(String nickName ){
		this.nickName = nickName;
	}
	
	/**
	* 登录账号（证件号）
	*@return 
	*/
	public String getReaderId(){
		return  readerId;
	}
	/**
	* 登录账号（证件号）
	*@param  readerId
	*/
	public void setReaderId(String readerId ){
		this.readerId = readerId;
	}
	
	/**
	* 读者类型
	*@return 
	*/
	public String getReaderType(){
		return  readerType;
	}
	/**
	* 读者类型
	*@param  readerType
	*/
	public void setReaderType(String readerType ){
		this.readerType = readerType;
	}
	
	public String getTid(){
		return  tid;
	}
	public void setTid(String tid ){
		this.tid = tid;
	}
	
	public Date getCreateTime(){
		return  createTime;
	}
	public void setCreateTime(Date createTime ){
		this.createTime = createTime;
	}

	public Integer getReaderFlag() {
		return readerFlag;
	}

	public String getIdcard() {
		return idcard;
	}

	public void setIdcard(String idcard) {
		this.idcard = idcard;
	}

	public void setReaderFlag(Integer readerFlag) {
		this.readerFlag = readerFlag;
	}

	public String getIspass() {
		return ispass;
	}

	public void setIspass(String ispass) {
		this.ispass = ispass;
	}

	public String getFirstlogin() {
		return firstlogin;
	}

	public void setFirstlogin(String firstlogin) {
		this.firstlogin = firstlogin;
	}
	
}
