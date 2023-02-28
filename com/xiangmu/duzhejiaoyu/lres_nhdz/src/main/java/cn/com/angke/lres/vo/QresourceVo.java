package cn.com.angke.lres.vo;

import java.util.List;

import cn.com.angke.lres.pojo.RQresClass;

public class QresourceVo{
	private String id ;
	/*
	是否使用
	*/
	private Integer isUse ;
	/*
	最少考试时间
	*/
	private Integer minTime ;
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
	/*
	试卷标题
	*/
	private String name ;
	/*
	考卷试用对象
	*/
	private String userType ;
	private String validEnd ;
	/*
	资源有效期
	*/
	private String validStart ;
	private String ValidDateStr;
	private String userTypeStr;
	private String campusStr;
	private List<RQresClass> classList;
	private List<QresitemVo> itemList;
	private List<QlevelVo> levelList;
	private Integer needstudytime ;
	public Integer getNeedstudytime() {
		return needstudytime;
	}
	public void setNeedstudytime(Integer needstudytime) {
		this.needstudytime = needstudytime;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getIsUse() {
		return isUse;
	}
	public void setIsUse(Integer isUse) {
		this.isUse = isUse;
	}
	public Integer getMinTime() {
		return minTime;
	}
	public void setMinTime(Integer minTime) {
		this.minTime = minTime;
	}
	public Integer getNeedTime() {
		return needTime;
	}
	public void setNeedTime(Integer needTime) {
		this.needTime = needTime;
	}
	public Integer getPassScore() {
		return passScore;
	}
	public void setPassScore(Integer passScore) {
		this.passScore = passScore;
	}
	public Integer getResultType() {
		return resultType;
	}
	public void setResultType(Integer resultType) {
		this.resultType = resultType;
	}
	public Integer getTemplateCode() {
		return templateCode;
	}
	public void setTemplateCode(Integer templateCode) {
		this.templateCode = templateCode;
	}
	public Integer getTestType() {
		return testType;
	}
	public void setTestType(Integer testType) {
		this.testType = testType;
	}
	public String getCampusId() {
		return campusId;
	}
	public void setCampusId(String campusId) {
		this.campusId = campusId;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	public String getValidEnd() {
		return validEnd;
	}
	public void setValidEnd(String validEnd) {
		this.validEnd = validEnd;
	}
	public String getValidStart() {
		return validStart;
	}
	public void setValidStart(String validStart) {
		this.validStart = validStart;
	}
	public List<QresitemVo> getItemList() {
		return itemList;
	}
	public void setItemList(List<QresitemVo> itemList) {
		this.itemList = itemList;
	}
	public List<QlevelVo> getLevelList() {
		return levelList;
	}
	public void setLevelList(List<QlevelVo> levelList) {
		this.levelList = levelList;
	}
	public String getValidDateStr() {
		return ValidDateStr;
	}
	public void setValidDateStr(String validDateStr) {
		ValidDateStr = validDateStr;
	}
	public String getUserTypeStr() {
		return userTypeStr;
	}
	public void setUserTypeStr(String userTypeStr) {
		this.userTypeStr = userTypeStr;
	}
	public List<RQresClass> getClassList() {
		return classList;
	}
	public void setClassList(List<RQresClass> classList) {
		this.classList = classList;
	}
	public String getCampusStr() {
		return campusStr;
	}
	public void setCampusStr(String campusStr) {
		this.campusStr = campusStr;
	}
	
	
}
