package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.GeographyDao;
import cn.com.angke.mgk.dao.PeopleDaos;
import cn.com.angke.mgk.service.GeographyService;

@Service
public class GeographyServiceImpl extends PlatformBaseServiceImpl implements GeographyService {

	@Resource(name = "geographyDaoImpl")
	protected GeographyDao geographyDao;
	
	@Resource(name = "peopleDaosImpl")
	protected PeopleDaos peopleDaos;

	/**
	 * 删除地理库
	 */
	@Override
	public void del(JSONArray IDs) {
		for (int i = 0; i < IDs.size(); i++) {
			// 清除人物库地理信息
			PageOpt lc = new PageOpt();
			lc.setCondition("JG",IDs.getString(i));
			JSONArray arr = peopleDaos.list(lc).getJSONArray("items");
			JSONArray OLDID = new JSONArray();
			if (arr != null && arr.size() > 0) {
				for (int j = 0; j < arr.size(); j++) {
					JSONObject old = arr.getJSONObject(j);
					OLDID.add(old.getString("ID"));
				}
				if(OLDID.size()>0){
					JSONObject data = new JSONObject();
					 data.put("ID", OLDID.getString(i));
					 data.put("JG", null);
					 DbOpt.getInstance().updateByFields(null, "WXK_PEOPLE",
					 data, new String[] { "ID" }, null);
				}
			}
		}
		geographyDao.delete(IDs);
		
	}
	
}
