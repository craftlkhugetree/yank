package cn.com.angke.lres.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.dto.QresourceDto;
import cn.com.angke.lres.pojo.LresReadertype;
import cn.com.angke.lres.service.QresourceService;
import cn.com.angke.lres.service.ReaderTypeService;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QresourceVo;
import cn.com.angke.lres.vo.ResultMessage;
import cn.com.angke.util.DateTimeUtil;
import io.swagger.annotations.Api;

/**   
 * @ClassName:  QresourceController   
 * @Description:TODO(考试资源（试卷）控制器)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:13:59   
 *     
 */  
@RestController
@RequestMapping("/qresourceManager")
@Api(tags = "试卷接口")
public class QresourceController {
	static Logger log = LogManager.getLogger(QresourceController.class);
	@Autowired
	QresourceService qresourceService;
	@Autowired
	ReaderTypeService readerTypeService;

	@PostMapping("/pageList")
	public PageVo<QresourceVo> list(HttpServletRequest request){
		PageOpt2 pageDto = PageOpt2.produceFromLayUI(request);
		PageVo<QresourceVo> pageVo = qresourceService.list(pageDto);
		List<QresourceVo> list = pageVo.getItems();
		List<LresReadertype> types = readerTypeService.list();
		Map<String,String> readerMap = new HashMap<>();
		for(LresReadertype type : types) {
			readerMap.put(type.getReadtype(), type.getReadname());
		}
		if(null != list && list.size() > 0) {
			list.stream().forEach(m->{
				String vdate = null;
				try {
					vdate = DateTimeUtil.formatDatetoString(m.getValidStart()) +"~" +DateTimeUtil.formatDatetoString(m.getValidEnd());
				} catch (Exception e) {
					e.getMessage();
				}
				m.setValidDateStr(vdate);
				String[] readObjIds = m.getUserType().split(",");
				StringBuffer sb = new StringBuffer();
				for(int i = 0;i<readObjIds.length;i++) {
					sb.append(","+readerMap.get(readObjIds[i]));
				}
				m.setUserTypeStr(sb.substring(1));
				
			});
		}
		return pageVo;
		
	}
	
	@PostMapping("/find")
	public ResultMessage<QresourceVo> findById(@RequestParam String id){
		QresourceVo vo = qresourceService.findById(id);
		return new ResultMessage<QresourceVo>(true,vo);
		
	}
	
	@PostMapping("/add")
	public JSONObject add(@RequestParam String data){
		QresourceDto dto = JSONObject.parseObject(data, QresourceDto.class);
		JSONObject result = new JSONObject();
		result.put("success", true);
		try {
			result = qresourceService.add(dto);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		return result;
	}
	
	@PostMapping("/update")
	public JSONObject update(@RequestParam String data){
		QresourceDto dto = JSONObject.parseObject(data, QresourceDto.class);
		JSONObject result = new JSONObject();
		result.put("success", true);
		try {
			result = qresourceService.update(dto);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		return result;
	}
	
	@PostMapping("/delete")
	public ResultMessage<String> delete(@RequestParam String id){
		qresourceService.delete(id);
		return new ResultMessage<>(true);
	}
	
}
