package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-06-10
*/
@Table(name="LRES_QLEVEL")
public class LresQlevel   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	private Integer levelNum ;
	private Integer needTime ;
	private Integer passScore ;
	private Integer score ;
	private String classId ;
	private String qresId ;
	private String tid ;
	private Date createTime ;
	
	public LresQlevel() {
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
	
	public Integer getLevelNum(){
		return  levelNum;
	}
	public void setLevelNum(Integer levelNum ){
		this.levelNum = levelNum;
	}
	
	public Integer getNeedTime(){
		return  needTime;
	}
	public void setNeedTime(Integer needTime ){
		this.needTime = needTime;
	}
	
	public Integer getPassScore(){
		return  passScore;
	}
	public void setPassScore(Integer passScore ){
		this.passScore = passScore;
	}
	
	public Integer getScore(){
		return  score;
	}
	public void setScore(Integer score ){
		this.score = score;
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
