package cn.com.angke.lres.vo;

import java.util.List;

public class QlevelVo {
	private String id ;
	private Integer levelNum ;
	private Integer needTime ;
	private Integer passScore ;
	private Integer score ;
	private String classId ;
	/*
	试卷ID
	*/
	private String qresId ;
	private List<QuestionUseVo> questList;
	private List<QresitemVo> itemList;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getLevelNum() {
		return levelNum;
	}
	public void setLevelNum(Integer levelNum) {
		this.levelNum = levelNum;
	}
	public Integer getNeedTime() {
		return needTime;
	}
	public void setNeedTime(Integer needTime) {
		this.needTime = needTime;
	}
	public String getQresId() {
		return qresId;
	}
	public void setQresId(String qresId) {
		this.qresId = qresId;
	}
	public List<QuestionUseVo> getQuestList() {
		return questList;
	}
	public void setQuestList(List<QuestionUseVo> questList) {
		this.questList = questList;
	}
	public String getClassId() {
		return classId;
	}
	public void setClassId(String classId) {
		this.classId = classId;
	}
	public Integer getPassScore() {
		return passScore;
	}
	public void setPassScore(Integer passScore) {
		this.passScore = passScore;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	public List<QresitemVo> getItemList() {
		return itemList;
	}
	public void setItemList(List<QresitemVo> itemList) {
		this.itemList = itemList;
	}
	
}
