package cn.com.angke.lres.vo;

public class QresitemVo {
	private String id ;
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
	试卷ID
	*/
	private String qresId ;
	/*
	关卡ID
	*/
	private String levelId ;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getQuesNum() {
		return quesNum;
	}
	public void setQuesNum(Integer quesNum) {
		this.quesNum = quesNum;
	}
	public Integer getQuesType() {
		return quesType;
	}
	public void setQuesType(Integer quesType) {
		this.quesType = quesType;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	public String getQresId() {
		return qresId;
	}
	public void setQresId(String qresId) {
		this.qresId = qresId;
	}
	public String getLevelId() {
		return levelId;
	}
	public void setLevelId(String levelId) {
		this.levelId = levelId;
	}
	
}
