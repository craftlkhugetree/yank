package cn.com.angke.app.service.impl;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.beetl.sql.core.engine.PageQuery;
import org.beetl.sql.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;

import cn.com.angke.common.page.PageDto;
import cn.com.angke.utils.UserUtil;
import cn.com.angke.app.entity.WxkNotice;
import cn.com.angke.app.service.BaseService;
import cn.com.angke.app.service.WxkNoticeService;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Assert;

/* 
* gen date 2022-08-02
*/
@Service
public class WxkNoticeServiceImpl extends BaseService implements WxkNoticeService{
	@Override
	@Transactional
	public void save(WxkNotice dto) {
		String nowtime = DateUtil.format(new Date(), "yyyyMMddHHmmss");
		if(dto.getIsDialog() == 1) {
			List<WxkNotice> olds = sqlManager().lambdaQuery(WxkNotice.class)
					.andEq(WxkNotice::getIsDialog, 1).select();
			olds.stream().forEach(m->m.setIsDialog(0));
			sqlManager().updateBatchTemplateById(WxkNotice.class, olds);
		}
		if(dto.getIsRelease() == 1) {
			dto.setReleaseTime(nowtime);
		}
		if(null != dto.getId()) {
			sqlManager().updateTemplateById(dto);
		}else {
			dto.setCreateId(UserUtil.id());
			dto.setCreateName(UserUtil.name());
			dto.setCreateTime(DateUtil.format(new Date(), "yyyyMMddHHmmss"));
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
			query.andGreatEq("release_time", queryMap.get("starttime"));
		}
		if(null != queryMap.get("endtime")) {
			query.andLessEq("release_time", queryMap.get("endtime"));
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
