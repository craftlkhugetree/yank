package cn.com.angke.app.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.beetl.sql.core.engine.PageQuery;
import org.springframework.stereotype.Service;

import com.alibaba.excel.EasyExcel;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.ActionHelp;

import cn.com.angke.app.service.BaseService;
import cn.com.angke.app.service.DataAnalysisService;
import cn.com.angke.common.page.PageDto;
import cn.hutool.core.date.DateUtil;

@Service
public class DataAnalysisServiceImpl extends BaseService implements DataAnalysisService {

	@Override
	public PageQuery<JSONObject> searchData(PageDto dto) {
		PageQuery<JSONObject> query = new PageQuery<JSONObject>();
		query.setPageNumber(dto.getPage());
		query.setPageSize(dto.getLimit());
		query.setParas(dto.getFilter());
		if(StringUtils.isNotBlank(dto.getOrderBy())) {
			query.setOrderBy(dto.getOrderBy() + " "+dto.getSort());
		}else {
			query.setOrderBy("DATETIME desc");
		}
		PageQuery<JSONObject> result = sqlManager().pageQuery("DataAnalysis.searchData", JSONObject.class, query);
		return result;
	}

	@Override
	public PageQuery<JSONObject> downloadData(PageDto dto) {
		PageQuery<JSONObject> query = new PageQuery<JSONObject>();
		query.setPageNumber(dto.getPage());
		query.setPageSize(dto.getLimit());
		query.setParas(dto.getFilter());
		if(StringUtils.isNotBlank(dto.getOrderBy())) {
			query.setOrderBy(dto.getOrderBy() + " "+dto.getSort());
		}else {
			query.setOrderBy("DATETIME desc");
		}
		PageQuery<JSONObject> result = sqlManager().pageQuery("DataAnalysis.downloadData", JSONObject.class, query);
		return result;
	}

	@Override
	public PageQuery<JSONObject> readData(PageDto dto) {
		PageQuery<JSONObject> query = new PageQuery<JSONObject>();
		query.setPageNumber(dto.getPage());
		query.setPageSize(dto.getLimit());
		query.setParas(dto.getFilter());
		if(StringUtils.isNotBlank(dto.getOrderBy())) {
			query.setOrderBy(dto.getOrderBy() + " "+dto.getSort());
		}else {
			query.setOrderBy("DATETIME desc");
		}
		PageQuery<JSONObject> result = sqlManager().pageQuery("DataAnalysis.readData", JSONObject.class, query);
		return result;
	}

	@Override
	public void searchDataExcel(PageDto dto) throws Exception{
		String fileName = "检索查询导出.xlsx";
		ActionHelp.setReponseFileName(getRequest(), getResponse(), fileName,true);
		this.getResponse().addHeader("Access-Control-Allow-Origin", "*");
		List<List<String>> header = new ArrayList<List<String>>();
		header.add(Arrays.asList("客户名称"));
		header.add(Arrays.asList("IP"));
		header.add(Arrays.asList("检索关键词"));
		header.add(Arrays.asList("账号"));
		header.add(Arrays.asList("检索时间"));
		List<List<String>> data = new ArrayList<List<String>>();
		List<JSONObject> list= sqlManager().select("DataAnalysis.searchDataExcel", JSONObject.class, dto.getFilter());
		list.stream().forEach(m->{
			String ctmname = m.getString("ctmname");
			String ip = m.getString("ip");
			String keyword = m.getString("keyword");
			String userid = null == m.getString("userid")?"":m.getString("userid");
			String datetime = DateUtil.format(DateUtil.parse(m.getString("datetime")), "yyyy-MM-dd HH:mm:ss");
			List<String> row = new ArrayList<>();
			row.add(ctmname);
			row.add(ip);
			row.add(keyword);
			row.add(userid);
			row.add(datetime);
			data.add(row);
		});
		EasyExcel.write(this.getResponse().getOutputStream()).head(header).sheet("sheet1").doWrite(data);
	}

	@Override
	public void downloadDataExcel(PageDto dto) throws Exception{
		String fileName = "下载查询导出.xlsx";
		ActionHelp.setReponseFileName(getRequest(), getResponse(), fileName,true);
		this.getResponse().addHeader("Access-Control-Allow-Origin", "*");
		List<List<String>> header = new ArrayList<List<String>>();
		header.add(Arrays.asList("客户名称"));
		header.add(Arrays.asList("IP"));
		header.add(Arrays.asList("书名"));
		header.add(Arrays.asList("页码"));
		header.add(Arrays.asList("账号"));
		header.add(Arrays.asList("下载时间"));
		List<List<String>> data = new ArrayList<List<String>>();
		List<JSONObject> list= sqlManager().select("DataAnalysis.downloadDataExcel", JSONObject.class, dto.getFilter());
		list.stream().forEach(m->{
			String ctmname = m.getString("ctmname");
			String ip = m.getString("userip");
			String booktitle = m.getString("booktitle");
			String pagenum = m.getString("pagenum");
			String userid = null == m.getString("userid")?"":m.getString("userid");
			String datetime = m.getString("datetime2");
			List<String> row = new ArrayList<>();
			row.add(ctmname);
			row.add(ip);
			row.add(booktitle);
			row.add(pagenum);
			row.add(userid);
			row.add(datetime);
			data.add(row);
		});
		EasyExcel.write(this.getResponse().getOutputStream()).head(header).sheet("sheet1").doWrite(data);

	}

	@Override
	public void readDataExcel(PageDto dto) throws Exception{
		String fileName = "阅读查询导出.xlsx";
		ActionHelp.setReponseFileName(getRequest(), getResponse(), fileName,true);
		this.getResponse().addHeader("Access-Control-Allow-Origin", "*");
		List<List<String>> header = new ArrayList<List<String>>();
		header.add(Arrays.asList("客户名称"));
		header.add(Arrays.asList("IP"));
		header.add(Arrays.asList("书名"));
		header.add(Arrays.asList("账号"));
		header.add(Arrays.asList("阅读时间"));
		List<List<String>> data = new ArrayList<List<String>>();
		List<JSONObject> list= sqlManager().select("DataAnalysis.readDataExcel", JSONObject.class, dto.getFilter());
		list.stream().forEach(m->{
			String ctmname = m.getString("ctmname");
			String ip = m.getString("ip");
			String booktitle = m.getString("booktitle");
			String userid = null == m.getString("userid")?"":m.getString("userid");
			String datetime = DateUtil.format(DateUtil.parse(m.getString("datetime")), "yyyy-MM-dd HH:mm:ss");
			List<String> row = new ArrayList<>();
			row.add(ctmname);
			row.add(ip);
			row.add(booktitle);
			row.add(userid);
			row.add(datetime);
			data.add(row);
		});
		EasyExcel.write(this.getResponse().getOutputStream()).head(header).sheet("sheet1").doWrite(data);
	}

}
