package cn.com.angke.app.service;
import java.util.List;
import java.util.Map;
import com.alibaba.fastjson.JSONObject;
import org.beetl.sql.core.engine.PageQuery;
import cn.com.angke.common.page.PageDto;
import cn.com.angke.app.entity.WxkNotice;
/* 
* gen date 2022-08-02
*/
public interface WxkNoticeService {
	void save(WxkNotice dto);
	PageQuery<JSONObject> pageQuery(PageDto dto);
	List<WxkNotice> list(Map<String,Object> queryMap);
	JSONObject find(Long id);
	void delete(Long id);

}
