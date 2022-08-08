package cn.com.angke.book.service.impl;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.cache.DataCacheOpt;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.book.dao.GovernmentDao;
import cn.com.angke.book.service.GovernmentService;
import cn.com.angke.util.ListToTree;

@Service
public class GovernmentServiceImpl extends PlatformBaseServiceImpl implements GovernmentService {

	@Autowired
	protected GovernmentDao governmentDao;

	@Override
	public JSONObject list(PageOpt po) {
		return governmentDao.list(po);
	}
	
	private static Lock lock_government = new ReentrantLock();
	
	private static final String KEY_CACHE_GOVERNMENT_TREE = "cache_government_tree";
	
	@Override
	public JSONObject tree() {
		String treeStr = DataCacheOpt.get(KEY_CACHE_GOVERNMENT_TREE);
		JSONArray tree = null;
		if (StringUtils.isBlank(treeStr)) {
			lock_government.lock();
			try {
				treeStr = DataCacheOpt.get(KEY_CACHE_GOVERNMENT_TREE);
				if (StringUtils.isBlank(treeStr)) {
					JSONArray arr = governmentDao.simpleList();
					tree = ListToTree.SimpleToList(arr, "ID", "PID", "children");
					DataCacheOpt.setex(KEY_CACHE_GOVERNMENT_TREE, 4 * 3600 , tree.toJSONString());
				} else {
					tree = JSONArray.parseArray(treeStr);
				}
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				lock_government.unlock();
			}
		} else {
			tree = JSONArray.parseArray(treeStr);
		}
		JSONObject r = new JSONObject();
		r.put("tree", tree);
		return r;
	}

	@Override
	public JSONObject view(String iD) {
		return governmentDao.viewById(iD);
	}
}
