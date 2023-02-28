package cn.com.angke.lres.pojo;
import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2020-07-27
*/
@Table(name="LRES_CONFIG")
public class LresConfig   {
	@AssignID
	private String id ;
	private String configkey ;
	private String configval ;
	
	public LresConfig() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public String getConfigkey(){
		return  configkey;
	}
	public void setConfigkey(String configkey ){
		this.configkey = configkey;
	}
	
	public String getConfigval(){
		return  configval;
	}
	public void setConfigval(String configval ){
		this.configval = configval;
	}
	

}
