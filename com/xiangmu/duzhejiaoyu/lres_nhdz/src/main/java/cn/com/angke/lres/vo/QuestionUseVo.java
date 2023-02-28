package cn.com.angke.lres.vo;

import java.util.List;

public class QuestionUseVo {
	private String id ;
	private String classId ;
	/*
	1单选 2多选 3判断
	*/
	private Integer quesType ;
	/*
	附件URL
	*/
	private String fileUrl ;
	/*
	题目内容
	*/
	private String quesTitle ;
	private String optionIds;
	private String optionStr;
	private Integer score;
	private List<OptionVo> optionList;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
}
