package cn.com.angke.lres.pojo;
import java.util.Date;

import org.beetl.sql.core.annotatoin.AssignID;
import org.beetl.sql.core.annotatoin.Table;


/* 
* 
* gen by beetlsql 2019-03-07
*/
@Table(name="LRES_LRESOURCE")
public class LresLresource   {
	@AssignID
	private String id ;
	private Integer downloadCount ;
	/*
	1视频2文档3超文本
	*/
	private Integer fileType ;
	private Integer isDelete ;
	private Integer watchCount ;
	private String createId ;
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
	private String tid ;
	/*
	url地址
	*/
	private String url ;
	private Integer levelcode;
	private String photourl;
	private Date createTime ;
	private String showdown;
	private String isNeedstudy;
	
	public LresLresource() {
	}
	
	public String getId(){
		return  id;
	}
	public void setId(String id ){
		this.id = id;
	}
	
	public Integer getDownloadCount(){
		return  downloadCount;
	}
	public void setDownloadCount(Integer downloadCount ){
		this.downloadCount = downloadCount;
	}
	
	/**
	* 1视频2文档3超文本
	*@return 
	*/
	public Integer getFileType(){
		return  fileType;
	}
	/**
	* 1视频2文档3超文本
	*@param  fileType
	*/
	public void setFileType(Integer fileType ){
		this.fileType = fileType;
	}
	
	public Integer getIsDelete(){
		return  isDelete;
	}
	public void setIsDelete(Integer isDelete ){
		this.isDelete = isDelete;
	}
	
	public Integer getWatchCount(){
		return  watchCount;
	}
	public void setWatchCount(Integer watchCount ){
		this.watchCount = watchCount;
	}
	
	public String getCreateId(){
		return  createId;
	}
	public void setCreateId(String createId ){
		this.createId = createId;
	}
	
	/**
	* 资源描述
	*@return 
	*/
	public String getDescription(){
		return  description;
	}
	/**
	* 资源描述
	*@param  description
	*/
	public void setDescription(String description ){
		this.description = description;
	}
	
	/**
	* 超文本内容
	*@return 
	*/
	public String getDhtml(){
		return  dhtml;
	}
	/**
	* 超文本内容
	*@param  dhtml
	*/
	public void setDhtml(String dhtml ){
		this.dhtml = dhtml;
	}
	
	/**
	* 资源名称
	*@return 
	*/
	public String getName(){
		return  name;
	}
	/**
	* 资源名称
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
	* url地址
	*@return 
	*/
	public String getUrl(){
		return  url;
	}
	/**
	* url地址
	*@param  url
	*/
	public void setUrl(String url ){
		this.url = url;
	}
	
	
	public Integer getLevelcode() {
		return levelcode;
	}

	public void setLevelcode(Integer levelcode) {
		this.levelcode = levelcode;
	}

	public Date getCreateTime(){
		return  createTime;
	}
	public void setCreateTime(Date createTime ){
		this.createTime = createTime;
	}

	public String getPhotourl() {
		return photourl;
	}

	public void setPhotourl(String photourl) {
		this.photourl = photourl;
	}

	public String getShowdown() {
		return showdown;
	}

	public void setShowdown(String showdown) {
		this.showdown = showdown;
	}

	public String getIsNeedstudy() {
		return isNeedstudy;
	}

	public void setIsNeedstudy(String isNeedstudy) {
		this.isNeedstudy = isNeedstudy;
	}
	

}
