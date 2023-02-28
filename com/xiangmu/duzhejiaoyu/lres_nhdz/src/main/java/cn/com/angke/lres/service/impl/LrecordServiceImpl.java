package cn.com.angke.lres.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.somenew.utils.StringOpt;

import cn.com.angke.lres.pojo.LresLrecord;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.LrecordService;
import cn.com.angke.util.DateTimeUtil;
import cn.com.angke.util.UserUtil;

@Service
public class LrecordServiceImpl extends BaseService implements LrecordService {
	private static final Logger LOG = LogManager.getLogger(LrecordServiceImpl.class);
	@Override
	public Integer saveRecord(String action) {
		int result = 0;
		Date startDate = DateTimeUtil.getSystemDate();
		LresLrecord params = new LresLrecord();
		params.setUserId(UserUtil.getUserId());
		LOG.info("userID========================:"+UserUtil.getUserId());
		params.setLearnDate(startDate);
		List<LresLrecord> list = sqlManager().select("lresLrecord.findByDate", LresLrecord.class,params);
		if(null != list && list.size() > 0) {
			LresLrecord record = list.get(0);
			if(StringUtils.isBlank(action)) {
				double time = DateTimeUtil.getMinutesOfTwoDate(startDate, record.getLearnStart());
				int diffTime = (1 <= time && time <= 1.1)?1:0;
				record.setLearnTime(record.getLearnTime()+diffTime);
			}
			record.setLearnStart(startDate);
			sqlManager().updateTemplateById(record);
			result = record.getLearnTime();
		}else {
			LresLrecord record = new LresLrecord();
			record.setId(StringOpt.produceUUID());
			record.setUserId(UserUtil.getUserId());
			record.setLearnStart(startDate);
			record.setLearnTime(0);
			record.setLearnDate(startDate);
			fillBasePro(record);
			sqlManager().insert(record);
		}
		return result;
		
	}
	@Override
	public Integer queryRecord() {
		Map<String,String> params = new HashMap<>();
		params.put("userId", UserUtil.getUserId());
		Integer time = sqlManager().selectSingle("lresLrecord.queryByUserId",params , Integer.class);
		return time;
	}

}
