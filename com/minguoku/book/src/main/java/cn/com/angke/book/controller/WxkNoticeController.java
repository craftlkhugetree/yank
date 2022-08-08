package cn.com.angke.book.controller;
import java.util.List;
import java.util.Map;

import org.beetl.sql.core.engine.PageQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;

import cn.com.angke.book.entity.WxkNotice;
import cn.com.angke.book.service.WxkNoticeService;
import cn.com.angke.common.page.PageDto;
import cn.com.angke.common.result.R;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
/* 
* gen date 2022-08-02
*/
@RestController
@RequestMapping("/wxkNotice")
@Api(tags = "通知公告")
public class WxkNoticeController{
	@Autowired
	WxkNoticeService wxkNoticeService;
	
	@ApiOperation(value="分页查询")
	@PostMapping("/pageQuery")
	public R pageQuery(@RequestBody PageDto dto) {
		PageQuery<JSONObject> pageQuery = wxkNoticeService.pageQuery(dto);
		return R.success(pageQuery.getList(), pageQuery.getTotalRow());
	}
	
	@ApiOperation(value="查询")
	@PostMapping("/list")
	public R list(@RequestBody Map<String,Object> queryMap) {
		List<WxkNotice> list = wxkNoticeService.list(queryMap);
		return R.success(list);
	}
	
}
