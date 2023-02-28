package cn.com.angke.lres.dto;

import java.util.List;

import cn.com.angke.lres.pojo.LresQresitem;
import cn.com.angke.lres.pojo.RQresClass;

/**   
 * @ClassName:  QresourceDto   
 * @Description:TODO(管理端试卷新增数据类)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:19:05   
 *     
 */  
public class QresourceDto {
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
	private String validEnd ;
	/*
	资源有效期
	*/
	private String validStart ;
	private Integer needstudytime ;
	private List<RQresClass> classList;
	private List<LresQresitem> itemList;
	private List<QlevelDto> levelList;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getIsDelete() {
		return isDelete;
	}
	public void setIsDelete(Integer isDelete) {
		this.isDelete = isDelete;
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
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
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
	public String getCreateId() {
		return createId;
	}
	public void setCreateId(String createId) {
		this.createId = createId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTid() {
		return tid;
	}
	public void setTid(String tid) {
		this.tid = tid;
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
	public List<RQresClass> getClassList() {
		return classList;
	}
	public void setClassList(List<RQresClass> classList) {
		this.classList = classList;
	}
	public List<LresQresitem> getItemList() {
		return itemList;
	}
	public void setItemList(List<LresQresitem> itemList) {
		this.itemList = itemList;
	}
	public List<QlevelDto> getLevelList() {
		return levelList;
	}
	public void setLevelList(List<QlevelDto> levelList) {
		this.levelList = levelList;
	}
	public Integer getNeedstudytime() {
		return needstudytime;
	}
	public void setNeedstudytime(Integer needstudytime) {
		this.needstudytime = needstudytime;
	}
	
	
}
