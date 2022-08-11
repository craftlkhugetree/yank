package cn.com.angke.utils;

import com.alibaba.fastjson.JSONObject;

public class JnExcel {
	private String GYJN;//公元纪年
	private String GZJN;//干支纪年
	private String MGJN;//民国纪年
	private String QJN;//清纪年
	private String THJN;//天皇纪年
	private String MZGJN;//满洲国纪年
	public String getGYJN() {
		return GYJN;
	}
	public void setGYJN(String gYJN) {
		GYJN = gYJN;
	}
	public String getGZJN() {
		return GZJN;
	}
	public void setGZJN(String gZJN) {
		GZJN = gZJN;
	}
	public String getMGJN() {
		return MGJN;
	}
	public void setMGJN(String mGJN) {
		MGJN = mGJN;
	}
	public String getQJN() {
		return QJN;
	}
	public void setQJN(String qJN) {
		QJN = qJN;
	}
	public String getTHJN() {
		return THJN;
	}
	public void setTHJN(String tHJN) {
		THJN = tHJN;
	}
	public String getMZGJN() {
		return MZGJN;
	}
	public void setMZGJN(String mZGJN) {
		MZGJN = mZGJN;
	}
	
	public JSONObject toJson(){
		JSONObject oldObj =  (JSONObject) JSONObject.toJSON(this);
		JSONObject newObj = new JSONObject();
		for(String key:oldObj.keySet()){
			newObj.put(key.toUpperCase(), oldObj.getString(key));
		}
		return newObj;
	}
	@Override
	public String toString() {
		return "JnExcel [GYJN=" + GYJN + ", GZJN=" + GZJN + ", MGJN=" + MGJN + ", QJN=" + QJN + ", THJN=" + THJN
				+ ", MZGJN=" + MZGJN + "]";
	}
	
	public static void main(String[] args) {
		JnExcel je = new JnExcel();
		je.setGYJN("1698");
		je.setGZJN("852");
		System.out.println(je.toJson());
	}
}
