package cn.com.angke.lres.pojo;
import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2020-07-07
*/
@Table(name="R_LSOURCE_CAMPUS")
public class RLsourceCampus   {
	@AssignID
	private String id ;
	private String campusid ;
	private String learnsourceid ;
	
	public RLsourceCampus() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public String getCampusid(){
		return  campusid;
	}
	public void setCampusid(String campusid ){
		this.campusid = campusid;
	}
	
	public String getLearnsourceid(){
		return  learnsourceid;
	}
	public void setLearnsourceid(String learnsourceid ){
		this.learnsourceid = learnsourceid;
	}
	

}
