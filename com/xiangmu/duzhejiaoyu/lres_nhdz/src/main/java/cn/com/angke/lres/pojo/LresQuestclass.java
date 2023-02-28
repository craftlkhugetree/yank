package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-01
*/
@Table(name="LRES_QUESTCLASS")
public class LresQuestclass   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	private String createId ;
	/*
	考试资源分类
	*/
	private String name ;
	private String tid ;
	private Date createTime ;
	
	public LresQuestclass() {
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
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	/**
	* 考试资源分类
	*@return 
	*/
	public String getName(){
		return  name;
	}
	/**
	* 考试资源分类
	*@param  name
	*/
	public void setName(String name ){
		this.name = name;
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
	

}
