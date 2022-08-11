package cn.com.angke.mgk.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.utils.DateOpt;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.mgk.dao.OrgsDao;
import cn.com.angke.mgk.service.OrgsService;
import cn.com.angke.utils.ExcelUtil;
import cn.com.angke.utils.Org;

@Service
public class OrgsServiceImpl extends PlatformBaseServiceImpl implements OrgsService {

	@Resource(name = "orgsDaoImpl")
	public OrgsDao orgsDao;

	public PlatformBaseDao getBaseDao() {
		return orgsDao;
	}

	public JSONObject save(JSONObject obj) {
		return orgsDao.save(obj);
	}

	public JSONObject getListByParentId(PageOpt po) {
		return orgsDao.getListByParentId(po);
	}

	@Override
	public JSONArray getList(PageOpt po) {
		// TODO Auto-generated method stub
		return orgsDao.getList(po);
	}

	@Override
	public JSONObject save2() throws Exception {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		FileInputStream in = new FileInputStream(new File("C:/Users/YiT/Desktop/职官年表.xls"));
		Org org = new Org();
		LinkedHashMap<String, String> fieldMap = new LinkedHashMap<>();
		fieldMap.put("上屬机构名称", "PARENTNAME");
		fieldMap.put("机构名称", "NAME");
		List<?> orgList = ExcelUtil.excelToList(in, "Sheet1", org.getClass(), fieldMap, null);
		JSONObject obj = null;
		for (int i = 0; i < orgList.size(); i++) {
			Org o = (Org) orgList.get(i);
			if (StringUtils.isBlank(o.getPARENTNAME())) {
				obj = new JSONObject();
				obj.put("NAME", converter.convert(o.getNAME()));
				PageOpt po = new PageOpt();
				po.setCondition("NAME", converter.convert(o.getNAME()));
				JSONArray js = orgsDao.list(po).getJSONArray("items");
				if (js.size() <= 0) {
					orgsDao.save(obj);
				}
			}
		}
		for (int i = 0; i < orgList.size(); i++) {
			Org o = (Org) orgList.get(i);
			if (StringUtils.isNotBlank(o.getPARENTNAME())) {
				obj = new JSONObject();
				obj.put("NAME", converter.convert(o.getNAME()));
				PageOpt po = new PageOpt();
				po.setCondition("NAME", converter.convert(o.getPARENTNAME()));
				JSONArray js = orgsDao.list(po).getJSONArray("items");
				JSONObject porg = null;
				if (js.size() > 0) {
					porg = js.getJSONObject(0);
					obj.put("PARENTID", porg.getString("ID"));
				}
				PageOpt po2 = new PageOpt();
				po2.setCondition("NAME", converter.convert(o.getNAME()));
				JSONArray js2 = orgsDao.list(po2).getJSONArray("items");
				if (js2.size() <= 0) {
					orgsDao.save(obj);
				}
			}
		}
		return null;
	}

}
