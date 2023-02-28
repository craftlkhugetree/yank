package cn.com.angke.lres.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.com.angke.lres.pojo.LresQrecord;
import cn.com.angke.lres.service.QrecordService;
import cn.com.angke.lres.vo.ResultMessage;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  QrecordController   
 * @Description:TODO(考试记录控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:13:44   
 *     
 */  
@RestController
@RequestMapping("/qrecord")
@Api(tags = "考试记录接口")
public class QrecordController {
	@Autowired
	QrecordService qrecordService;
//	
//	@PostMapping("/add")
//	public ResultMessage<String> add(@RequestParam String data) {
//		ObjectMapper mapper = new ObjectMapper();
//		LresQrecord dto = null;
//		try {
//			dto = mapper.readValue(data, LresQrecord.class);
//		} catch (Exception e) {
//			e.getMessage();
//		} 
//		qrecordService.saveQrecord(dto);
//		return new ResultMessage<>(true,"");
//		
//	}
	
	@PostMapping("/findQrecord")
	public ResultMessage<LresQrecord> findQrecord(@RequestParam String qresId) {
		LresQrecord record = qrecordService.findQrecord(qresId);
		return new ResultMessage<LresQrecord>(true,record);
	}
}
