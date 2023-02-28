package cn.com.angke.lres.pojo;
import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2020-07-07
*/
@Table(name="LRES_RULES")
public class LresRules   {
	@AssignID
	private String id ;
	private String rcode ;
	private String rname ;
	private String rval ;
	
	public LresRules() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public String getRcode(){
		return  rcode;
	}
	public void setRcode(String rcode ){
		this.rcode = rcode;
	}
	
	public String getRname(){
		return  rname;
	}
	public void setRname(String rname ){
		this.rname = rname;
	}
	
	public String getRval(){
		return  rval;
	}
	public void setRval(String rval ){
		this.rval = rval;
	}
	

}
