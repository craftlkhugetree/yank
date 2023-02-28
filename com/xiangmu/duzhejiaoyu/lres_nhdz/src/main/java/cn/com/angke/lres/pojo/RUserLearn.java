package cn.com.angke.lres.pojo;
import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2020-07-08
*/
@Table(name="R_USER_LEARN")
public class RUserLearn   {
	@AssignID
	private String id ;
	private String isover ;
	private String lsourceid ;
	private String userid ;
	
	public RUserLearn() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public String getIsover(){
		return  isover;
	}
	public void setIsover(String isover ){
		this.isover = isover;
	}
	
	public String getLsourceid(){
		return  lsourceid;
	}
	public void setLsourceid(String lsourceid ){
		this.lsourceid = lsourceid;
	}
	
	public String getUserid(){
		return  userid;
	}
	public void setUserid(String userid ){
		this.userid = userid;
	}
	

}
