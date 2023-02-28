package cn.com.angke.lres.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.beetl.sql.core.engine.PageQuery;
import org.springframework.stereotype.Service;

import com.alibaba.excel.EasyExcel;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;

import cn.com.angke.lres.dto.PageDto;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.DataDeptService;

@Service
public class DataDeptServiceImpl extends BaseService implements DataDeptService {

	@Override
	public List<JSONObject> top(String starttime,String endtime,String grade) {
		Map<String,String> params = new HashMap<>();
		params.put("starttime", starttime);
		params.put("endtime", endtime);
		params.put("grade", grade);
		List<JSONObject> list = sqlManager().select("dataDept.top",JSONObject.class,params);
		return list;
	}

	@Override
	public PageQuery<JSONObject> bottom(PageDto dto) {
		PageQuery<JSONObject> query = new PageQuery<JSONObject>();
		query.setPageNumber(dto.getPage());
		query.setPageSize(dto.getLimit());
		Map<String,String> filter = dto.getFilter();
		query.setParas(filter);
		if(StringUtils.isNotBlank(dto.getOrderBy())) {
			query.setOrderBy(dto.getOrderBy() + " "+dto.getSort());
		}
		PageQuery<JSONObject> result = sqlManager().pageQuery("dataDept.bottom", JSONObject.class, query);
		return result;
	}

	@Override
	public void exportBottom(String starttime, String endtime, String grade) throws Exception{
		ActionHelp.setReponseFileName(getRequest(), getResponse(), "考试统计.xlsx",true);
		Map<String,String> params = new HashMap<>();
		params.put("starttime", starttime);
		params.put("endtime", endtime);
		params.put("grade", grade);
		List<List<String>> header = new ArrayList<List<String>>();
		header.add(Arrays.asList(new String[] { "年级" }));
		header.add(Arrays.asList(new String[] { "班级" }));
		header.add(Arrays.asList(new String[] { "总人数" }));
		header.add(Arrays.asList(new String[] { "考试人数" }));
		header.add(Arrays.asList(new String[] { "通过人数" }));
		header.add(Arrays.asList(new String[] { "未通过人数" }));
		header.add(Arrays.asList(new String[] { "通过率" }));
		List<List<String>> data = new ArrayList<List<String>>();
		List<JSONObject> list = sqlManager().select("dataDept.bottomExport",JSONObject.class,params);
		list.stream().forEach(m->{
			data.add(Arrays.asList(new String[] {
					m.getString("grade"),
					m.getString("dept"),
					m.getString("zrs"),
					m.getString("ksrs"),
					m.getString("tgrs"),
					m.getString("wtgrs"),
					m.getString("tgl")
					}));
		});
		EasyExcel.write(this.getResponse().getOutputStream()).head(header).sheet("sheet1").doWrite(data);

	}

}
