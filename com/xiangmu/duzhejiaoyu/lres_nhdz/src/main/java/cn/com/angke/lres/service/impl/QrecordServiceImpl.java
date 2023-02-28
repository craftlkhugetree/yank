package cn.com.angke.lres.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.somenew.utils.StringOpt;

import cn.com.angke.api.Reader;
import cn.com.angke.lres.core.InitData;
import cn.com.angke.lres.pojo.LresQrecord;
import cn.com.angke.lres.pojo.LresUser;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.QrecordService;
import cn.com.angke.util.UserUtil;

@Service
public class QrecordServiceImpl extends BaseService implements QrecordService {
	private Logger logger = LoggerFactory.getLogger(QrecordServiceImpl.class);
	
	@Override
	@Transactional
	public void saveQrecord(LresQrecord dto,boolean active) {
		if(null != dto.getId()) {
			sqlManager().updateTemplateById(dto);
		}else {
			dto.setId(StringOpt.produceUUID());
			sqlManager().insert(dto);
		}
		if(active && dto.getIsPass().intValue() == 1) {
			String userId = dto.getUserId();
			LresUser user = sqlManager().single(LresUser.class, userId);
			user.setIspass("1");
			logger.info("考试通过开始激活===============" + user.getReaderId()+","+user.getReaderFlag());
			if(null != user.getReaderId()) {
				boolean result = Reader.active(user.getReaderId());
				if(result) {
					user.setReaderFlag(1);
					logger.info("考试通过激活成功===============" + user.getReaderId()+","+user.getReaderFlag());
				}else {
					try {
						logger.info("考试激活失败，加入到激活队列===============" + user.getReaderId()+","+user.getReaderFlag());
						if(InitData.OPACQUEUE.size() > 5000) {
							InitData.OPACQUEUE.clear();
						}
						InitData.OPACQUEUE.put(user);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
			}
			sqlManager().updateTemplateById(user);
		}
	}
	
	@Override
	public LresQrecord findQrecord(String resId) {
		Map<String,String> params = new HashMap<>();
		params.put("userId", UserUtil.getUserId());
		params.put("resId", resId);
		LresQrecord record = new LresQrecord();
		List<LresQrecord> list = sqlManager().select("lresQrecord.findByResId", LresQrecord.class, params);
		if(null != list && list.size() > 0) {
			record = list.get(0);
		}
		return record;
	}

}
