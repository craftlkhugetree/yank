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
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;
import com.spreada.utils.chinese.ZHConverter;

import cn.com.angke.mgk.dao.OrgsDao;
import cn.com.angke.mgk.dao.PostDao;
import cn.com.angke.mgk.service.PostService;
import cn.com.angke.utils.ExcelUtil;
import cn.com.angke.utils.Post;
@Service
public class PostServiceImpl extends PlatformBaseServiceImpl implements PostService {
	
	@Resource(name = "postDaoImpl")
	public PostDao postDao;
	
	@Resource(name = "orgsDaoImpl")
	public OrgsDao orgsDao;
	
	public PlatformBaseDao getBaseDao() {
		return postDao;
	}
	
	public JSONObject getPostListByOrgId(PageOpt po){
		return postDao.getPostListByOrgId(po);
	}

	@Override
	public JSONObject getListBySourcepostId(PageOpt po) {
		return postDao.getListBySourcepostId(po);
	}

	@Override
	public JSONObject save2() throws Exception {
		ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
		FileInputStream in = new FileInputStream(new File("C:/Users/YiT/Desktop/职官年表.xls"));
		Post post = new Post();
		LinkedHashMap<String, String> fieldMap = new LinkedHashMap<>();
		fieldMap.put("官职名称", "NAME");
		fieldMap.put("机构名称", "ORG");
		List<?> orgList = ExcelUtil.excelToList(in, "Sheet1", post.getClass(), fieldMap, null);
		JSONObject obj = null;
		for (int i = 0; i < orgList.size(); i++) {
			Post o = (Post) orgList.get(i);
			if (StringUtils.isNotBlank(o.getORG())) {
				obj = new JSONObject();
				obj.put("NAME", converter.convert(o.getNAME()));
				PageOpt po = new PageOpt();
				po.setCondition("NAME", converter.convert(o.getORG()));
				JSONArray js = orgsDao.list(po).getJSONArray("items");
				if (js.size() > 0) {
					obj.put("ORGID", js.getJSONObject(0).getString("ID"));
				}
				PageOpt po2 = new PageOpt();
				po2.setCondition("NAME", converter.convert(o.getNAME()));
				po2.setCondition("ORGID", js.getJSONObject(0).getString("ID"));
				JSONArray js2 = postDao.list(po2).getJSONArray("items");
				if (js2.size() <= 0) {
					postDao.save(obj);
				}
			}
		}
		return null;
	}
	
	
}
