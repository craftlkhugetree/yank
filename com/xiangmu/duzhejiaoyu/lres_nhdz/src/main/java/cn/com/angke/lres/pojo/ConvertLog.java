package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-04
*/
@Table(name="CONVERT_LOG")
public class ConvertLog   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	private Integer resultCode ;
	private String createId ;
	private String source ;
	private String target ;
	/*
	租户ID
	*/
	private String tid ;
	private String useTime ;
	private Date createTime ;
	
	public ConvertLog() {
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
	
	public Integer getResultCode(){
		return  resultCode;
	}
	public void setResultCode(Integer resultCode ){
		this.resultCode = resultCode;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	public String getSource(){
		return  source;
	}
	public void setSource(String source ){
		this.source = source;
	}
	
	public String getTarget(){
		return  target;
	}
	public void setTarget(String target ){
		this.target = target;
	}
	
	/**
	* 租户ID
	*@return 
	*/
	public String getTid(){
		return  tid;
	}
	/**
	* 租户ID
	*@param  tid
	*/
	public void setTid(String tid ){
		this.tid = tid;
	}
	
	public String getUseTime(){
		return  useTime;
	}
	public void setUseTime(String useTime ){
		this.useTime = useTime;
	}
	
	public Date getCreateTime(){
		return  createTime;
	}
	public void setCreateTime(Date createTime ){
		this.createTime = createTime;
	}
	

}
