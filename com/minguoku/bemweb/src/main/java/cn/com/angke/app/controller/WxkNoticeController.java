package cn.com.angke.app.controller;
import java.util.List;
import java.util.Map;

import org.beetl.sql.core.engine.PageQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import cn.com.angke.app.entity.WxkNotice;
import cn.com.angke.common.page.PageDto;
import cn.com.angke.app.service.WxkNoticeService;
import cn.com.angke.common.result.R;
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
	public R pageQuery(@RequestParam String data) {
		PageDto dto = JSONObject.parseObject(data, PageDto.class);
		PageQuery<JSONObject> pageQuery = wxkNoticeService.pageQuery(dto);
		return R.success(pageQuery.getList(), pageQuery.getTotalRow());
	}
	
	@ApiOperation(value="查询")
	@PostMapping("/list")
	public R list(@RequestBody Map<String,Object> queryMap) {
		List<WxkNotice> list = wxkNoticeService.list(queryMap);
		return R.success(list);
	}
	
	@ApiOperation(value="保存")
	@PostMapping("/save")
	public R save(@RequestBody WxkNotice dto) {
		wxkNoticeService.save(dto);
		return R.success();
	}
	
	@ApiOperation(value="根据ID查询")
	@GetMapping("/find/{id}")
	public R find(@PathVariable Long id) {
		JSONObject item = wxkNoticeService.find(id);
		return R.success(item);
	}
	
	@GetMapping("/delete/{id}")
	@ApiOperation(value="根据ID删除")
	public R delete(@PathVariable Long id) {
		wxkNoticeService.delete(id);
		return R.success();
	}

}
