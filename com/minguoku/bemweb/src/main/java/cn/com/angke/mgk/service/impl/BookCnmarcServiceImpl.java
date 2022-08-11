package cn.com.angke.mgk.service.impl;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.PlatformBaseDao;
import com.somenew.service.PlatformBaseServiceImpl;

import cn.com.angke.mgk.dao.BookCnmarcDao;
import cn.com.angke.mgk.service.BookCnmarcService;

@Service
public class BookCnmarcServiceImpl extends PlatformBaseServiceImpl implements BookCnmarcService {

	static Log logger = LogFactory.getLog(BookCnmarcServiceImpl.class);

	@Resource(name = "bookCnmarcDaoImpl")
	private BookCnmarcDao bookCnmarcDao;
	
	public PlatformBaseDao getBaseDao() {
		return bookCnmarcDao;
	}

	@Override
	public JSONObject saveBookCnmarc(JSONObject bookCnmc) {
		PageOpt po = new PageOpt();
		po.setCondition("BOOKID", bookCnmc.getString("BOOKID"));
		// 查询所有图书
		JSONArray bookCn = bookCnmarcDao.list(po).getJSONArray("items");
		if (bookCn.size() > 0 && bookCn != null) {
			bookCnmarcDao.save(bookCnmc);
		} else {
			DbOpt.getInstance().insert(null, "WXK_BOOK_CNMARC", bookCnmc);
		}
		JSONObject r = new JSONObject();
		r.put("success", true);
		r.put("message", "成功");
		return r;
	}

	@Override
	public JSONObject delBookCnmarc(JSONArray idArr) {
		StringBuffer del = new StringBuffer();
		del.append("delete from WXK_BOOK_CNMARC where BOOKID in(");
		for(int i=0;i<idArr.size();i++){
			del.append("'"+idArr.getString(i)+"',");
		}
		del.delete(del.length()-1, del.length()).append(")");
		this.getJdbcTemplate().execute(del.toString());
		JSONObject r  = new JSONObject();
		r.put("success", true);
		r.put("message", "成功");
		return r;
	}

}
