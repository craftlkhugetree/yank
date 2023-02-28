package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-22
*/
@Table(name="LRES_QRECORD")
public class LresQrecord   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	private Integer isPass ;
	private Integer level ;
	private Integer passLevel ;
	private Integer score ;
	private Integer useTime ;
	private String createId ;
	/*
	资源ID
	*/
	private String resId ;
	private String tid ;
	/*
	用户表ID
	*/
	private String userId ;
	private Date createTime ;
	
	public LresQrecord() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public Integer getIsDelete(){
		return  isDelete;
	}
	public void setIsDelete(Integer isDelete ){
		this.isDelete = isDelete;
	}
	
	public Integer getIsPass(){
		return  isPass;
	}
	public void setIsPass(Integer isPass ){
		this.isPass = isPass;
	}
	
	public Integer getLevel(){
		return  level;
	}
	public void setLevel(Integer level ){
		this.level = level;
	}
	
	public Integer getPassLevel(){
		return  passLevel;
	}
	public void setPassLevel(Integer passLevel ){
		this.passLevel = passLevel;
	}
	
	public Integer getScore(){
		return  score;
	}
	public void setScore(Integer score ){
		this.score = score;
	}
	
	public Integer getUseTime(){
		return  useTime;
	}
	public void setUseTime(Integer useTime ){
		this.useTime = useTime;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	/**
	* 资源ID
	*@return 
	*/
	public String getResId(){
		return  resId;
	}
	/**
	* 资源ID
	*@param  resId
	*/
	public void setResId(String resId ){
		this.resId = resId;
	}
	
	public String getTid(){
		return  tid;
	}
	public void setTid(String tid ){
		this.tid = tid;
	}
	
	/**
	* 用户表ID
	*@return 
	*/
	public String getUserId(){
		return  userId;
	}
	/**
	* 用户表ID
	*@param  userId
	*/
	public void setUserId(String userId ){
		this.userId = userId;
	}
	
	public Date getCreateTime(){
		return  createTime;
	}
	public void setCreateTime(Date createTime ){
		this.createTime = createTime;
	}
	

}
