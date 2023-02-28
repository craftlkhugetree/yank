package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-12
*/
@Table(name="R_QRES_CLASS")
public class RQresClass   {
	@AssignID
	private String id ;
	private String classId ;
	private String qresId ;
	private String tid ;
	private Date createTime ;
	private Integer isDelete ;
	
	public RQresClass() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public String getClassId(){
		return  classId;
	}
	public void setClassId(String classId ){
		this.classId = classId;
	}
	
	public String getQresId(){
		return  qresId;
	}
	public void setQresId(String qresId ){
		this.qresId = qresId;
	}

	public String getTid() {
		return tid;
	}

	public void setTid(String tid) {
		this.tid = tid;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Integer getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(Integer isDelete) {
		this.isDelete = isDelete;
	}
	

}
