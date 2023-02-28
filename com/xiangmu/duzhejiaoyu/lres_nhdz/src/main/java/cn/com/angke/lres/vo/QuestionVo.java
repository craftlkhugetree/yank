package cn.com.angke.lres.vo;

import java.util.List;

public class QuestionVo{
	private String id ;
	private String classId ;
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
	private Integer passNum ;
	private Integer useNum ;
	private String optionIds;
	private String optionStr;
	private String trueStr;
	private String classStr;
	private Integer score;
	private List<OptionVo> optionList;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getIsTrue() {
		return isTrue;
	}
	public void setIsTrue(Integer isTrue) {
		this.isTrue = isTrue;
	}
	public Integer getIsUse() {
		return isUse;
	}
	public void setIsUse(Integer isUse) {
		this.isUse = isUse;
	}
	public Integer getQuesType() {
		return quesType;
	}
	public void setQuesType(Integer quesType) {
		this.quesType = quesType;
	}
	public String getFileUrl() {
		return fileUrl;
	}
	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}
	public String getQuesAnaly() {
		return quesAnaly;
	}
	public void setQuesAnaly(String quesAnaly) {
		this.quesAnaly = quesAnaly;
	}
	public String getQuesTitle() {
		return quesTitle;
	}
	public void setQuesTitle(String quesTitle) {
		this.quesTitle = quesTitle;
	}
	public String getOptionStr() {
		return optionStr;
	}
	public void setOptionStr(String optionStr) {
		this.optionStr = optionStr;
	}
	public String getTrueStr() {
		return trueStr;
	}
	public void setTrueStr(String trueStr) {
		this.trueStr = trueStr;
	}
	public String getClassStr() {
		return classStr;
	}
	public void setClassStr(String classStr) {
		this.classStr = classStr;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	public List<OptionVo> getOptionList() {
		return optionList;
	}
	public void setOptionList(List<OptionVo> optionList) {
		this.optionList = optionList;
	}
	public String getClassId() {
		return classId;
	}
	public void setClassId(String classId) {
		this.classId = classId;
	}
	public String getOptionIds() {
		return optionIds;
	}
	public void setOptionIds(String optionIds) {
		this.optionIds = optionIds;
	}
	public Integer getPassNum() {
		return passNum;
	}
	public void setPassNum(Integer passNum) {
		this.passNum = passNum;
	}
	public Integer getUseNum() {
		return useNum;
	}
	public void setUseNum(Integer useNum) {
		this.useNum = useNum;
	}
	
}
