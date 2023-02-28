package cn.com.angke.lres.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.dto.LresourceDto;
import cn.com.angke.lres.pojo.LresLresource;
import cn.com.angke.lres.pojo.RUserLearn;
import cn.com.angke.lres.service.LresourceService;
import cn.com.angke.lres.vo.LresourceVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.ResultMessage;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  LresourceController   
 * @Description:TODO(学习资源（视频，文档，在线文章）控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:13:24   
 *     
 */  
@RestController
@RequestMapping("/lresource")
@Api(tags = "学习资源（视频，文档，在线文章）接口")
public class LresourceController {
	@Autowired
	LresourceService lresourceService;
	
	@PostMapping("/list")
	public PageVo<LresourceVo> list(HttpServletRequest request) {
		PageOpt2 pageDto = PageOpt2.produceFromLayUI(request);
		PageVo<LresourceVo> pageVo = lresourceService.pageList(pageDto);
		return pageVo;
	}
	
	@PostMapping("/listAll")
	public PageVo<LresLresource> listAll(@RequestParam String campusId,@RequestParam String readerType) {
		List<LresLresource> list = lresourceService.list(campusId,readerType);
		return new PageVo<LresLresource>(true,list,(long)list.size());
	}
	
	@PostMapping("/find")
	public ResultMessage<JSONObject> find(@RequestParam String id) {
		JSONObject vo = lresourceService.findById(id);
		return new ResultMessage<JSONObject>(true,vo);		
	}
	
	@PostMapping("/findByName")
	public PageVo<LresourceVo> findByName(@RequestParam String name) {
		PageVo<LresourceVo> pageVo = lresourceService.findByName(name);
		return pageVo;		
	}
	
	@PostMapping("/findOneByName")
	public ResultMessage<LresourceVo> findOneByName(@RequestParam String name,@RequestParam String fileType) {
		LresourceVo vo = lresourceService.findOneByName(name,fileType);
		return new ResultMessage<LresourceVo>(true,vo);			
	}
	
	@PostMapping("/add")
	public ResultMessage<String> add(@RequestBody LresourceDto dto) {
		lresourceService.add(dto);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/update")
	public ResultMessage<String> update(@RequestBody LresourceDto dto) {
		lresourceService.update(dto);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/changeLevelcode")
	public ResultMessage<String> changeLevelcode(@RequestParam Integer levelcode,@RequestParam String id) {
		lresourceService.changeLevelcode(levelcode, id);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/watchCount")
	public ResultMessage<String> watchCount(@RequestParam String resId) {
		lresourceService.saveWatchCount(resId);
		return new ResultMessage<>(true,"");
	}
	
	@PostMapping("/downloadCount")
	public ResultMessage<String> downloadCount(@RequestParam String resId) {
		lresourceService.saveDownloadCount(resId);
		return new ResultMessage<>(true,"");
	}
	
	@PostMapping("/delete")
	public ResultMessage<String> delete(@RequestParam String id) {
		lresourceService.delete(id);
		return new ResultMessage<>(true,"");		
	}
	
	@PostMapping("/saveStudyed")
	public ResultMessage<String> saveStudyed(@RequestParam String id) {
		lresourceService.saveStudyed(id);
		return new ResultMessage<>(true,"");		
	}
	
	@PostMapping("/userStudyed")
	public PageVo<RUserLearn> userStudyed() {
		List<RUserLearn> list = lresourceService.userStudyed();
		return new PageVo<>(true,list,(long)list.size());		
	}
}
