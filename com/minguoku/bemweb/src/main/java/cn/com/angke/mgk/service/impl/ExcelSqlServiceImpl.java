package cn.com.angke.mgk.service.impl;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.Collator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.config.service.Config;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.service.ServiceFactory;
import com.somenew.utils.DateOpt;

import cn.com.angke.mgk.dao.ProvinceLocationDao;
import cn.com.angke.mgk.dao.YearDao;
import cn.com.angke.mgk.service.ExcelSqlService;
import cn.com.angke.utils.GovernmentExcel;
import cn.com.angke.utils.JnExcel;
import cn.com.angke.utils.ProvinceLocationExcel;
import cn.com.angke.utils.TzExcel;
import cn.com.angke.utils.ZtfExcel;
import cn.com.angke.utils.excel.ExcelHelper;
import cn.com.angke.utils.excel.XssfExcelHelper;

@Service
public class ExcelSqlServiceImpl extends PlatformBaseServiceImpl implements ExcelSqlService {
	@Autowired
	private YearDao yearDao;
	@Autowired
	private ProvinceLocationDao plDao;
	
	@Override
	public JSONObject ztfExcel(String furl) {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		ExcelHelper eh = XssfExcelHelper.getInstance(new File(UPLOADFILEDIR+furl));
		try {
			String textUrl = UPLOADFILEDIR+DateOpt.getCurrentDatetimeLongStr()+".txt";
			File textFile = new File(textUrl);
			textFile.createNewFile();
			FileWriter write = new FileWriter(textFile);
			List<ZtfExcel> ztfList = eh.readExcel(ZtfExcel.class, 0, true);
			for(int i=0;i<ztfList.size();i++){
				String upSql = " update WXK_ZTTYPE set ZTTHEME = '"+ztfList.get(i).getZtc()+"' where ZTSYMBOL ='"+ztfList.get(i).getLh()+"'; \r\n";
				write.write(upSql);
			}
			write.flush();
			write.close();
			r.put("success", true);
			r.put("message", "成功");
			r.put("url", textUrl);
		} catch (Exception e) {
			r.put("success", false);
			r.put("message", "解析中图法excel失败");
		}
		return r;
	}

	@Override
	public JSONObject jnExcel(String furl) {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		ExcelHelper eh = XssfExcelHelper.getInstance(new File(UPLOADFILEDIR+furl));
		try {
			List<JnExcel> jnList = eh.readExcel(JnExcel.class, 0, true);
			for(int i=0;i<jnList.size();i++){
				if(jnList.get(i).getGYJN() == null || jnList.get(i).getGYJN().equals("")){
					break;
				}else{
					JSONObject obj = jnList.get(i).toJson();
					yearDao.save(obj);
				}
				
			}
			r.put("success", true);
			r.put("message", "成功");
		} catch (Exception e) {
			r.put("success", false);
			r.put("message", "解析纪年法excel失败");
		}
		return r;
	}

	@Override
	public JSONObject sxExcel(String furl) {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		ExcelHelper eh = XssfExcelHelper.getInstance(new File(UPLOADFILEDIR+furl));
		try {
			String fileName = UPLOADFILEDIR+"sxExcel.txt"; 
			File file = new File(fileName);
			file.createNewFile();
			FileWriter write = new FileWriter(file);
			List<ProvinceLocationExcel> sxList = eh.readExcel(ProvinceLocationExcel.class, 0, true);
			System.out.println(sxList.size());
			//遍历列表，先把省全部取出来录入表中，再把县录入
			List<String> provinceList = new ArrayList<String>();
			List<String> provinceIdList = new ArrayList<String>();
			for(int i=0;i<sxList.size();i++){
				ProvinceLocationExcel pl = sxList.get(i);
				if(StringUtils.isBlank(pl.getBELONG())){
					break;
				}
				if(!provinceList.contains(pl.getBELONG())){
					provinceList.add(pl.getBELONG());
				}
			}
			Collections.sort(provinceList, comparator);
			for(int i=0;i<provinceList.size();i++){
				int num = i;
				String formatNum = String.format("%03d", num);
				provinceIdList.add(formatNum);
			}
			
			for(int i=0;i<provinceList.size();i++){
				String provinceName = provinceList.get(i);//省名称
				String provinceId = provinceIdList.get(i);//省ID
				int locNum = 0;
				write.write(getProvinceSql(provinceId, null, provinceName, null, null, null));
				for(int j=0;j<sxList.size();j++){
					ProvinceLocationExcel pl = sxList.get(j);
					if(StringUtils.isBlank(pl.getBELONG())){
						break;
					}
					if(pl.getBELONG().equals(provinceName)){
						String locId = provinceId + String.format("%03d", locNum);
						write.write(getProvinceSql(locId, provinceId, pl.getNAME(), pl.getALIAS(), pl.getPOSITION(), pl.getEVOLUTION()));
						locNum+=1;
					}
				}
			}
			write.write("#结束！");
			write.flush();
			write.close();
			r.put("url", fileName);
			r.put("success", true);
			r.put("message", "成功");
		} catch (Exception e) {
			r.put("success", false);
			r.put("message", "省县excel失败");
		}
		return r;
	}
	
	private Comparator comparator = Collator.getInstance(java.util.Locale.CHINA);
	
	private String getProvinceSql(String ID,String PID,String NAME,String OLDNAME,String LOCATION,String EVOLUTION){
		StringBuffer buff = new StringBuffer();
		buff.append("insert into WXK_PROVINCELOCATION(ID,PID,NAME,OLDNAME,LOCATION,EVOLUTION)values(");
		String[] str = new String[]{ID,PID,NAME,OLDNAME,LOCATION,EVOLUTION};
		for(int i=0;i<str.length;i++){
			if(StringUtils.isBlank(str[i])){
				buff.append("null,");
			}else{
				buff.append("'"+str[i]+"',");
			}
		}
		buff.delete(buff.length()-1, buff.length()).append(");\r\n");
		return buff.toString();
	}
	
	@Override
	public JSONObject tzExcel(String furl) {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		ExcelHelper eh = XssfExcelHelper.getInstance(new File(UPLOADFILEDIR+furl));
		try {
			String textUrl = UPLOADFILEDIR+DateOpt.getCurrentDatetimeLongStr()+".txt";
			File textFile = new File(textUrl);
			textFile.createNewFile();
			FileWriter write = new FileWriter(textFile);
		
			//先写CM_CODEGROUPID,添加统战
			write.write("#CM_CODEGROUP统战\r\n");
			write.write("insert into CM_CODEGROUP(ID,NAME,DESCR) values ('14000','贵州统战','贵州统战的code');\r\n");
			
			List<TzExcel> tzList = eh.readExcel(TzExcel.class, 0, false);
			//民族NATION
			JSONArray nationArr = new JSONArray();
			//国籍COUNTRY
			JSONArray countryArr = new JSONArray();
			//行政级别CITY
			JSONArray cityArr = new JSONArray();
			//全日制学历EDUCATION
			JSONArray educationArr = new JSONArray();
			//全日制学历(单)EDUCATION0
			JSONArray education0Arr = new JSONArray();
			//全日制学位DEGREE
			JSONArray degreeArr = new JSONArray();
			//技术职称SKILL
			JSONArray skillArr = new JSONArray();
			//职业分类CAREER
			JSONArray careerArr = new JSONArray();
			//关系RELATION
			JSONArray relationArr = new JSONArray();
			//会议届数MEETINGPERIOD
			JSONArray meetingPeriodArr = new JSONArray();
			//安排届别MEETINGNUM
			JSONArray meetingNumArr = new JSONArray();
			//其他任职类型TB016 OTHEROFFICETYPE
			JSONArray otherOfficeTypeArr = new JSONArray();
			//其他任职职务TB017 OTHEROFFICEDUTY
			JSONArray otherOfficeDutyArr = new JSONArray();
			//行政级别
			JSONArray administrationArr = new JSONArray();
			//政协
			JSONArray cppcArr = new JSONArray();
			//党派
			JSONArray partyArr = new JSONArray();
			
			for(int i=0;i<tzList.size();i++){
				TzExcel one = tzList.get(i);
				if(StringUtils.isNotBlank(one.getNATION())){
					nationArr.add(one.getNATION());
				}
				if(StringUtils.isNotBlank(one.getCOUNTRY())){
					countryArr.add(one.getCOUNTRY());
				}
				if(StringUtils.isNotBlank(one.getCITY())){
					cityArr.add(one.getCITY());
				}
				if(StringUtils.isNotBlank(one.getEDUCATION())){
					educationArr.add(one.getEDUCATION());
					education0Arr.add(one.getEDUCATION());
				}
				if(StringUtils.isNotBlank(one.getDEGREE())){
					degreeArr.add(one.getDEGREE());
				}
				if(StringUtils.isNotBlank(one.getSKILL())){
					skillArr.add(one.getSKILL());
				}
				if(StringUtils.isNotBlank(one.getCAREER())){
					careerArr.add(one.getCAREER());
				}
				if(StringUtils.isNotBlank(one.getRELATION())){
					relationArr.add(one.getRELATION());
				}
				if(StringUtils.isNotBlank(one.getMEETINGPERIOD())){
					meetingPeriodArr.add(one.getMEETINGPERIOD());
				}
				if(StringUtils.isNotBlank(one.getMEETINGNUM())){
					meetingNumArr.add(one.getMEETINGNUM());
				}
				if(StringUtils.isNotBlank(one.getOTHEROFFICETYPE())){
					otherOfficeTypeArr.add(one.getOTHEROFFICETYPE());
				}
				if(StringUtils.isNotBlank(one.getOTHEROFFICEDUTY())){
					otherOfficeDutyArr.add(one.getOTHEROFFICEDUTY());
				}
				if(StringUtils.isNotBlank(one.getADMINISTRATION())){
					administrationArr.add(one.getADMINISTRATION());
				}
				if(StringUtils.isNotBlank(one.getCPPC())){
					cppcArr.add(one.getCPPC());
				}
				if(StringUtils.isNotBlank(one.getPARTY())){
					partyArr.add(one.getPARTY());
				}
			}
			//普通的处理
			handleNormal(nationArr,"民族sql",write);
			handleNormal(countryArr,"国家sql",write);
			handleNormal(cityArr,"城市sql",write);
			handleNormal(degreeArr,"学位sql",write);
			handleNormal(relationArr,"关系sql",write);
			handleNormal(meetingPeriodArr,"会议届数sql",write);
			handleNormal(meetingNumArr,"会议届别sql",write);
			handleNormal(administrationArr, "行政级别sql", write);
			handleNormal(education0Arr, "学历（单列）", write);
			handleNormal(cppcArr, "政协界别", write);
			handleNormal(partyArr, "#党派sql", write);
			//单列父子
			//handleTree(educationArr, "学历sql", write);
			handleTree(skillArr, "技术职称sql", write);
			handleTree(careerArr, "职业sql", write);
			//双列父子
			handleDoubleTree(otherOfficeTypeArr, otherOfficeDutyArr , "其他任职sql", write);
			
			write.close();
			r.put("success", true);
			r.put("message", "成功");
			r.put("url", textUrl);
		} catch (Exception e) {
			System.out.println(e.toString());
			r.put("success", false);
			r.put("message", "解析中图法excel失败");
		}
		return r;
	}
	
	public void handleNormal(JSONArray arr,String info,FileWriter fw) throws IOException{
		fw.write("#"+info+"\r\n");
		//提取第一行，创建CM_CODE
		String title = arr.getString(0);
		JSONObject codeName = this.getTitleCodeName(title);
		String code = codeName.getString("code");
		String name = codeName.getString("name");
		fw.write("insert into CM_CODE(ID,CODEGROUPID,NAME,CODE,STATE,ISTREE)"
				+ " values ('"+code+"','14000','"+name+"','"+code+"','1','0'); \r\n");
		//开始处理内容
		for(int i=1;i<arr.size();i++){
			String content = arr.getString(i);
			JSONObject conCodeName = this.getContentCodeName(content);
			String conCode = conCodeName.getString("code");
			String conName = conCodeName.getString("name");
			fw.write("insert into CM_CODEV(ID,CODEID,NAME,CODE,STATE,LEVELCODE) "
					+ "values('"+code+"-"+conCode+"','"+code+"','"+conName+"','"+conCode+"','1','"+code+"-"+conCode+"'); \r\n");
		}
		fw.flush();
	}
	public void handleTree(JSONArray arr,String info,FileWriter fw) throws IOException{
		fw.write("#"+info+"\r\n");
		//提取第一行，创建CM_CODE
		String title = arr.getString(0);
		JSONObject codeName = this.getTitleCodeName(title);
		String code = codeName.getString("code");
		String name = codeName.getString("name");
		fw.write("insert into CM_CODE(ID,CODEGROUPID,NAME,CODE,STATE,ISTREE)"
				+ " values ('"+code+"','14000','"+name+"','"+code+"','1','1'); \r\n");
		//开始处理内容
		JSONArray typeArr = new JSONArray();
		JSONArray typeCodeArr = new JSONArray();
		int num = 1;
		for(int i=1;i<arr.size();i++){
			System.out.println(arr.get(i));
			//以"-"分割，前面是分类，后面是具体内容
			JSONObject typeCodeName = this.getTreeTypeCodeName(arr.getString(i));
			String conType = typeCodeName.getString("type");
			String conCode = typeCodeName.getString("code");
			String conName = typeCodeName.getString("name");
			String typeCode = "";
			//如果数组没有分类的话，加进去
			if(!typeArr.contains(conType)){
				typeArr.add(conType);
				typeCode = code+"-"+num;
				typeCodeArr.add(typeCode);
				num+=1;
				fw.write("insert into CM_CODEV(ID,CODEID,NAME,CODE,STATE,LEVELCODE) "
						+ "values('"+typeCode+"','"+code+"','"+conType+"','"+typeCode+"','1','"+typeCode+"'); \r\n");
			}else{
				typeCode = typeCodeArr.getString(typeArr.indexOf(conType));
			}
			String conIdLevel = typeCode+"-"+conCode;
			fw.write("insert into CM_CODEV(ID,CODEID,PID,NAME,CODE,STATE,LEVELCODE) "
					+ "values ('"+conIdLevel+"','"+code+"','"+typeCode+"','"+conName+"','"+conCode+"','1','"+conIdLevel+"'); \r\n");
		}
		fw.flush();
	}
	public void handleDoubleTree(JSONArray father,JSONArray son,String info,FileWriter fw) throws IOException{
		fw.write("#"+info+"\r\n");
		//提取第一行，创建CM_CODE
		String title = father.getString(0);
		JSONObject codeName = this.getTitleCodeName(title);
		String code = codeName.getString("code");
		String name = codeName.getString("name");
		fw.write("insert into CM_CODE(ID,CODEGROUPID,NAME,CODE,STATE,ISTREE)"
				+ " values ('"+code+"','14000','"+name+"','"+code+"','1','1'); \r\n");
		//处理内容
		JSONArray fNameArr = new JSONArray();
		JSONArray fIdArr = new JSONArray();
		for(int i=1;i<father.size();i++){
			System.out.println(father.getString(i));
			JSONObject fNameCode = this.getContentCodeName(father.getString(i));
			String fName = fNameCode.getString("name");
			String fCode = fNameCode.getString("code");
			String fId = code+"-"+fCode;
			fNameArr.add(fName);
			fIdArr.add(fId);
			fw.write("insert into CM_CODEV(ID,CODEID,NAME,CODE,STATE,LEVELCODE) "
					+ "values('"+fId+"','"+code+"','"+fName+"','"+fCode+"','1','"+fId+"'); \r\n");
		}
		System.out.println("fatherName:"+fNameArr);
		System.out.println("fatherId:"+fIdArr);
		for(int i=1;i<son.size();i++){
			System.out.println(son.getString(i));
			JSONObject sTypeNameCode = this.getTreeTypeCodeName(son.getString(i));
			String sType = sTypeNameCode.getString("type");
			String sName = sTypeNameCode.getString("name");
			String sCode = sTypeNameCode.getString("code");
			String fId = fIdArr.getString(fNameArr.indexOf(sType));
			String sId = fId + "-" + sCode;
			fw.write("insert into CM_CODEV(ID,CODEID,PID,NAME,CODE,STATE,LEVELCODE) "
					+ "values ('"+sId+"','"+code+"','"+fId+"','"+sName+"','"+sCode+"','1','"+sId+"'); \r\n");
		}
		fw.flush();
	}
	
	public JSONObject getTitleCodeName(String str){
		JSONObject obj = new JSONObject();
		int num = -1;
		for(int i=0;i<str.length();i++){
			char c = str.charAt(i);
			if((c>=65&&c<=90)||(c>=97&&c<=122)){
				num = i;
				break;
			}
		}
		obj.put("name", str.substring(0, num));
		obj.put("code", str.substring(num));
		return obj;
	}
	public JSONObject getContentCodeName(String str){
		JSONObject obj = new JSONObject();
		obj.put("name", str.substring(0, str.lastIndexOf("(")));
		obj.put("code", str.substring(str.lastIndexOf("(")+1, str.lastIndexOf(")")));
		return obj;
	}
	public JSONObject getTreeTypeCodeName(String str){
		JSONObject obj = new JSONObject();
		obj.put("type", str.substring(0, str.indexOf("-")));
		obj.put("name", str.substring(str.indexOf("-")+1, str.indexOf("(")));
		obj.put("code", str.substring(str.indexOf("(")+1, str.indexOf(")")));
		return obj;
	}
	
	public static void main(String[] args) {
//		JSONObject obj = getTreeTypeCodeName("高等学校教师-教授(011)");
//		System.out.println(obj);
	}

	@Override
	public JSONObject delSql() {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		String fileName = UPLOADFILEDIR+"delSql.txt";
		File file = new File(fileName);
		try {
			file.createNewFile();
			FileWriter write = new FileWriter(file);
			//AU_ROLERES  AU_RES
			String resSql = " select ID,PID from AU_RES where APPID = '101' ";
			List<JSONObject> resList = this.getJdbcTemplate().query(resSql, readRows);
			StringBuffer delRoleResBuff = new StringBuffer();
			delRoleResBuff.append("delete from AU_ROLERES where RESID in(");
			for(int i=0;i<resList.size();i++){
				delRoleResBuff.append("'"+resList.get(i).getString("ID")+"',");
			}
			String delRoleResStr = delRoleResBuff.delete(delRoleResBuff.length()-1, delRoleResBuff.length()).append(");\r\n").toString();
			write.write("#删除ROLERES \r\n");
			write.write(delRoleResStr);
			StringBuffer delSonResBuff = new StringBuffer();
			StringBuffer delFaResBuff = new StringBuffer();
			delSonResBuff.append("delete from AU_RES where PID in(");
			delFaResBuff = new StringBuffer();
			delFaResBuff.append("delete from AU_RES where ID in(");
			for(int i=0;i<resList.size();i++){
				if(StringUtils.isBlank(resList.get(i).getString("PID"))){
					delSonResBuff.append("'"+resList.get(i).getString("ID")+"',");
					delFaResBuff.append("'"+resList.get(i).getString("ID")+"',");
				}
			}
			String delSonResStr = delSonResBuff.delete(delSonResBuff.length()-1, delSonResBuff.length()).append(");").toString();
			String delFaResStr = delFaResBuff.delete(delFaResBuff.length()-1, delFaResBuff.length()).append(");").toString();
			write.write("#删除AU_RES \r\n");
			write.write(delSonResStr+"\r\n");
			write.write(delFaResStr);
			write.flush();
			write.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		r.put("url", fileName);
		r.put("success", true);
		r.put("message", "成功");
		return r;
	}

	public JSONObject jgExcel0(String furl) {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		ExcelHelper eh = XssfExcelHelper.getInstance(new File(UPLOADFILEDIR+furl));
		try {
			List<GovernmentExcel> list = eh.readExcel(GovernmentExcel.class, 0, true);
			String textUrl = UPLOADFILEDIR+DateOpt.getCurrentDatetimeLongStr()+".txt";
			File textFile = new File(textUrl);
			textFile.createNewFile();
			FileWriter write = new FileWriter(textFile);
			JSONArray error = new JSONArray();
			JSONArray errorMsg = new JSONArray();
			//第一层
			JSONObject oneLevel = new JSONObject();
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				if(StringUtils.isNotBlank(ge.getOrg1()) && StringUtils.isBlank(ge.getOrg2()) ){
					oneLevel.put(ge.getOrg1(), ge.getCode());
					String sql = this.getGovernmentInsertSql(ge.getCode(), "", ge.getOrg1(),ge );
					write.write(sql);
				}
			}
			//第二层
			JSONObject twoLevel = new JSONObject();
			int twoNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				if(StringUtils.isNotBlank(ge.getOrg2()) && StringUtils.isBlank(ge.getOrg3()) ){
					if(StringUtils.isBlank(oneLevel.getString(ge.getOrg1()))){
						if(!error.contains(ge.getOrg1())){
							error.add(ge.getOrg1());
							errorMsg.add(ge.getCode()+"--"+ge.getOrg1());
						}
					}else{
						String id = oneLevel.getString(ge.getOrg1())+twoNum;
						twoNum+=1;
						twoLevel.put(ge.getOrg2(), id);
						String sql = this.getGovernmentInsertSql(id, oneLevel.getString(ge.getOrg1()), ge.getOrg2(),ge );
						write.write(sql);
					}
					
					
				}
			}
			//第三层
			JSONObject threeLevel = new JSONObject();
			int threeNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				if(StringUtils.isNotBlank(ge.getOrg3()) && StringUtils.isBlank(ge.getOrg4()) ){
					if(StringUtils.isBlank(twoLevel.getString(ge.getOrg2()))){
						if(!error.contains(ge.getOrg2())){
							error.add(ge.getOrg2());
							errorMsg.add(ge.getCode()+"--"+ge.getOrg1()+"--"+ge.getOrg2());
						}
					}else{
						String id = twoLevel.getString(ge.getOrg2())+threeNum;
						threeNum+=1;
						threeLevel.put(ge.getOrg3(), id);
						String sql = this.getGovernmentInsertSql(id, twoLevel.getString(ge.getOrg2()), ge.getOrg3(),ge );
						write.write(sql);
					}
					
				}
			}
			//第四层
			JSONObject fourLevel = new JSONObject();
			int fourNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				if(StringUtils.isNotBlank(ge.getOrg4()) && StringUtils.isBlank(ge.getOrg5()) ){
					if(StringUtils.isBlank(threeLevel.getString(ge.getOrg3()))){
						if(!error.contains(ge.getOrg3())){
							error.add(ge.getOrg3());
							errorMsg.add(ge.getCode()+"--"+ge.getOrg1()+"--"+ge.getOrg2()+"--"+ge.getOrg3());
						}
					}else{
						String id = threeLevel.getString(ge.getOrg3())+fourNum;
						fourNum+=1;
						fourLevel.put(ge.getOrg4(), id);
						String sql = this.getGovernmentInsertSql(id, threeLevel.getString(ge.getOrg3()), ge.getOrg4(),ge );
						write.write(sql);
					}
					
				}
			}
			//第五层
			int fiveNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				if(StringUtils.isNotBlank(ge.getOrg5())){
					if(StringUtils.isBlank(fourLevel.getString(ge.getOrg4()))){
						if(!error.contains(ge.getOrg4())){
							error.add(ge.getOrg4());
							errorMsg.add(ge.getCode()+"--"+ge.getOrg1()+"--"+ge.getOrg2()+"--"+ge.getOrg3()+"--"+ge.getOrg4());
						}
					}else{
						String id = fourLevel.getString(ge.getOrg4())+fiveNum;
						fiveNum+=1;
						String sql = this.getGovernmentInsertSql(id, fourLevel.getString(ge.getOrg4()), ge.getOrg5(),ge );
						write.write(sql);
					}
					
					
				}
			}
			write.write("#结束！\r\n");
			write.write("错误信息：\r\n");
			for(int i=0;i<errorMsg.size();i++){
				write.write(errorMsg.getString(i)+"\r\n");
			}
			write.write("#错误结束");
			write.flush();
			write.close();
			r.put("url", textUrl);
			r.put("success", true);
			r.put("message", "成功");
		} catch (Exception e) {
			r.put("success", false);
			r.put("message", "政府机构excel失败");
		}
		return r;
	}
	
	@Override
	public JSONObject jgExcel(String furl) {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		ExcelHelper eh = XssfExcelHelper.getInstance(new File(UPLOADFILEDIR+furl));
		try {
			List<GovernmentExcel> list = eh.readExcel(GovernmentExcel.class, 0, true);
			String textUrl = UPLOADFILEDIR+DateOpt.getCurrentDatetimeLongStr()+".txt";
			File textFile = new File(textUrl);
			textFile.createNewFile();
			FileWriter write = new FileWriter(textFile);
			JSONArray error = new JSONArray();
			JSONArray errorMsg = new JSONArray();
			//第一层
			JSONObject oneLevel = new JSONObject();
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				if(StringUtils.isNotBlank(ge.getOrg1()) && StringUtils.isBlank(ge.getOrg2()) ){
					oneLevel.put(ge.getOrg1(), ge.getCode());
					String one_org1 = ge.getOrg1();
					String sql = this.getGovernmentInsertSql(ge.getCode(), "", one_org1,ge );
					write.write("#第" + i + "个顶级 \r\n");
					write.write(sql);
					// 第二层
					int num2 = 0;
					for (int j = 0; j < list.size(); j++) {
						String two_org1 = list.get(j).getOrg1();
						String two_org2 = list.get(j).getOrg2();
						String two_org3 = list.get(j).getOrg3();
						if (StringUtils.isNotBlank(two_org2) && StringUtils.isBlank(two_org3) ) {
							if (one_org1.equals(two_org1)) {
								String two_id = ge.getCode() + "_" + num2;
								String two_sql = this.getGovernmentInsertSql(two_id, ge.getCode(), two_org2, list.get(j));
								write.write(two_sql);
								num2 += 1;
								// 第三层
								int num3 = 0;
								for (int k = 0; k < list.size(); k++) {
									GovernmentExcel three_ge = list.get(k);
									String three_org1 = three_ge.getOrg1();
									String three_org2 = three_ge.getOrg2();
									String three_org3 = three_ge.getOrg3();
									String three_org4 = three_ge.getOrg4();
									if (StringUtils.isNotBlank(three_org3) && StringUtils.isBlank(three_org4)) {
										if (two_org1.equals(three_org1) && two_org2.equals(three_org2)) {
											String three_id = two_id + "_" + num3;
											String three_sql = this.getGovernmentInsertSql(three_id, two_id, three_ge.getOrg3(),three_ge );
											write.write(three_sql);
											num3 += 1;
											// 第四层
											int num4 = 0;
											for (int l = 0; l < list.size(); l++) {
												GovernmentExcel four_ge = list.get(l);
												String four_org1 = four_ge.getOrg1();
												String four_org2 = four_ge.getOrg2();
												String four_org3 = four_ge.getOrg3();
												String four_org4 = four_ge.getOrg4();
												String four_org5 = four_ge.getOrg5();
												if (StringUtils.isNotBlank(four_org4) && StringUtils.isBlank(four_org5)) {
													if (three_org1.equals(four_org1) && three_org2.equals(four_org2) && three_org3.equals(four_org3) ) {
														String four_id = three_id + "_" + num4;
														String four_sql = this.getGovernmentInsertSql(four_id, three_id, four_org4, four_ge );
														write.write(four_sql);
														num4 += 1;
														// 第五层
														int num5 = 0;
														for (int m = 0; m < list.size(); m++) {
															GovernmentExcel five_ge = list.get(m);
															String five_org1 = five_ge.getOrg1();
															String five_org2 = five_ge.getOrg2();
															String five_org3 = five_ge.getOrg3();
															String five_org4 = five_ge.getOrg4();
															String five_org5 = five_ge.getOrg5();
															if (StringUtils.isNotBlank(five_org5)) {
																if (five_org1.equals(four_org1) && five_org2.equals(four_org2) &&
																	five_org3.equals(four_org3) && five_org4.equals(four_org4)) {
																	String five_id = four_id + "_" + num5;
																	String five_sql = this.getGovernmentInsertSql(five_id, four_id, five_org5, five_ge );
																	write.write(five_sql);
																	num5 +=1;
																}
															}
														}
													}
													
												}
											}
											
										}
									}
								}
								
								
							}
						}
						
					}
					
				}
			}
			write.write("#结束！\r\n");
			write.write("错误信息：\r\n");
			for(int i=0;i<errorMsg.size();i++){
				write.write(errorMsg.getString(i)+"\r\n");
			}
			write.write("#错误结束\r\n");
			write.flush();
			write.close();
			r.put("url", textUrl);
			r.put("success", true);
			r.put("message", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			r.put("success", false);
			r.put("message", "政府机构excel失败");
		}
		return r;
	}
	
	public JSONObject jgExcelBak(String furl) {
		JSONObject r = new JSONObject();
		Config config = ServiceFactory.getInstance().getConfig();
		String UPLOADFILEDIR = config.getConfigValue("UPLOADFILEDIR");
		ExcelHelper eh = XssfExcelHelper.getInstance(new File(UPLOADFILEDIR+furl));
		try {
			List<GovernmentExcel> list = eh.readExcel(GovernmentExcel.class, 0, true);
			String textUrl = UPLOADFILEDIR+DateOpt.getCurrentDatetimeLongStr()+".txt";
			File textFile = new File(textUrl);
			textFile.createNewFile();
			FileWriter write = new FileWriter(textFile);
			JSONArray error = new JSONArray();
			JSONArray errorMsg = new JSONArray();
			//第一层
			JSONObject oneLevel = new JSONObject();
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				if(StringUtils.isNotBlank(ge.getOrg1()) && StringUtils.isBlank(ge.getOrg2()) ){
					oneLevel.put(ge.getOrg1(), ge.getCode());
					String sql = this.getGovernmentInsertSql(ge.getCode(), "", ge.getOrg1(),ge );
					write.write(sql);
				}
			}
			//第二层
			JSONObject twoLevel = new JSONObject();
			int twoNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				String fatherFullName = ge.getFatherFullName(2);
				if(StringUtils.isNotBlank(ge.getOrg2()) && StringUtils.isBlank(ge.getOrg3()) ){
					if(StringUtils.isBlank(oneLevel.getString(fatherFullName))){
						if(!error.contains(fatherFullName)){
							error.add(fatherFullName);
							errorMsg.add(ge.getCode()+"--"+ge.getFatherFullName(2));
						}
					}else{
						String id = oneLevel.getString(fatherFullName)+twoNum;
						twoNum+=1;
						twoLevel.put(ge.getFullName(), id);
						String sql = this.getGovernmentInsertSql(id, oneLevel.getString(fatherFullName), ge.getOrg2(),ge );
						write.write(sql);
					}
					
					
				}
			}
			//第三层
			JSONObject threeLevel = new JSONObject();
			int threeNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				String fatherFullName = ge.getFatherFullName(3);
				if(StringUtils.isNotBlank(ge.getOrg3()) && StringUtils.isBlank(ge.getOrg4()) ){
					if(StringUtils.isBlank(twoLevel.getString(fatherFullName))){
						if(!error.contains(fatherFullName)){
							error.add(fatherFullName);
							errorMsg.add(ge.getCode()+"--"+ge.getOrg1()+"--"+ge.getOrg2());
						}
					}else{
						String id = twoLevel.getString(fatherFullName)+threeNum;
						threeNum+=1;
						threeLevel.put(ge.getFullName(), id);
						String sql = this.getGovernmentInsertSql(id, twoLevel.getString(fatherFullName), ge.getOrg3(),ge );
						write.write(sql);
					}
					
				}
			}
			//第四层
			JSONObject fourLevel = new JSONObject();
			int fourNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				String fatherFullName = ge.getFatherFullName(4);
				if(StringUtils.isNotBlank(ge.getOrg4()) && StringUtils.isBlank(ge.getOrg5()) ){
					if(StringUtils.isBlank(threeLevel.getString(fatherFullName))){
						if(!error.contains(ge.getFatherFullName(4))){
							error.add(ge.getFatherFullName(4));
							errorMsg.add(ge.getCode()+"--"+ge.getOrg1()+"--"+ge.getOrg2()+"--"+ge.getOrg3());
						}
					}else{
						String id = threeLevel.getString(ge.getFatherFullName(4))+fourNum;
						fourNum+=1;
						fourLevel.put(ge.getFullName(), id);
						String sql = this.getGovernmentInsertSql(id, threeLevel.getString(ge.getFatherFullName(4)), ge.getOrg4(),ge );
						write.write(sql);
					}
					
				}
			}
			//第五层
			int fiveNum = 0;
			for(int i=0;i<list.size();i++){
				GovernmentExcel ge = list.get(i);
				String fatherFullName = ge.getFatherFullName(5);
				if(StringUtils.isNotBlank(ge.getOrg5())){
					if(StringUtils.isBlank(fourLevel.getString(fatherFullName))){
						if(!error.contains(fatherFullName)){
							error.add(fatherFullName);
							errorMsg.add(ge.getCode()+"--"+ge.getOrg1()+"--"+ge.getOrg2()+"--"+ge.getOrg3()+"--"+ge.getOrg4());
						}
					}else{
						String id = fourLevel.getString(fatherFullName)+fiveNum;
						fiveNum+=1;
						String sql = this.getGovernmentInsertSql(id, fourLevel.getString(fatherFullName), ge.getOrg5(),ge );
						write.write(sql);
					}
				}
			}
			write.write("#结束！\r\n");
			write.write("错误信息：\r\n");
			for(int i=0;i<errorMsg.size();i++){
				write.write(errorMsg.getString(i)+"\r\n");
			}
			write.write("#错误结束");
			write.flush();
			write.close();
			r.put("url", textUrl);
			r.put("success", true);
			r.put("message", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			r.put("success", false);
			r.put("message", "政府机构excel失败");
		}
		return r;
	}
	
	public String getGovernmentInsertSql(String ID,String PID,String NAME,GovernmentExcel ge){
		StringBuffer buff = new StringBuffer();
		buff.append("insert into WXK_GOVERNMENT(ID,PID,CODE,NAME,FULLNAME,SETYEAR,SETTIME,ABOLISHTIME,POWER,GOVERNOR,CHILDORG,ALIAS,MODIFYNAME) values(");
		String[] str = new String[]{ID,PID,ge.getCode(),NAME,ge.getFullName(),ge.getSetYear(),ge.getSetTime().toString(),ge.getAbolishTime().toString(),ge.getPower(),ge.getGovernor(),ge.getChildOrg(),ge.getAlias(),ge.getModifyName()};
		for(int i=0;i<str.length;i++){
			if(StringUtils.isNotBlank(str[i])){
				buff.append("'"+str[i]+"',");
			}else{
				buff.append("null,");
			}
		}
		buff.delete(buff.length()-1, buff.length()).append(");\r\n");
		return buff.toString();
	}
	 
}
