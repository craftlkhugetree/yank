package cn.com.angke.mgk.service;

import com.somenew.service.PlatformBaseService;

public interface DataService extends PlatformBaseService {

	void genHtml();

	void syncZttype();

	String checkPicLost();

	String checkBookLost(String batId) throws Exception;

}
