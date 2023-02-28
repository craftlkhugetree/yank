package cn.com.angke.lres.vo;

public class LresourceVo {
	private String id ;
	private Integer downloadCount ;
	/*
	1视频2文档3超文本
	*/
	private Integer fileType ;
	private Integer watchCount ;
	/*
	资源描述
	*/
	private String description ;
	/*
	超文本内容
	*/
	private String dhtml ;
	/*
	资源名称
	*/
	private String name ;
	/*
	url地址
	*/
	private String url ;
	private String photourl ;
	private Long fileSize;
	private String createTime;
	private Integer levelcode;
	private String campusIds;
	private String campusNames;
	private String showdown;
	private String readerTypes;
	private String readerNames;
	private String isNeedstudy;
	
	public String getShowdown() {
		return showdown;
	}
	public void setShowdown(String showdown) {
		this.showdown = showdown;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getDownloadCount() {
		return downloadCount;
	}
	public void setDownloadCount(Integer downloadCount) {
		this.downloadCount = downloadCount;
	}
	public Integer getFileType() {
		return fileType;
	}
	public void setFileType(Integer fileType) {
		this.fileType = fileType;
	}
	public Integer getWatchCount() {
		return watchCount;
	}
	public void setWatchCount(Integer watchCount) {
		this.watchCount = watchCount;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getDhtml() {
		return dhtml;
	}
	public void setDhtml(String dhtml) {
		this.dhtml = dhtml;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public Long getFileSize() {
		return fileSize;
	}
	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}
	public Integer getLevelcode() {
		return levelcode;
	}
	public void setLevelcode(Integer levelcode) {
		this.levelcode = levelcode;
	}
	public String getCampusIds() {
		return campusIds;
	}
	public void setCampusIds(String campusIds) {
		this.campusIds = campusIds;
	}
	public String getCampusNames() {
		return campusNames;
	}
	public void setCampusNames(String campusNames) {
		this.campusNames = campusNames;
	}
	public String getPhotourl() {
		return photourl;
	}
	public void setPhotourl(String photourl) {
		this.photourl = photourl;
	}
	
	public String getReaderTypes() {
		return readerTypes;
	}
	public void setReaderTypes(String readerTypes) {
		this.readerTypes = readerTypes;
	}
	public String getReaderNames() {
		return readerNames;
	}
	public void setReaderNames(String readerNames) {
		this.readerNames = readerNames;
	}
	public String getIsNeedstudy() {
		return isNeedstudy;
	}
	public void setIsNeedstudy(String isNeedstudy) {
		this.isNeedstudy = isNeedstudy;
	}
	
}
