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
import cn.com.angke.lres.service.DataGradeService;

@Service
public class DataGradeServiceImpl extends BaseService implements DataGradeService {

	@Override
	public List<JSONObject> bottom(String starttime, String endtime) {
		Map<String,String> params = new HashMap<>();
		params.put("starttime", starttime);
		params.put("endtime", endtime);
		List<JSONObject> list = sqlManager().select("dataGrade.bottom",JSONObject.class,params);
		return list;
	}

	@Override
	public void exportBottom(String starttime, String endtime) throws Exception{
		ActionHelp.setReponseFileName(getRequest(), getResponse(), "年级统计.xlsx",true);
		List<List<String>> header = new ArrayList<List<String>>();
		header.add(Arrays.asList(new String[] { "年级" }));
		header.add(Arrays.asList(new String[] { "考试人数" }));
		header.add(Arrays.asList(new String[] { "通过人数" }));
		header.add(Arrays.asList(new String[] { "未通过人数" }));
		header.add(Arrays.asList(new String[] { "通过率" }));
		List<List<String>> data = new ArrayList<List<String>>();
		List<JSONObject> list = this.bottom(starttime, endtime);
		list.stream().forEach(m->{
			data.add(Arrays.asList(new String[] {
					m.getString("grade"),
					m.getString("ksrs"),
					m.getString("tgrs"),
					m.getString("wtgrs"),
					m.getString("tgl")
					}));
		});
		EasyExcel.write(this.getResponse().getOutputStream()).head(header).sheet("sheet1").doWrite(data);

	}

}
