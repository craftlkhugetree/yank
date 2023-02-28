package cn.com.angke.lres.pojo;
import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2020-08-21
*/
@Table(name="R_LSOURCE_READTYPE")
public class RLsourceReadtype   {
	@AssignID
	private String id ;
	private String learnsourceid ;
	private String readertype ;
	
	public RLsourceReadtype() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public String getLearnsourceid(){
		return  learnsourceid;
	}
	public void setLearnsourceid(String learnsourceid ){
		this.learnsourceid = learnsourceid;
	}

	public String getReadertype() {
		return readertype;
	}

	public void setReadertype(String readertype) {
		this.readertype = readertype;
	}
}
