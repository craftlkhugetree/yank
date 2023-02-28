package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-06
*/
@Table(name="LRES_QUESTION")
public class LresQuestion   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	/*
	判断题对错：0错1对
	*/
	private Integer isTrue ;
	/*
	是否必考 0否1是
	*/
	private Integer isUse ;
	/*
	1单选 2多选 3判断
	*/
	private Integer quesType ;
	private String classId ;
	private String createId ;
	/*
	附件URL
	*/
	private String fileUrl ;
	/*
	题目分析
	*/
	private String quesAnaly ;
	/*
	题目内容
	*/
	private String quesTitle ;
	private String tid ;
	private Date createTime ;
	
	public LresQuestion() {
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
	* 判断题对错：0错1对
	*@return 
	*/
	public Integer getIsTrue(){
		return  isTrue;
	}
	/**
	* 判断题对错：0错1对
	*@param  isTrue
	*/
	public void setIsTrue(Integer isTrue ){
		this.isTrue = isTrue;
	}
	
	/**
	* 是否必考 0否1是
	*@return 
	*/
	public Integer getIsUse(){
		return  isUse;
	}
	/**
	* 是否必考 0否1是
	*@param  isUse
	*/
	public void setIsUse(Integer isUse ){
		this.isUse = isUse;
	}
	
	/**
	* 1单选 2多选 3判断
	*@return 
	*/
	public Integer getQuesType(){
		return  quesType;
	}
	/**
	* 1单选 2多选 3判断
	*@param  quesType
	*/
	public void setQuesType(Integer quesType ){
		this.quesType = quesType;
	}
	
	public String getClassId(){
		return  classId;
	}
	public void setClassId(String classId ){
		this.classId = classId;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	/**
	* 附件URL
	*@return 
	*/
	public String getFileUrl(){
		return  fileUrl;
	}
	/**
	* 附件URL
	*@param  fileUrl
	*/
	public void setFileUrl(String fileUrl ){
		this.fileUrl = fileUrl;
	}
	
	/**
	* 题目分析
	*@return 
	*/
	public String getQuesAnaly(){
		return  quesAnaly;
	}
	/**
	* 题目分析
	*@param  quesAnaly
	*/
	public void setQuesAnaly(String quesAnaly ){
		this.quesAnaly = quesAnaly;
	}
	
	/**
	* 题目内容
	*@return 
	*/
	public String getQuesTitle(){
		return  quesTitle;
	}
	/**
	* 题目内容
	*@param  quesTitle
	*/
	public void setQuesTitle(String quesTitle ){
		this.quesTitle = quesTitle;
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
