package cn.com.angke.mgk.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.util.LinkedHashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.mgk.dao.OrgsDao;
import cn.com.angke.mgk.dao.PeopleDaos;
import cn.com.angke.mgk.dao.PostDao;
import cn.com.angke.mgk.dao.PostPeopleDao;
import cn.com.angke.mgk.service.PostPeopleService;
import cn.com.angke.utils.ExcelUtil;
import cn.com.angke.utils.PostPeople;

@Service
public class PostPeopleServiceImpl extends PlatformBaseServiceImpl implements PostPeopleService {

	@Resource(name = "postPeopleDaoImpl")
	public PostPeopleDao postPeopleDao;

	@Resource(name = "peopleDaosImpl")
	public PeopleDaos peopleDaos;

	@Resource(name = "postDaoImpl")
	public PostDao postDao;

	@Resource(name = "orgsDaoImpl")
	public OrgsDao orgsDao;

	public PlatformBaseDao getBaseDao() {
		return postPeopleDao;
	}

	public JSONObject getPeopleListByPostid(PageOpt po) {
		return postPeopleDao.getPeopleListByPostid(po);
	}

	@Override
	public JSONObject save2() throws Exception {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		FileInputStream in = new FileInputStream(new File("C:/Users/YiT/Desktop/职官年表.xls"));
		PostPeople pp = new PostPeople();
		LinkedHashMap<String, String> fieldMap = new LinkedHashMap<>();
		fieldMap.put("行政主官姓名", "PEOPLEID");
		fieldMap.put("官职名称", "POSTID");
		fieldMap.put("机构名称", "ORGID");
		fieldMap.put("任职时间", "SETDATE");
		fieldMap.put("任职性质", "SETTYPE");
		fieldMap.put("去职时间", "ENDDATE");
		fieldMap.put("去职性质", "ENDTYPE");
		List<?> orgList = ExcelUtil.excelToList(in, "Sheet1", pp.getClass(), fieldMap, null);
		JSONObject obj = null;
		for (int i = 0; i < orgList.size(); i++) {
			PostPeople o = (PostPeople) orgList.get(i);
			if (StringUtils.isNotBlank(o.getPEOPLEID())) {
				obj = new JSONObject();
				PageOpt po = new PageOpt();
				po.setCondition("NAME", converter.convert(o.getPEOPLEID()));
				JSONArray js = peopleDaos.list(po).getJSONArray("items");
				if (js.size() > 0) {
					obj.put("PEOPLEID", js.getJSONObject(0).getString("ID"));
				}
				PageOpt po2 = new PageOpt();
				po2.setCondition("NAME", converter.convert(o.getORGID()));
				JSONArray js2 = orgsDao.list(po2).getJSONArray("items");
				if (js2.size() > 0) {//
					obj.put("SETORGID", js2.getJSONObject(0).getString("ID"));
					PageOpt po3 = new PageOpt();
					po3.setCondition("NAME", converter.convert(o.getPOSTID()));
					po3.setCondition("ORGID", js2.getJSONObject(0).getString("ID"));
					JSONArray js3 = postDao.list(po3).getJSONArray("items");
					if (js3.size() > 0) {
						obj.put("POSTID", js3.getJSONObject(0).getString("ID"));
					}
				}
				obj.put("SETDATE", o.getSETDATE());
				if (StringUtils.isNotBlank(o.getSETTYPE()))
					obj.put("SETTYPE", converter.convert(o.getSETTYPE()));
				obj.put("ENDDATE", o.getENDDATE());
				if (StringUtils.isNotBlank(o.getENDTYPE()))
					obj.put("ENDTYPE", converter.convert(o.getENDTYPE()));
				if (js.size() > 0) {
					postPeopleDao.save(obj);
				} else {
					obj = new JSONObject();
					obj.put("SETORGID", converter.convert(o.getORGID()));
					obj.put("POSTID", converter.convert(o.getPOSTID()));
					obj.put("PEOPLEID", converter.convert(o.getPEOPLEID()));
					obj.put("SETDATE", o.getSETDATE());
					if (StringUtils.isNotBlank(o.getSETTYPE()))
						obj.put("SETTYPE", converter.convert(o.getSETTYPE()));
					obj.put("ENDDATE", o.getENDDATE());
					if (StringUtils.isNotBlank(o.getENDTYPE()))
						obj.put("ENDTYPE", converter.convert(o.getENDTYPE()));
					System.out.println(converter.convert(o.getPEOPLEID()));
					DbOpt.getInstance().insert(null, "WXK_POSTPEOPLE2", obj);
				}
			}
		}
		return null;
	}

	@Override
	public JSONObject save3() throws Exception {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		String sql = "select * from WXK_POSTPEOPLE2";
		List<JSONObject> data = this.getJdbcTemplate().query(sql.toString(), null, null, readRows);
		JSONObject obj = null;
		for (int i = 0; i < data.size(); i++) {
			JSONObject o = data.get(i);
			if (StringUtils.isNotBlank(o.getString("PEOPLEID"))) {
				obj = new JSONObject();
				PageOpt po = new PageOpt();
				po.setCondition("NAME", o.getString("PEOPLEID"));
				JSONArray js = peopleDaos.list(po).getJSONArray("items");
				if (js.size() > 0) {
					obj.put("PEOPLEID", js.getJSONObject(0).getString("ID"));
				} else {
					JSONObject people = new JSONObject();
					people.put("LASTNAME", converter.convert(o.getString("PEOPLEID")));
					peopleDaos.save(people);
					obj.put("PEOPLEID", people.getString("ID"));
				}
				PageOpt po2 = new PageOpt();
				po2.setCondition("NAME", o.getString("SETORGID"));
				JSONArray js2 = orgsDao.list(po2).getJSONArray("items");
				if (js2.size() > 0) {//
					obj.put("SETORGID", js2.getJSONObject(0).getString("ID"));
					PageOpt po3 = new PageOpt();
					po3.setCondition("NAME", o.getString("POSTID"));
					po3.setCondition("ORGID", js2.getJSONObject(0).getString("ID"));
					JSONArray js3 = postDao.list(po3).getJSONArray("items");
					if (js3.size() > 0) {
						obj.put("POSTID", js3.getJSONObject(0).getString("ID"));
					}
				}
				obj.put("SETDATE", o.getString("SETDATE"));
				if (StringUtils.isNotBlank(o.getString("SETTYPE")))
					obj.put("SETTYPE", o.getString("SETTYPE"));
				obj.put("ENDDATE", o.getString("ENDDATE"));
				if (StringUtils.isNotBlank(o.getString("ENDTYPE")))
					obj.put("ENDTYPE", o.getString("ENDTYPE"));
				postPeopleDao.save(obj);
			}

		}
		return null;
	}

}
