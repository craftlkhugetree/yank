package cn.com.angke.book.service.impl;
import java.util.List;
import java.util.Map;
import org.beetl.sql.core.engine.PageQuery;
import org.beetl.sql.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;

import cn.com.angke.common.page.PageDto;
import cn.com.angke.book.entity.WxkNotice;
import cn.com.angke.book.service.BaseService;
import cn.com.angke.book.service.WxkNoticeService;
import cn.hutool.core.lang.Assert;

/* 
* gen date 2022-08-02
*/
@Service
public class WxkNoticeServiceImpl extends BaseService implements WxkNoticeService{
	@Override
	@Transactional
	public void save(WxkNotice dto) {
		if(null != dto.getId()) {
			sqlManager().updateTemplateById(dto);
		}else {
			sqlManager().insertTemplate(dto,true);
		}

	}
	
	@Override
	public PageQuery<JSONObject> pageQuery(PageDto dto) {
		PageQuery<JSONObject> query = new PageQuery<JSONObject>();
		query.setPageNumber(dto.getPage());
		query.setPageSize(dto.getLimit());
		query.setParas(dto.getFilter());
		if(StringUtils.isNotBlank(dto.getOrderBy())) {
			query.setOrderBy(dto.getOrderBy() + " "+dto.getSort());
		}else {
			query.setOrderBy("is_top desc,release_time desc");
		}
		PageQuery<JSONObject> result = sqlManager().pageQuery("WxkNotice.pageQuery", JSONObject.class, query);
		return result;
	}
	
	@Override
	public List<WxkNotice> list(Map<String, Object> queryMap) {
		Query<WxkNotice> query = sqlManager().query(WxkNotice.class);
		if(null != queryMap.get("name")) {
			query.andLike("name", "%"+queryMap.get("name")+"%");
		}
		if(null != queryMap.get("starttime")) {
			query.andGreatEq("create_time", queryMap.get("starttime"));
		}
		if(null != queryMap.get("endtime")) {
			query.andLessEq("create_time", queryMap.get("endtime"));
		}
		query.orderBy("is_top desc,release_time desc");
		return query.select();
	}
	
	@Override
	@Transactional
	public void delete(Long id) {
		sqlManager().query(WxkNotice.class).andEq("id", id).delete();
	}
	
	@Override
	public JSONObject find(Long id) {
		WxkNotice item = sqlManager().query(WxkNotice.class).andEq("id",id).single();
		Assert.notNull(item);
		JSONObject result = (JSONObject) JSONObject.toJSON(item);
		return result;
	}

}
