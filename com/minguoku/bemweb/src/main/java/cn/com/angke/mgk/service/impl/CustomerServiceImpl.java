package cn.com.angke.mgk.service.impl;

import java.sql.Types;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.SqlParas;
import com.somenew.exception.BusException;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.CtmIpDao;
import cn.com.angke.mgk.dao.CustomerDao;
import cn.com.angke.mgk.dao.ModifireConcatDao;
import cn.com.angke.mgk.service.CustomerService;

@Service
public class CustomerServiceImpl extends PlatformBaseServiceImpl implements CustomerService {

	@Resource(name = "customerDaoImpl")
	protected CustomerDao customerDao;

	@Resource(name = "ctmIpDaoImpl")
	private CtmIpDao ctmIpDao;
	
	@Resource(name = "modifireConcatDaoImpl")
	private ModifireConcatDao modifireConcatDao;

	@Override
	public void delCTM(JSONArray IDs) {
		// 删除客户IP地址库
		if (IDs != null && IDs.size() > 0) {
			for (int i = 0; i < IDs.size(); i++) {
				PageOpt po = new PageOpt();
				po.setCondition("CTMID", IDs.getString(i));
				JSONArray arr = ctmIpDao.list(po).getJSONArray("items");
				JSONArray OLDID = new JSONArray();
				if (arr != null && arr.size() > 0) {
					for (int j = 0; j < arr.size(); j++) {
						JSONObject old = arr.getJSONObject(j);
						OLDID.add(old.getString("ID"));
					}
					ctmIpDao.delete(OLDID);
				}
			}
		}
		customerDao.delete(IDs);
	}

	@Override
	public JSONObject saveIp(JSONObject obj) {
		String id = obj.getString("ID");
		String beginIp = obj.getString("BEGINIP");
		String endIp = obj.getString("ENDIP");
		StringBuffer sql=new StringBuffer();
		sql.append("select * from WXK_CTMIP where 1 =1 ");
		if (StringUtils.isNotBlank(id)) {
			sql.append(" AND ID != '" + id + "' ");
		}
		
		sql.append(" AND ((INET_ATON('" + beginIp + "') BETWEEN INET_ATON(BEGINIP) AND INET_ATON(ENDIP)) or (INET_ATON('" + endIp + "' ) BETWEEN INET_ATON(BEGINIP) AND INET_ATON(ENDIP)))");
		//sql.append(" AND (('" + beginIp + "' <= BEGINIP AND '" + endIp + "' >= BEGINIP) OR ('" + endIp + "' >= ENDIP AND '" + beginIp + "' <= ENDIP)) OR ('" + beginIp + "' >= BEGINIP AND '"+ endIp +"' <= ENDIP) ");
		String dosql = sql.toString();
		System.out.println(dosql);
		List<JSONObject> data = this.getJdbcTemplate().query(dosql, readRows);
		if(data!=null&&data.size()>0){
			throw new BusException("ip区间重复，请重新填写！");
		}
		ctmIpDao.save(obj);
		return obj;
	}

	@Override
	public JSONObject modifireConcat(JSONObject obj) {
		modifireConcatDao.save(obj);
		return obj;
	}

}
