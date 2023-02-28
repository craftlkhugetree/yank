package cn.com.angke.lres.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.beetl.sql.core.engine.PageQuery;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.DataAnalysisService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.util.UserUtil;
@Service
public class DataAnalysisServiceImpl extends BaseService implements DataAnalysisService {

	@Override
	public PageVo<JSONObject> questionData(PageOpt2 pageDto) {
		PageQuery<JSONObject> pageQuery = new PageQuery<JSONObject>();
		JSONArray arrays = pageDto.getConditions();
		Map<Object,Object> paras = new HashMap<Object,Object>();
		paras.put("tid", UserUtil.getTid());
		if(null!=arrays && !arrays.isEmpty()) {
			arrays.stream().forEach(m->{
				JSONObject json = (JSONObject) m;
				paras.put(json.get("property"), json.get("value"));
			});
		}
		Integer pageNum = pageDto.getStart()/pageDto.getPageSize()+1;
		if(null != paras.get("orderBy") && null != paras.get("sort")) {
			String orderBy = paras.get("orderBy")+" "+paras.get("sort");
			pageQuery.setOrderBy(orderBy);
		}
		pageQuery.setPageNumber(pageNum < 0?1:pageNum);
		pageQuery.setPageSize(pageDto.getPageSize()<1?10:pageDto.getPageSize());
		pageQuery.setParas(paras);
		PageQuery<JSONObject> result = sqlManager().pageQuery("dataAna.questionDataAnaPageList", JSONObject.class, pageQuery);
		PageVo<JSONObject> pageVo = new PageVo<JSONObject>(true,result.getList(),result.getTotalRow());
		return pageVo;
	}

	@Override
	public List<List<String>> exportQuestionExcel() {
		Map<String,String> params = new HashMap<>();
		params.put("tid", UserUtil.getTid());
		List<JSONObject> jsonObjs = sqlManager().select("dataAna.questionDataAnaExcel", JSONObject.class,params);
		List<List<String>> rowData = new ArrayList<>();
		jsonObjs.stream().forEach(m->{
			String bt = m.get("bt")+"%";
			rowData.add(Arrays.asList(new String[] {m.getString("quesTitle"),m.get("useNum").toString(),m.get("passNum").toString(),m.get("errorNum").toString(),bt}));
		});
		return rowData;
	}

}
