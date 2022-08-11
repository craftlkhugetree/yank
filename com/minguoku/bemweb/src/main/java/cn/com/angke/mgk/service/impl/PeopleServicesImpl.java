package cn.com.angke.mgk.service.impl;

import java.io.File;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.ids.client.LoginUser;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.utils.DateOpt;
import com.somenew.utils.StringOpt;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.mgk.dao.OtherNameDao;
import cn.com.angke.mgk.dao.PeopleDaos;
import cn.com.angke.mgk.dao.PeopleDynastyDao;
import cn.com.angke.mgk.dao.PeopleRelDao;
import cn.com.angke.mgk.dao.RelationShipDao;
import cn.com.angke.mgk.service.FileService;
import cn.com.angke.mgk.service.PeopleServices;
import cn.com.angke.utils.People;
import cn.com.angke.utils.excel.ExcelHelper;
import cn.com.angke.utils.excel.XssfExcelHelper;

@Service
public class PeopleServicesImpl extends PlatformBaseServiceImpl implements PeopleServices {

	@Resource(name = "peopleDaosImpl")
	public PeopleDaos peopleDaos;

	@Resource(name = "peopleDynastyDaoImpl")
	public PeopleDynastyDao peopleDynastyDao;

	@Resource(name = "otherNameDaoImpl")
	public OtherNameDao otherNameDao;

	@Resource(name = "peopleRelDaoImpl")
	public PeopleRelDao peopleRelDao;

	@Resource(name = "fileServiceImpl")
	public FileService fileService;

	@Resource(name = "relationShipDaoImpl")
	public RelationShipDao relationShipDao;

	/**
	 * 级联保存与更新
	 * 
	 * @param obj
	 *            页面传入对象
	 * @param arr
	 *            页面传入数组
	 * @param array
	 *            页面传入数组
	 */
	public void saveRes(JSONObject obj, JSONArray arr, JSONArray array) {
		if (StringUtils.isBlank(obj.getString("ID"))) {
			// 先保存人物
			obj.put("ID", StringOpt.produceUUID());
			obj.put("STATUS", "1");
			obj.put("CREATER", LoginUser.getUserID());
			obj.put("CREATEDATE", DateOpt.datetimeToStr(new Date()));
			peopleDaos.save(obj);
			// 根据PEOPLEID单独保存人物别名、字号、道号等
			if (arr != null & arr.size() > 0) {
				for (Object object : arr) {
					if (StringUtils.isBlank(JSONObject.parseObject(object.toString()).getString("ID"))) {
						JSONObject ob = JSONObject.parseObject(object.toString());
						ob.put("PEOPLEID", obj.getString("ID"));
						otherNameDao.save(ob);
					}
				}
			}
			// 保存人物关系表
			if (array != null && array.size() > 0) {
				for (Object object : array) {
					if (StringUtils.isBlank(JSONObject.parseObject(object.toString()).getString("ID"))) {
						JSONObject ob = JSONObject.parseObject(object.toString());
						ob.put("PEOPLE1ID", obj.getString("ID"));
						peopleRelDao.save(ob);

						// JSONObject j = new JSONObject();
						// j.put("PEOPLE1ID", ob.getString("PEOPLE2ID"));
						// j.put("PEOPLE2ID", obj.getString("ID"));
						// PageOpt pos = new PageOpt();
						//
						// pos.setCondition("RID", ob.getString("RELTYPE"));
						// pos.setCondition("MSEX", obj.getString("SEX"));
						//
						// JSONArray js = (JSONArray)
						// relationShipDao.list(pos).get("items");
						// for (int i = 0; i < js.size(); i++) {
						// JSONArray con = pos.getConditions();
						// for (int k = 0; k < con.size(); k++) {
						// if(con.getJSONObject(0).get("value").equals((js.getJSONObject(i).get("RID")))&
						// con.getJSONObject(1).get("value").equals(js.getJSONObject(i).get("MSEX"))){
						// j.put("RELTYPE", js.getJSONObject(i).get("MID"));
						// }
						// }
						// }
						// peopleRelDao.save(j);
					}
				}
			}
		} // 更新
		else if (StringUtils.isNotBlank(obj.getString("ID"))) {
			// 先更新人物表
			obj.put("MODIFIER", LoginUser.getUserID());
			obj.put("MODIFYDATE", DateOpt.datetimeToStr(new Date()));
			DbOpt.getInstance().updateByKey(null, "WXK_PEOPLE", obj, null);
			PageOpt po = new PageOpt();
			po.setCondition("PEOPLE1ID", obj.getString("ID"));// 取出选中人物ID并放进对应人物的PEOPLE1ID中
			JSONArray jsa = peopleRelDao.list(po).getJSONArray("items");
			JSONArray OLDID = new JSONArray();
			if (arr != null && jsa.size() > 0) {
				for (int i = 0; i < jsa.size(); i++) {
					JSONObject old = jsa.getJSONObject(i);
					OLDID.add(old.getString("ID"));

					// 在刪除选中的人物关系之前先把该人物的对应人物关系删除
					// PageOpt p = new PageOpt();
					// p.setCondition("PEOPLE1ID",
					// old.getString("PEOPLE2ID"));//取出人物关系ID值即PEOPLE2ID并放进该对应人物ID中即PEOPLE1ID中
					// JSONArray ja =
					// peopleRelDao.list(p).getJSONArray("items");//根据该PEOPLE1ID查询对应人物的关系所有数据
					// JSONArray OLID = new JSONArray();
					// if (ja != null && ja.size() > 0) {
					// for (int k = 0; k < ja.size(); k++) {
					// JSONObject od = ja.getJSONObject(k);
					// OLID.add(od.getString("PEOPLE2ID"));
					// }
					// for (int n = 0; n < OLID.size(); n++) {
					// if(old.getString("PEOPLE1ID").equals(OLID.get(n))){
					// JSONArray IDS = new JSONArray();
					// IDS.add(OLID.get(n));
					// DbOpt.getInstance().delByFieldValues(null,
					// "WXK_PEOPLEREL", "PEOPLE2ID",(String[]) (String[])
					// IDS.toArray(new String[0]));//删除
					// }
					// }
					// //peopleRelDao.delete(OLID);
					// }
				}
				peopleRelDao.delete(OLDID);// 删除人物关系数据
			}
			// 更新人物关系表
			if (array != null && array.size() > 0) {
				for (Object object : array) {
					JSONObject obs = JSONObject.parseObject(object.toString());
					if (StringUtils.isBlank(obs.getString("PEOPLE1ID"))) {
						obs.put("PEOPLE1ID", obj.getString("ID"));
						peopleRelDao.save(obs);// 保存；

						// JSONObject j = new JSONObject();
						// j.put("PEOPLE1ID", obs.getString("PEOPLE2ID"));
						// j.put("PEOPLE2ID", obj.getString("ID"));
						// PageOpt pos = new PageOpt();
						// pos.setCondition("RID", obs.getString("RELTYPE"));
						// pos.setCondition("MSEX", obj.getString("SEX"));
						//
						// //删除原有数据后保存对应人物中的对应关系
						// JSONArray js = (JSONArray)
						// relationShipDao.list(pos).get("items");
						// for (int i = 0; i < js.size(); i++) {
						// JSONArray con = pos.getConditions();
						// for (int k = 0; k < con.size(); k++) {
						// if(con.getJSONObject(0).get("value").equals(js.getJSONObject(i).get("RID"))
						// &
						// con.getJSONObject(1).get("value").equals(js.getJSONObject(i).get("MSEX"))){
						// j.put("RELTYPE", js.getJSONObject(i).get("MID"));
						// }
						// }
						// }
						// peopleRelDao.save(j);
					}
				}
			}

			// 先把数据删除
			PageOpt po2 = new PageOpt();
			po2.setCondition("PEOPLEID", obj.getString("ID"));
			JSONArray jsarr = otherNameDao.list(po2).getJSONArray("items");
			JSONArray OTDID = new JSONArray();
			if (arr != null && jsarr.size() > 0) {
				for (int i = 0; i < jsarr.size(); i++) {
					JSONObject old = jsarr.getJSONObject(i);
					OTDID.add(old.getString("ID"));
				}
				otherNameDao.delete(OTDID);
			}
			// 删除原有数据后保存
			if (arr != null & arr.size() > 0) {
				for (Object object : arr) {
					JSONObject ob = JSONObject.parseObject(object.toString());
					// ob.put("PEOPLEID", obj.getString("ID"));
					if (StringUtils.isBlank(ob.getString("PEOPLEID"))) {
						ob.put("PEOPLEID", obj.getString("ID"));
						otherNameDao.save(ob);
					}
				}
			}
		}
	}

	/**
	 * 逻辑删除
	 * 
	 * @param ID
	 *            传入ID
	 */
	public void deleteRes(JSONArray ID) {
		if (ID != null && ID.size() > 0) {
			String[] byValues = (String[]) (String[]) ID.toArray(new String[0]);
			StringBuffer sql = new StringBuffer();
			sql.append("update WXK_PEOPLE set  STATUS=0 ").append(" where ID in (");
			for (int i = 0; i < byValues.length; ++i) {
				sql.append("'" + byValues[i] + "',");
			}
			sql.delete(sql.length() - 1, sql.length());
			sql.append(")");
			DbOpt.getInstance().getJdbcTemplate().update(sql.toString());
		}
	}

	/**
	 * 获取人物列表
	 */
	@Override
	public JSONObject getPeopleList(PageOpt po) {
		return peopleDaos.getPeopleList(po);
	}

	@Override
	public void saveRes() throws Exception {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		String filepath = "C:\\Users\\YiT\\Desktop\\刘艳修改后民国人物大辞典.xlsx";
		File file = new File(filepath);
		if (filepath.endsWith(".xlsx")) {
			ExcelHelper eh = XssfExcelHelper.getInstance(file);
			List<People> peoplelist = eh.readExcel(People.class, 0, true);
			for (People people : peoplelist) {
				JSONObject p = new JSONObject();
				if (StringUtils.isNotBlank(people.getLASTNAME())) {
					p.put("LASTNAME", converter.convert(people.getLASTNAME()));
				} else {
					people.setLASTNAME("");
				}
				if (StringUtils.isNotBlank(people.getFIRSTNAME())) {
					p.put("FIRSTNAME", converter.convert(people.getFIRSTNAME()));
				} else {
					people.setFIRSTNAME("");
				}
				if (StringUtils.isNotBlank(people.getSH())) {
					p.put("YH", converter.convert(people.getSH()));
				}
				if (StringUtils.isNotBlank(people.getFH())) {
					p.put("FH", converter.convert(people.getFH()));
				}
				if (StringUtils.isNotBlank(people.getDH())) {
					p.put("DH", converter.convert(people.getDH()));
				}
				if (StringUtils.isNotBlank(people.getFORIGNNAME())) {
					p.put("FORIGNNAME", converter.convert(people.getFORIGNNAME()));
				}
				if (StringUtils.isNotBlank(people.getSEX()))
					p.put("SEX", converter.convert(people.getSEX()));
				if (StringUtils.isNotBlank(people.getJG()))
					p.put("JG", converter.convert(people.getJG()));
				if (StringUtils.isNotBlank(people.getBIRTHDAY()))
					p.put("BIRTHDAY", converter.convert(people.getBIRTHDAY()));
				if (StringUtils.isNotBlank(people.getBIRTHDAY2()))
					p.put("BIRTHDAY2", converter.convert(people.getBIRTHDAY2()));
				if (StringUtils.isNotBlank(people.getDEADDAY()))
					p.put("DEADDAY", converter.convert(people.getDEADDAY()));
				if (StringUtils.isNotBlank(people.getDEADDAY2()))
					p.put("DEADDAY2", converter.convert(people.getDEADDAY2()));
				if (StringUtils.isNotBlank(people.getMAINBOOK()))
					p.put("MAINBOOK", converter.convert(people.getMAINBOOK()));
				p.put("STATUS", "1");
				p.put("CREATEDATE", DateOpt.datetimeToStr(new Date()));
				PageOpt po = new PageOpt();
				po.setCondition("NAME", converter.convert(people.getLASTNAME().concat(people.getFIRSTNAME())));
				JSONArray js = peopleDaos.list(po).getJSONArray("items");
				if (js.size() > 0) {
					p.put("ID", js.getJSONObject(0).getString("ID"));
				}
				peopleDaos.save(p);// 保存人物信息
				// 保存人物其他名称信息
				// 先把原有数据删除
				PageOpt po2 = new PageOpt();
				po2.setCondition("PEOPLEID", p.getString("ID"));
				JSONArray jsarr = otherNameDao.list(po2).getJSONArray("items");
				JSONArray OTDID = new JSONArray();
				for (int i = 0; i < jsarr.size(); i++) {
					JSONObject old = jsarr.getJSONObject(i);
					OTDID.add(old.getString("ID"));
				}
				otherNameDao.delete(OTDID);
				// 保存字
				if (StringUtils.isNotBlank(people.getZ())) {
					String[] name = people.getZ().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "字");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存号
				if (StringUtils.isNotBlank(people.getH())) {
					String[] name = people.getH().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "号");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存别名
				if (StringUtils.isNotBlank(people.getBM())) {
					String[] name = people.getBM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "别名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存笔名
				if (StringUtils.isNotBlank(people.getBNAME())) {
					String[] name = people.getBNAME().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "笔名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存曾用名
				if (StringUtils.isNotBlank(people.getOLDNAME())) {
					String[] name = people.getOLDNAME().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "曾用名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存隐名
				if (StringUtils.isNotBlank(people.getYM())) {
					String[] name = people.getYM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "隐名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存佛名
				if (StringUtils.isNotBlank(people.getFM())) {
					String[] name = people.getFM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "佛名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存俗名
				if (StringUtils.isNotBlank(people.getSM())) {
					String[] name = people.getSM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "俗名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存辈名
				if (StringUtils.isNotBlank(people.getBEIM())) {
					String[] name = people.getBEIM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "辈名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存闺名
				if (StringUtils.isNotBlank(people.getGM())) {
					String[] name = people.getGM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "闺名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存汉名
				if (StringUtils.isNotBlank(people.getHM())) {
					String[] name = people.getHM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "汉名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存戏名
				if (StringUtils.isNotBlank(people.getXM())) {
					String[] name = people.getXM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "戏名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存圣名
				if (StringUtils.isNotBlank(people.getSHENGM())) {
					String[] name = people.getSHENGM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "圣名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存堂名
				if (StringUtils.isNotBlank(people.getTM())) {
					String[] name = people.getTM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "堂名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存族名
				if (StringUtils.isNotBlank(people.getZM())) {
					String[] name = people.getZM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "族名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存排名
				if (StringUtils.isNotBlank(people.getPM())) {
					String[] name = people.getPM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "排名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存化名
				if (StringUtils.isNotBlank(people.getHUAM())) {
					String[] name = people.getHUAM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "化名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存幼名
				if (StringUtils.isNotBlank(people.getYOUM())) {
					String[] name = people.getYOUM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "幼名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存教名
				if (StringUtils.isNotBlank(people.getJM())) {
					String[] name = people.getJM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "教名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存法名
				if (StringUtils.isNotBlank(people.getFAM())) {
					String[] name = people.getFAM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "法名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存经名
				if (StringUtils.isNotBlank(people.getJINGM())) {
					String[] name = people.getJINGM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "经名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存学名
				if (StringUtils.isNotBlank(people.getXUEM())) {
					String[] name = people.getXUEM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "学名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存乳名
				if (StringUtils.isNotBlank(people.getRM())) {
					String[] name = people.getRM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "乳名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存室名
				if (StringUtils.isNotBlank(people.getSHIM())) {
					String[] name = people.getSHIM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "室名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存谱名
				if (StringUtils.isNotBlank(people.getPUM())) {
					String[] name = people.getPUM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "谱名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存艺名
				if (StringUtils.isNotBlank(people.getYIM())) {
					String[] name = people.getYIM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "艺名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存齐名
				if (StringUtils.isNotBlank(people.getQM())) {
					String[] name = people.getQM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "齐名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存俄文名
				if (StringUtils.isNotBlank(people.getEWM())) {
					String[] name = people.getEWM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "俄文名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存少数民族名
				if (StringUtils.isNotBlank(people.getMZM())) {
					String[] name = people.getMZM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "少数民族名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存别号
				if (StringUtils.isNotBlank(people.getBIEH())) {
					String[] name = people.getBIEH().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "别号");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存别字
				if (StringUtils.isNotBlank(people.getBIEZ())) {
					String[] name = people.getBIEZ().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "别字");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存署名
				if (StringUtils.isNotBlank(people.getSHUM())) {
					String[] name = people.getSHUM().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "署名");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				// 保存别属
				if (StringUtils.isNotBlank(people.getBS())) {
					String[] name = people.getBS().split("，");
					for (int i = 0; i < name.length; i++) {
						JSONObject z = new JSONObject();
						z.put("NAME", converter.convert(name[i]));
						z.put("NTYPE", "别属");
						z.put("PEOPLEID", p.getString("ID"));
						otherNameDao.save(z);
					}
				}
				
				// 人物关系
				PageOpt po3 = new PageOpt();
				po3.setCondition("PEOPLE1ID", p.getString("ID"));// 取出选中人物ID并放进对应人物的PEOPLE1ID中
				JSONArray jsa = peopleRelDao.list(po3).getJSONArray("items");
				JSONArray OLDID = new JSONArray();
				for (int i = 0; i < jsa.size(); i++) {
					JSONObject old = jsa.getJSONObject(i);
					OLDID.add(old.getString("ID"));
				}
				peopleRelDao.delete(OLDID);// 删除人物关系数据
				if (StringUtils.isNotBlank(people.getREL())) {
					String[] name = people.getREL().split("\\\\");
					for (int i = 0; i < name.length; i++) {
						String[] a = name[i].split("：");
						System.out.println(a.length);
						System.out.println(a[0]);
						JSONObject re = new JSONObject();
						re.put("RELTYPE", converter.convert(a[0]));
						re.put("PEOPLE2ID", converter.convert(a[1]));
						re.put("PEOPLE1ID", p.getString("ID"));
						peopleRelDao.save(re);
					}
				}
			}
		}
	}

}
