package cn.com.angke.mgk.dao.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.sql.Types;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.db.DbOpt;
import com.somenew.db.PlatformBaseDaoImpl;
import com.somenew.db.SqlParas;

import cn.com.angke.mgk.dao.CommonDao;
import cn.com.angke.utils.TianDi;

@Service
public class CommonDaoImpl extends PlatformBaseDaoImpl implements CommonDao {

	/**
	 * 查询年代/朝代
	 */
	@Override
	public JSONObject getCodeList(String CODE) {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		if (CODE.equals("YEAR")) { // 年代
			sql.append("select a.* \n").append("from WXK_YEAR a order by a.YLYEAR \n");
			data = this.getJdbcTemplate().query(sql.toString(), null, null, readRows);
		} else if (CODE.equals("DYNASTY")) {// 朝代
			sql.append("select a.* \n").append("from WXK_DYNASTY a \n");
			data = this.getJdbcTemplate().query(sql.toString(), null, null, readRows);
		}
		JSONObject r = new JSONObject();
		r.put("total", data.size());
		JSONArray res = new JSONArray();
		res.addAll(data);
		r.put("items", res);
		return r;
	}

	/**
	 * 查询纪年表
	 */
	@Override
	public JSONObject getYearList(String PID,String FILTER) {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		if (StringUtils.isNotBlank(PID)) {
			sql.append("select ID,NAME,TYPE,PID,CONCAT(REIGNNAME,CONCAT('(',YEAR,')')) as YEAR,REIGNNAME,TGDZ \n")
					.append("from WXK_CALENDAR  where PID=? ");
			sqlParas.addPara(PID, Types.VARCHAR);
			data = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(), readRows);
		} else {
			// 查询第一级
			sql.append("select ID,NAME,TYPE,PID,CONVERT(YEAR,SIGNED) as YEAR \n").append("from WXK_CALENDAR  where TYPE='B' \n");
			if(StringUtils.isNotBlank(FILTER)){
				sql.append("  and YEAR>=? ");
				sqlParas.addPara(FILTER, Types.INTEGER);
			}
			sql.append(" order by YEAR ASC ");
			data = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(), readRows);
		}
		JSONObject r = new JSONObject();
		r.put("total", data.size());
		JSONArray res = new JSONArray();
		res.addAll(data);
		r.put("items", res);
		return r;
	}

	@Override
	public JSONObject getTGDZ(String YEAR) {
		JSONObject r = new JSONObject();
		if (StringUtils.isNotBlank(YEAR)) {
			r.put("TDGZ", TianDi.getTGDZName(Integer.valueOf(YEAR)) + "年");
		}
		JSONObject y=new JSONObject();
		y.put("items", r);
		return y;
	}

	@Override
	public JSONObject getZTTYPE(String LVL, String TYPE) {
		List<JSONObject> data = null;
		StringBuffer sql = new StringBuffer();
		SqlParas sqlParas = new SqlParas();
		if (StringUtils.isNotBlank(LVL)&&StringUtils.isNotBlank(TYPE)) {
			sql.append("select ID,LVL,TYPE,NAME,DES \n")
					.append("from ZTTYPE  where LVL=? ");
			sqlParas.addPara(LVL, Types.VARCHAR);
			sql.append(" and TYPE LIKE ? ");
			sqlParas.addPara("%"+TYPE+"%", Types.VARCHAR);
			data = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(), readRows);
		} else {
			// 查询第一级
			sql.append("select ID,LVL,TYPE,NAME,DES from ZTTYPE  where LVL=1 \n");
			data = this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(), readRows);
		}
		JSONObject r = new JSONObject();
		r.put("total", data.size());
		JSONArray res = new JSONArray();
		res.addAll(data);
		r.put("items", res);
		return r;
	}

	@Override
	public JSONObject Test(String LVL) {
//		SqlParas sqlParas = new SqlParas();
//		String sql ="select ID,ZTSYMBOL FROM ZTTYPE WHERE LVL=?";
//		sqlParas.addPara(LVL, Types.VARCHAR);
//		List<JSONObject> data=this.getJdbcTemplate().query(sql.toString(), sqlParas.getVs(), sqlParas.getTypes(), readRows);
//		for (int i = 0; i < data.size(); i++) {
//			String type= data.get(i).getString("TYPE");
//			String id= data.get(i).getString("ID");
//			int l=Integer.valueOf(LVL)+1;
//			String sql2="update ZTTYPE SET PID="+id+" where id in(SELECT a.ID from (select ID FROM ZTTYPE WHERE LVL="+l+" AND ZTSYMBOL LIKE '%"+type+"%') a)";
//			this.getJdbcTemplate().execute(sql2);
//		}
		dealZT();
		JSONObject j=new JSONObject();
		return j;
	}
	
	public String getCode(int i){
		String code = String.valueOf(i);
		int ilen = code.length();
		return "000".substring(0, 3-ilen).concat(code);
	}
	
//	StringBuffer sql = new StringBuffer();
//	sql.append("select ID,NAME FROM TZ_COMMON");
//	List<JSONObject> data = this.getJdbcTemplate().query(sql.toString(), null, null, readRows);
//	JSONArray res = new JSONArray();
//	res.addAll(data);
//	return res;
	
	public void getZTType(String symbol, String code, int level){
		StringBuffer sql = new StringBuffer();
		sql.append("select CLS_NO,CLS_NAME,LVL,SUBCLS FROM CHILIBCLASS where CLS_NO LIKE '"+symbol+"%' and LVL="+String.valueOf(level)+" order by CLS_NO ");
		List<JSONObject> data = this.getJdbcTemplate().query(sql.toString(), null, null, readRows);
		for (int i=0; i<data.size(); i++){
			JSONObject object = data.get(i);
			String sym = object.getString("CLS_NO");
			String seq = getCode(i+1);
			int lvl = object.getInteger("LVL"); 
			String a=code.concat(seq) + "-"+code+"-"+sym+"-"+object.getString("CLS_NAME")+"\r\n";
			System.out.println(code.concat(seq));
			JSONObject j=new JSONObject();
			j.put("ID", code.concat(seq));
			if(StringUtils.isNotBlank(code)){
				j.put("PID", code);
			}
			j.put("ZTNAME", object.getString("CLS_NAME"));
			j.put("ZTSYMBOL",sym);
			DbOpt.getInstance().insert(null, "WXK_ZTTYPE", j);
//			write2file("D:/test.txt", a, true);
			this.getZTType(sym, code.concat(seq), lvl+1);
		}
		
	}
	
	public void dealZT(){
		this.getZTType("", "", 1);
	}
	
		public static File getFile(String filename){
			return new File(filename);
		}
		
		public static void newDir(String dir){
			File file = new File(dir);
			if (!file.exists()) file.mkdirs();
		}
		
		public static void write2file(File file, String content, boolean isAppend){
			FileOutputStream fos = null;
			OutputStreamWriter osw = null;
			try {
				fos = new FileOutputStream(file, isAppend);
				osw = new OutputStreamWriter(fos, "UTF-8");
				osw.write(content);
				osw.flush();
			} catch (FileNotFoundException fnfe) {
				fnfe.printStackTrace();
			} catch (UnsupportedEncodingException uee) {
				uee.printStackTrace();
			} catch (IOException ie) {
				ie.printStackTrace();
			} finally {
				if (osw != null) {
					try {
						osw.close();
					} catch (IOException e1) {
						e1.printStackTrace();
					}
				}
				if (fos != null) {
					try {
						fos.close();
					} catch (IOException e1) {
						e1.printStackTrace();
					}
				}
			}
		}

		public static void write2file(String filename, String content, boolean isAppend){
			File file = getFile(filename);
			write2file(file, content, isAppend);
		}
		
		public static void write2file(File file, String content){
			write2file(file, content, true);
		}

		public static void write2file(String filename, String content){
			File file = getFile(filename);
			write2file(file, content, true);
		}


}
