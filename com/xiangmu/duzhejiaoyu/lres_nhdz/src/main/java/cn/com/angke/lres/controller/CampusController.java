package cn.com.angke.lres.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.service.CampusService;
import cn.com.angke.lres.vo.CampusVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.ResultMessage;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  CampusController   
 * @Description:TODO(校区控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:12:53   
 *     
 */  
@RestController
@RequestMapping("/campus")
@Api(tags = "校区接口")
public class CampusController {
	@Autowired
	CampusService compusService;
	
	@PostMapping("/list")
	public PageVo<CampusVo> list() {
		List<CampusVo> list = compusService.list();
		return new PageVo<CampusVo>(true,list,(long)list.size());
	}
	
	@PostMapping("/add")
	public ResultMessage<String> add(@RequestParam String name) {
		compusService.add(name,2);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/addDefault")
	public ResultMessage<String> add() {
		String name = "默认校区";
		compusService.add(name,1);
		return new ResultMessage<>(true,"");
	}
	
	@PostMapping("/update")
	public ResultMessage<String> update(@RequestParam String id,@RequestParam String name) {
		compusService.update(id,name);
		return new ResultMessage<>(true,"");
		
	}
	
	@PostMapping("/delete")
	public ResultMessage<String> delete(@RequestParam String id) {
		try {
			compusService.delete(id);
		} catch (LresException e) {
			return new ResultMessage<>(false,e.getError_msg());
		}
		return new ResultMessage<>(true,"");		
	}
}
