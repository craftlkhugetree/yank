package cn.com.angke.lres.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alibaba.excel.EasyExcel;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;

import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.DataCollegeService;

@Service
public class DataCollegeServiceImpl extends BaseService implements DataCollegeService {

	@Override
	public List<JSONObject> bottom(String starttime, String endtime) {
		Map<String,String> params = new HashMap<>();
		params.put("starttime", starttime);
		params.put("endtime", endtime);
		List<JSONObject> list = sqlManager().select("dataCollege.bottom",JSONObject.class,params);
		return list;
	}

	@Override
	public void exportBottom(String starttime, String endtime) throws Exception{
		ActionHelp.setReponseFileName(getRequest(), getResponse(), "学院统计.xlsx",true);
		List<List<String>> header = new ArrayList<List<String>>();
		header.add(Arrays.asList(new String[] { "学院" }));
		header.add(Arrays.asList(new String[] { "考试人数" }));
		header.add(Arrays.asList(new String[] { "通过人数" }));
		header.add(Arrays.asList(new String[] { "未通过人数" }));
		header.add(Arrays.asList(new String[] { "通过率" }));
		List<List<String>> data = new ArrayList<List<String>>();
		List<JSONObject> list = this.bottom(starttime, endtime);
		list.stream().forEach(m->{
			data.add(Arrays.asList(new String[] {
					m.getString("dept"),
					m.getString("ksrs"),
					m.getString("tgrs"),
					m.getString("wtgrs"),
					m.getString("tgl")
					}));
		});
		EasyExcel.write(this.getResponse().getOutputStream()).head(header).sheet("sheet1").doWrite(data);

	}

}
