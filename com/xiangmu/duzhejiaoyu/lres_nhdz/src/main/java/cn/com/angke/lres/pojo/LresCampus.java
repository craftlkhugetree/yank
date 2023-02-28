package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-04
*/
@Table(name="LRES_CAMPUS")
public class LresCampus   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	/*
	校区类型：1系统生成2用户添加
	*/
	private Integer type ;
	private String name ;
	private String tid ;
	private Date createTime ;
	
	public LresCampus() {
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
	* 校区类型：1系统生成2用户添加
	*@return 
	*/
	public Integer getType(){
		return  type;
	}
	/**
	* 校区类型：1系统生成2用户添加
	*@param  type
	*/
	public void setType(Integer type ){
		this.type = type;
	}
	
	public String getName(){
		return  name;
	}
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
