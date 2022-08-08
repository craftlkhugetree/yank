package cn.com.angke.book.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.beetl.sql.core.SQLManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.somenew.config.service.ConfigOpt;

import cn.com.angke.book.dao.BaseDao;

public class BaseService {
//	private Logger Log = LogManager.getLogger(BaseService.class);
	@Autowired
	BaseDao baseDao;
	
	protected HttpServletRequest getRequest(){
        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return req;
    }
	protected HttpServletResponse getResponse(){
        HttpServletResponse resp = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getResponse();
        return resp;
    }
	
	protected String uploadPath() {
		return ConfigOpt.getConfigValue("UPLOADPATH", "e:/web");
	}
	protected String projectPath() {
		return getRequest().getSession().getServletContext().getRealPath("/");
	}
	
	protected SQLManager sqlManager() {
		return baseDao.getSql();
	}
	
	public static void main(String[] args) {
//		BaseService baseService = new BaseService();
//		LresQuestclass l = new LresQuestclass();
//		baseService.fillBasePro(l);
//		System.out.println(l.getIsDelete());
	}
}
