package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-15
*/
@Table(name="LRES_LRECORD")
public class LresLrecord   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	/*
	学习开始时间
	*/
	private Integer learnTime ;
	private String createId ;
	private String tid ;
	/*
	用户ID
	*/
	private String userId ;
	private Date createTime ;
	private Date learnDate ;
	private Date learnStart ;
	
	public LresLrecord() {
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
	
	/**
	* 学习开始时间
	*@return 
	*/
	public Integer getLearnTime(){
		return  learnTime;
	}
	/**
	* 学习开始时间
	*@param  learnTime
	*/
	public void setLearnTime(Integer learnTime ){
		this.learnTime = learnTime;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	public String getTid(){
		return  tid;
	}
	public void setTid(String tid ){
		this.tid = tid;
	}
	
	/**
	* 用户ID
	*@return 
	*/
	public String getUserId(){
		return  userId;
	}
	/**
	* 用户ID
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
	
	public Date getLearnDate(){
		return  learnDate;
	}
	public void setLearnDate(Date learnDate ){
		this.learnDate = learnDate;
	}
	
	public Date getLearnStart(){
		return  learnStart;
	}
	public void setLearnStart(Date learnStart ){
		this.learnStart = learnStart;
	}
	

}
