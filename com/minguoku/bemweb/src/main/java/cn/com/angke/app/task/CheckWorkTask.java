package cn.com.angke.app.task;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.cache.DataCacheOpt;

import cn.com.angke.app.service.ImgService;

@Component
public class CheckWorkTask {
	@Autowired
	private ImgService imgService;
	
	@Scheduled(cron="0 0/5 * * * ?")
	public void checkWork(){
		System.out.println("开始检查加工情况");
		PageOpt po = new PageOpt();
		po.setCondition("STATUS", "加工中");
		JSONArray arr = imgService.piciList(po).getJSONArray("items");
		for(int i=0;i<arr.size();i++){
			System.out.println("开始检查："+arr.getJSONObject(i).getString("NAME"));
			if(StringUtils.isBlank(DataCacheOpt.get(arr.getJSONObject(i).getString("ID")))){
				System.out.println("加工缓存信息不存在了,程序意外退出，改变加工状态！");
				JSONObject obj = new JSONObject();
				obj.put("STATUS", "加工失败");
				imgService.updateByName(arr.getJSONObject(i).getString("NAME"), obj);
			}else{
				System.out.println("仍在加工中！");
			}
			
		}
		System.out.println("检测完毕！");
	}
	
}
