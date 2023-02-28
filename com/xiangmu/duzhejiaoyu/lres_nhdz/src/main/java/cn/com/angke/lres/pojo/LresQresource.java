package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2020-04-14
*/
@Table(name="LRES_QRESOURCE")
public class LresQresource   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	/*
	是否使用
	*/
	private Integer isUse ;
	/*
	最少考试时间
	*/
	private Integer minTime ;
	private Integer needstudytime ;
	/*
	考试时间
	*/
	private Integer needTime ;
	/*
	通过分数/通过关卡
	*/
	private Integer passScore ;
	/*
	答案展示形式：1只展示结果2展示错题及分析3答一题就展示答案及分析
	*/
	private Integer resultType ;
	/*
	试卷总分数/总关卡
	*/
	private Integer score ;
	/*
	1.模板A 2.模板B
	*/
	private Integer templateCode ;
	/*
	考试形式：1.普通考试2.模拟考试3.闯关考试4.开卷考试
	*/
	private Integer testType ;
	/*
	校区ID
	*/
	private String campusId ;
	private String createId ;
	/*
	试卷标题
	*/
	private String name ;
	private String tid ;
	/*
	考卷试用对象
	*/
	private String userType ;
	private Date createTime ;
	private Date validEnd ;
	/*
	资源有效期
	*/
	private Date validStart ;
	
	public LresQresource() {
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
	
	/**
	* 是否使用
	*@return 
	*/
	public Integer getIsUse(){
		return  isUse;
	}
	/**
	* 是否使用
	*@param  isUse
	*/
	public void setIsUse(Integer isUse ){
		this.isUse = isUse;
	}
	
	/**
	* 最少考试时间
	*@return 
	*/
	public Integer getMinTime(){
		return  minTime;
	}
	/**
	* 最少考试时间
	*@param  minTime
	*/
	public void setMinTime(Integer minTime ){
		this.minTime = minTime;
	}
	
	public Integer getNeedstudytime(){
		return  needstudytime;
	}
	public void setNeedstudytime(Integer needstudytime ){
		this.needstudytime = needstudytime;
	}
	
	/**
	* 考试时间
	*@return 
	*/
	public Integer getNeedTime(){
		return  needTime;
	}
	/**
	* 考试时间
	*@param  needTime
	*/
	public void setNeedTime(Integer needTime ){
		this.needTime = needTime;
	}
	
	/**
	* 通过分数/通过关卡
	*@return 
	*/
	public Integer getPassScore(){
		return  passScore;
	}
	/**
	* 通过分数/通过关卡
	*@param  passScore
	*/
	public void setPassScore(Integer passScore ){
		this.passScore = passScore;
	}
	
	/**
	* 答案展示形式：1只展示结果2展示错题及分析3答一题就展示答案及分析
	*@return 
	*/
	public Integer getResultType(){
		return  resultType;
	}
	/**
	* 答案展示形式：1只展示结果2展示错题及分析3答一题就展示答案及分析
	*@param  resultType
	*/
	public void setResultType(Integer resultType ){
		this.resultType = resultType;
	}
	
	/**
	* 试卷总分数/总关卡
	*@return 
	*/
	public Integer getScore(){
		return  score;
	}
	/**
	* 试卷总分数/总关卡
	*@param  score
	*/
	public void setScore(Integer score ){
		this.score = score;
	}
	
	/**
	* 1.模板A 2.模板B
	*@return 
	*/
	public Integer getTemplateCode(){
		return  templateCode;
	}
	/**
	* 1.模板A 2.模板B
	*@param  templateCode
	*/
	public void setTemplateCode(Integer templateCode ){
		this.templateCode = templateCode;
	}
	
	/**
	* 考试形式：1.普通考试2.模拟考试3.闯关考试4.开卷考试
	*@return 
	*/
	public Integer getTestType(){
		return  testType;
	}
	/**
	* 考试形式：1.普通考试2.模拟考试3.闯关考试4.开卷考试
	*@param  testType
	*/
	public void setTestType(Integer testType ){
		this.testType = testType;
	}
	
	/**
	* 校区ID
	*@return 
	*/
	public String getCampusId(){
		return  campusId;
	}
	/**
	* 校区ID
	*@param  campusId
	*/
	public void setCampusId(String campusId ){
		this.campusId = campusId;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	/**
	* 试卷标题
	*@return 
	*/
	public String getName(){
		return  name;
	}
	/**
	* 试卷标题
	*@param  name
	*/
	public void setName(String name ){
		this.name = name;
	}
	
	public String getTid(){
		return  tid;
	}
	public void setTid(String tid ){
		this.tid = tid;
	}
	
	/**
	* 考卷试用对象
	*@return 
	*/
	public String getUserType(){
		return  userType;
	}
	/**
	* 考卷试用对象
	*@param  userType
	*/
	public void setUserType(String userType ){
		this.userType = userType;
	}
	
	public Date getCreateTime(){
		return  createTime;
	}
	public void setCreateTime(Date createTime ){
		this.createTime = createTime;
	}
	
	public Date getValidEnd(){
		return  validEnd;
	}
	public void setValidEnd(Date validEnd ){
		this.validEnd = validEnd;
	}
	
	/**
	* 资源有效期
	*@return 
	*/
	public Date getValidStart(){
		return  validStart;
	}
	/**
	* 资源有效期
	*@param  validStart
	*/
	public void setValidStart(Date validStart ){
		this.validStart = validStart;
	}
	

}
