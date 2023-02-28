package cn.com.angke.lres.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.somenew.utils.StringOpt;

import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.pojo.LresCampus;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.CampusService;
import cn.com.angke.lres.vo.CampusVo;

@Service
public class CampusServiceImpl extends BaseService implements CampusService{

	@Override
	public List<CampusVo> list() {
		String sqlId = "lresCampus.queryList";
		LresCampus params = new LresCampus();
		this.fillParamTID(params);
		return sqlManager().select(sqlId, CampusVo.class, params);
	}

	@Override
	public void add(String name,Integer type) {
		LresCampus obj = new LresCampus();
		obj.setType(type);
		obj.setName(name);
		this.fillParamTID(obj);
		if(type.intValue() == 1) {
			List<LresCampus> resObjs = sqlManager().select("lresCampus.queryByType", LresCampus.class, obj);
			if(null != resObjs && resObjs.size() > 0) {
				return;
			}
		}
		obj.setId(StringOpt.produceUUID());
		this.fillBasePro(obj);
		sqlManager().insert(obj);
	}

	@Override
	public void delete(String id) throws LresException{
		LresCampus obj = new LresCampus();
		obj.setId(id);
		LresCampus queryObj = sqlManager().single(LresCampus.class, id);
		if(queryObj.getType().intValue() == 1) {
			throw new LresException("10001","不能删除系统生成的默认校区！");
		}else {
			obj.setIsDelete(0);
			sqlManager().updateTemplateById(obj);
		}
	}

	@Override
	public void update(String id, String name) {
		LresCampus obj = new LresCampus();
		obj.setId(id);
		obj.setName(name);
		sqlManager().updateTemplateById(obj);
	}

}
