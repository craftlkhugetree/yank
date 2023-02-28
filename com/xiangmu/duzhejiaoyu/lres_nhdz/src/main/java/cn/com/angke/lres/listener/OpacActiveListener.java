package cn.com.angke.lres.listener;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Service;

import cn.com.angke.api.Reader;
import cn.com.angke.lres.core.InitData;
import cn.com.angke.lres.dao.BaseDao;
import cn.com.angke.lres.pojo.LresUser;

@Service
public class OpacActiveListener implements ApplicationListener<ContextRefreshedEvent> {
	private final static Logger log = LogManager.getLogger(OpacActiveListener.class);
	@Autowired
	BaseDao baseDao;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		List<LresUser> list = baseDao.getSql().query(LresUser.class).andIsNotNull("READER_ID").andEq("READER_FLAG", 3)
				.andEq("ISPASS", "1").select();
		list.forEach(m -> {
			try {
				log.info("未激活用户加入队列===============" + m.getReaderId());
				InitData.OPACQUEUE.put(m);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		});
		new Thread() {
			@Override
			public void run() {
				log.info("激活用户，守护线程启动===============");
				while (true) {
					try {
						LresUser user = InitData.OPACQUEUE.take();
						log.info("守护线程开始激活用户==============="+user.getReaderId()+","+user.getReaderFlag());
						boolean result = Reader.active(user.getReaderId());
						if (result) {
							user.setReaderFlag(1);
							baseDao.getSql().updateTemplateById(user);
						} else {
							if(InitData.OPACQUEUE.size() > 5000) {
								InitData.OPACQUEUE.clear();
							}
							InitData.OPACQUEUE.put(user);
						}
						log.info("守护线程激活用户结束==============="+user.getReaderId()+","+user.getReaderFlag());
						Thread.sleep(30000);
					} catch (Exception e) {
						log.error(e.getMessage());
						e.printStackTrace();
					}
				}
			}
		}.start();
	}

}
