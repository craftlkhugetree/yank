package cn.com.angke.lres.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.com.angke.lres.service.QuestclassService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QuestionClassVo;
import cn.com.angke.lres.vo.ResultMessage;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  QusetclassController   
 * @Description:TODO(题库分类控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:15:33   
 *     
 */  
@RestController
@RequestMapping("/qusetclass")
@Api(tags = "题库接口")
public class QusetclassController {
	@Autowired
	QuestclassService questclassService;
	
	@PostMapping("/list")
	public PageVo<QuestionClassVo> list() {
		List<QuestionClassVo> list = questclassService.list();
		return new PageVo<QuestionClassVo>(true,list,(long) list.size());
		
	}
	
	@PostMapping("/add")
	public ResultMessage<String> add(@RequestParam String name) {
		questclassService.add(name);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/update")
	public ResultMessage<String> add(@RequestParam String id,@RequestParam String name) {
		questclassService.update(id,name);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/delete")
	public ResultMessage<String> delete(@RequestParam String id) {
		questclassService.delete(id);
		return new ResultMessage<>(true,"");		
	}
}
