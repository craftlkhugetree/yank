package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-20
*/
@Table(name="LRES_QUESTCOUNT")
public class LresQuestcount   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	private Integer passNum ;
	private Integer useNum ;
	private String questId ;
	private String tid ;
	private Date createTime ;
	
	public LresQuestcount() {
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
	
	public Integer getPassNum(){
		return  passNum;
	}
	public void setPassNum(Integer passNum ){
		this.passNum = passNum;
	}
	
	public Integer getUseNum(){
		return  useNum;
	}
	public void setUseNum(Integer useNum ){
		this.useNum = useNum;
	}
	
	public String getQuestId() {
		return questId;
	}

	public void setQuestId(String questId) {
		this.questId = questId;
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
