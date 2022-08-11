package cn.com.angke.utils;

import com.alibaba.fastjson.JSONObject;

public class BookNew {
	private String ZTTYPEID;//中图法分类号
	private String ZTCC;//主题词串
	private String CODE;//南图（扫描编号）
	private String TITLE;//正题名
	private String BLTITLE;//并列正题名
	private String OTITLE;//其他题名说明
	private String FTITLE;//分辑题名
	private String ZAUTHOR;//主要负责人
	private String CAUTHOR;//次要负责人
	private String BB;//版本项
	private String PAID;//出版发行地
	private String PUBLISHINGID;//出版发行者
	private String DATE;//出版发行时间
	private String JHX;//稽核项
	private String PAGECOUNT;//页数
	private String PAGE;//原始页数
	private String SERIES;//丛编题名
	private String CONTENTNOTE;//一般性附注
	private String SUMMARY;//文摘提要
	private String COVERTITLE;//封面题名
	private String EDUTYPEID;//学科分类代码
	private String XKMCZT;//学科分类名称
	private String ZAUTHOR1;//主要责任者（个人名称）
	private String CAUTHOR1;//次要责任者（个人名称）
	private String ZAUTHOR2;//主要负责人（团体名称）
	private String CAUTHOR2;//次要负责人（团队名称）

	public String getZTTYPEID() {
		return ZTTYPEID;
	}

	public void setZTTYPEID(String zTTYPEID) {
		ZTTYPEID = zTTYPEID;
	}

	public String getZTCC() {
		return ZTCC;
	}

	public void setZTCC(String zTCC) {
		ZTCC = zTCC;
	}

	public String getCODE() {
		return CODE;
	}

	public void setCODE(String cODE) {
		CODE = cODE;
	}

	public String getTITLE() {
		return TITLE;
	}

	public void setTITLE(String tITLE) {
		TITLE = tITLE;
	}

	public String getBLTITLE() {
		return BLTITLE;
	}

	public void setBLTITLE(String bLTITLE) {
		BLTITLE = bLTITLE;
	}

	public String getOTITLE() {
		return OTITLE;
	}

	public void setOTITLE(String oTITLE) {
		OTITLE = oTITLE;
	}

	public String getFTITLE() {
		return FTITLE;
	}

	public void setFTITLE(String fTITLE) {
		FTITLE = fTITLE;
	}

	public String getZAUTHOR() {
		return ZAUTHOR;
	}

	public void setZAUTHOR(String zAUTHOR) {
		ZAUTHOR = zAUTHOR;
	}

	public String getCAUTHOR() {
		return CAUTHOR;
	}

	public void setCAUTHOR(String cAUTHOR) {
		CAUTHOR = cAUTHOR;
	}

	public String getBB() {
		return BB;
	}

	public void setBB(String bB) {
		BB = bB;
	}

	public String getPAID() {
		return PAID;
	}

	public void setPAID(String pAID) {
		PAID = pAID;
	}

	public String getPUBLISHINGID() {
		return PUBLISHINGID;
	}

	public void setPUBLISHINGID(String pUBLISHINGID) {
		PUBLISHINGID = pUBLISHINGID;
	}

	public String getDATE() {
		return DATE;
	}

	public void setDATE(String dATE) {
		DATE = dATE;
	}

	public String getJHX() {
		return JHX;
	}

	public void setJHX(String jHX) {
		JHX = jHX;
	}

	public String getSERIES() {
		return SERIES;
	}

	public void setSERIES(String sERIES) {
		SERIES = sERIES;
	}

	public String getCONTENTNOTE() {
		return CONTENTNOTE;
	}

	public void setCONTENTNOTE(String cONTENTNOTE) {
		CONTENTNOTE = cONTENTNOTE;
	}

	public String getSUMMARY() {
		return SUMMARY;
	}

	public void setSUMMARY(String sUMMARY) {
		SUMMARY = sUMMARY;
	}

	public String getCOVERTITLE() {
		return COVERTITLE;
	}

	public void setCOVERTITLE(String cOVERTITLE) {
		COVERTITLE = cOVERTITLE;
	}

	public String getEDUTYPEID() {
		return EDUTYPEID;
	}

	public void setEDUTYPEID(String eDUTYPEID) {
		EDUTYPEID = eDUTYPEID;
	}

	public String getXKMCZT() {
		return XKMCZT;
	}

	public void setXKMCZT(String xKMCZT) {
		XKMCZT = xKMCZT;
	}

	public String getZAUTHOR1() {
		return ZAUTHOR1;
	}

	public void setZAUTHOR1(String zAUTHOR1) {
		ZAUTHOR1 = zAUTHOR1;
	}

	public String getCAUTHOR1() {
		return CAUTHOR1;
	}

	public void setCAUTHOR1(String cAUTHOR1) {
		CAUTHOR1 = cAUTHOR1;
	}

	public String getZAUTHOR2() {
		return ZAUTHOR2;
	}

	public void setZAUTHOR2(String zAUTHOR2) {
		ZAUTHOR2 = zAUTHOR2;
	}

	public String getCAUTHOR2() {
		return CAUTHOR2;
	}

	public String getPAGECOUNT() {
		return PAGECOUNT;
	}

	public void setPAGECOUNT(String pAGECOUNT) {
		PAGECOUNT = pAGECOUNT;
	}

	public String getPAGE() {
		return PAGE;
	}

	public void setPAGE(String pAGE) {
		PAGE = pAGE;
	}

	public void setCAUTHOR2(String cAUTHOR2) {
		CAUTHOR2 = cAUTHOR2;
	}

	public JSONObject toJson(){
		JSONObject obj = (JSONObject) JSONObject.toJSON(this);
		JSONObject newObj = new JSONObject();
		//会有首字母大写的问题
		for(String key:obj.keySet()){
			newObj.put(key.toUpperCase(), obj.getString(key));
		}
		return newObj;
	}
	
	public static void main(String[] args) {
		BookNew bookNew = new BookNew();
		bookNew.setBB("222");
		bookNew.setBLTITLE("hello");
		System.out.println(bookNew.toJson());
	}
}
