package cn.com.angke.lres.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.utils.StringOpt;

import cn.com.angke.api.Reader;
import cn.com.angke.lres.pojo.LresReadertype;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.ReaderTypeService;

@Service
public class ReaderTypeServiceImpl extends BaseService implements ReaderTypeService{
	@Override
	public List<LresReadertype> list() {
		List<LresReadertype> list = sqlManager().query(LresReadertype.class).select();
		return list;
	}

	@Override
	@Transactional
	public void syncReaderType() {
		List<LresReadertype> list = new ArrayList<>();
		JSONArray datas = Reader.usertype();
		if(null != datas) {
			for(Object data : datas) {
				JSONObject json = (JSONObject) data;
				LresReadertype type = new LresReadertype();
				type.setId(StringOpt.produceUUID());
				type.setReadtype(json.getString("usertypeCode"));
				type.setReadname(json.getString("usertypeName"));
				type.setIsconfig("0");
				list.add(type);
			}
			sqlManager().query(LresReadertype.class).andEq("ISCONFIG", "0").delete();
			sqlManager().insertBatch(LresReadertype.class, list);
		}
		
	}

}
