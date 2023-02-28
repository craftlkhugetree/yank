package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-12
*/
@Table(name="LRES_QRESITEM")
public class LresQresitem   {
	@AssignID
	private String id ;
	private Integer isDelete ;
	/*
	题目数量
	*/
	private Integer quesNum ;
	/*
	题目类型：1单选2多选3判断
	*/
	private Integer quesType ;
	/*
	题目分值
	*/
	private Integer score ;
	/*
	关卡ID
	*/
	private String levelId ;
	/*
	试卷ID
	*/
	private String qresId ;
	private String tid ;
	private Date createTime ;
	
	public LresQresitem() {
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
	* 题目数量
	*@return 
	*/
	public Integer getQuesNum(){
		return  quesNum;
	}
	/**
	* 题目数量
	*@param  quesNum
	*/
	public void setQuesNum(Integer quesNum ){
		this.quesNum = quesNum;
	}
	
	/**
	* 题目类型：1单选2多选3判断
	*@return 
	*/
	public Integer getQuesType(){
		return  quesType;
	}
	/**
	* 题目类型：1单选2多选3判断
	*@param  quesType
	*/
	public void setQuesType(Integer quesType ){
		this.quesType = quesType;
	}
	
	/**
	* 题目分值
	*@return 
	*/
	public Integer getScore(){
		return  score;
	}
	/**
	* 题目分值
	*@param  score
	*/
	public void setScore(Integer score ){
		this.score = score;
	}
	
	/**
	* 关卡ID
	*@return 
	*/
	public String getLevelId(){
		return  levelId;
	}
	/**
	* 关卡ID
	*@param  levelId
	*/
	public void setLevelId(String levelId ){
		this.levelId = levelId;
	}
	
	/**
	* 试卷ID
	*@return 
	*/
	public String getQresId(){
		return  qresId;
	}
	/**
	* 试卷ID
	*@param  qresId
	*/
	public void setQresId(String qresId ){
		this.qresId = qresId;
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
