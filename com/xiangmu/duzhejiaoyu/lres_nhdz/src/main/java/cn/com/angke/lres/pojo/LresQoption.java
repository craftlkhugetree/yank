package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-01
*/
@Table(name="LRES_QOPTION")
public class LresQoption   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	private Integer isTrue ;
	private String createId ;
	private String optionItem ;
	private String questId ;
	private String tid ;
	private Date createTime ;
	
	public LresQoption() {
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
	
	public Integer getIsTrue(){
		return  isTrue;
	}
	public void setIsTrue(Integer isTrue ){
		this.isTrue = isTrue;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	public String getOptionItem(){
		return  optionItem;
	}
	public void setOptionItem(String optionItem ){
		this.optionItem = optionItem;
	}
	
	public String getQuestId(){
		return  questId;
	}
	public void setQuestId(String questId ){
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

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof LresQoption) {
			LresQoption resq= (LresQoption) obj;
            return id.equalsIgnoreCase(resq.getId().trim());
        }
        return false;
	}
	

}
