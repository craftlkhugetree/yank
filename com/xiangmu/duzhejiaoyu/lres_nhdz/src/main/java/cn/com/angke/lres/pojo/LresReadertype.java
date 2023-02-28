package cn.com.angke.lres.pojo;
import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2020-07-07
*/
@Table(name="LRES_READERTYPE")
public class LresReadertype   {
	@AssignID
	private String id ;
	private String readname ;
	private String readtype ;
	private String isconfig;
	
	public LresReadertype() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public String getReadname(){
		return  readname;
	}
	public void setReadname(String readname ){
		this.readname = readname;
	}
	
	public String getReadtype(){
		return  readtype;
	}
	public void setReadtype(String readtype ){
		this.readtype = readtype;
	}

	public String getIsconfig() {
		return isconfig;
	}

	public void setIsconfig(String isconfig) {
		this.isconfig = isconfig;
	}
	

}
