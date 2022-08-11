package cn.com.angke.task;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.action.PageOpt2;
import com.somenew.config.service.Config;
import com.somenew.db.DbOpt;
import com.somenew.db.RootDao;
import com.somenew.service.ServiceFactory;

import cn.com.angke.books.BookSearch;
import cn.com.angke.mgk.dao.BookDao;
import cn.com.angke.mgk.dao.BookKeyCountDao;
import cn.com.angke.mgk.dao.BookTagDao;
import cn.com.angke.mgk.dao.EduTypeDao;
import cn.com.angke.mgk.dao.GeographyDao;
import cn.com.angke.mgk.dao.KeyCountDao;
import cn.com.angke.mgk.dao.LibraryDao;
import cn.com.angke.mgk.dao.OrgsDao;
import cn.com.angke.mgk.dao.PeopleDao;
import cn.com.angke.mgk.dao.PostDao;
import cn.com.angke.mgk.dao.PublicDao;
import cn.com.angke.mgk.dao.ZtTypeDao;
import cn.com.angke.mgk.service.BookService;
import cn.com.angke.mgk.service.DataService;
import cn.com.angke.utils.CreateHTML;

/**
 * 
 * @author YiT
 *
 */
@Component
public class TimedTask {

	@Resource(name = "ztTypeDaoImpl")
	private ZtTypeDao ztTypeDao;

	@Resource(name = "eduTypeDaoImpl")
	private EduTypeDao eduTypeDao;

	@Resource(name = "bookTagDaoImpl")
	private BookTagDao bookTagDao;

	@Resource(name = "libraryDaoImpl")
	private LibraryDao libraryDao;

	@Resource(name = "peopleDaoImpl")
	private PeopleDao peopleDao;

	@Resource(name = "geographyDaoImpl")
	private GeographyDao geographyDao;

	@Resource(name = "bookDaoImpl")
	private BookDao bookDao;

	@Resource(name = "bookKeyCountDaoImpl")
	private BookKeyCountDao bookKeyCountDao;

	@Resource(name = "keyCountDaoImpl")
	private KeyCountDao keyCountDao;

	@Resource(name = "orgsDaoImpl")
	private OrgsDao orgsDao;

	@Resource(name = "postDaoImpl")
	private PostDao postDao;

	@Resource(name = "publicDaoImpl")
	private PublicDao publicDao;

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	private DataService dataService;
	
	@Autowired
	private BookService bookService;
	
	/**
	 * 凌晨清除缓存
	 * @throws Exception
	 */
	@Scheduled(cron = "0 0 0 * * ?") // 每天凌晨执行
	public void clearCustomerBookCache() throws Exception {
		bookService.clearAllCustomerBooksCache();
	}
	
	/**
	 * 
	 * 定时访问数据库--->更新图书关键词
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@Scheduled(cron = "0 0 2 * * ?") // 每天凌晨两点执行
//	 @Scheduled(cron = "0 0 0 ? * *") // 每天凌晨两点执行
	public void booksQuartz() throws Exception {
		PageOpt po = new PageOpt();
		PageOpt2 po2 = new PageOpt2();
		BookSearch search = BookSearch.instance();
		// 删除关键词库
		String sql = "delete from WXK_BOOKKEYCOUNT";
		DbOpt.getInstance().getJdbcTemplate().update(sql.toString());
		String sql2 = "delete from WXK_KEYCOUNT";
		DbOpt.getInstance().getJdbcTemplate().update(sql2.toString());
		// 查询所有图书
		JSONArray book = bookDao.list(po2).getJSONArray("items");
		if (book != null && book.size() > 0) {
			for (int i = 0; i < book.size(); i++) {
				String FlowId = book.getJSONObject(i).getString("BOOKID");
				// 地理库
				JSONArray dl = geographyDao.list(po).getJSONArray("items");
				if (dl.size() > 0 && dl != null) {
					// 查询地理库关键词在图书具体章节
					for (int j = 0; j < dl.size(); j++) {
						String NAME = dl.getJSONObject(j).getString("NAME");
						JSONArray gjc = new JSONArray();
						// JSONArray kc=new JSONArray();
						if (StringUtils.isNotBlank(NAME)) {
							gjc = search.search(FlowId, NAME);
							// kc = search.search2(NAME);
						}
						if (gjc.size() > 0 && gjc != null) {
							for (int k = 0; k < gjc.size(); k++) {
								JSONObject keyword = gjc.getJSONObject(k);
								keyword.put("BOOKID", FlowId);
								keyword.put("TYPE", "02");
								keyword.put("NAME", NAME);
								// 保存
								bookKeyCountDao.save(keyword);
								JSONObject newkey = new JSONObject();
								newkey.put("BOOKID", FlowId);
								newkey.put("TYPE", "02");
								newkey.put("NAME", NAME);
								keyCountDao.save(newkey);

							}
						}
						// if (kc.size() > 0 && kc != null) {
						// for (int k = 0; k < kc.size(); k++) {
						// JSONObject newkey = new JSONObject();
						// newkey.put("BOOKID",
						// kc.getJSONObject(k).getString("ID"));
						// newkey.put("TYPE", "02");
						// newkey.put("NAME", NAME);
						// keyCountDao.save(newkey);
						// }
						// }
					}
				}
				// 人物库
				JSONArray rw = peopleDao.list(po).getJSONArray("items");
				if (rw.size() > 0 && rw != null) {
					// 查询人物库关键词在图书具体章节
					for (int j = 0; j < rw.size(); j++) {
						String pname = rw.getJSONObject(j).getString("PEOPLENAME");
						JSONArray gjc = new JSONArray();
						// JSONArray kc=new JSONArray();
						if (StringUtils.isNotBlank(pname)) {
							gjc = search.search(FlowId, pname);
							// kc = search.search2(pname);
						}
						if (gjc.size() > 0 && gjc != null) {
							for (int k = 0; k < gjc.size(); k++) {
								JSONObject keyword = gjc.getJSONObject(k);
								keyword.put("BOOKID", FlowId);
								keyword.put("TYPE", "01");
								keyword.put("NAME", pname);
								// 保存
								bookKeyCountDao.save(keyword);
								JSONObject newkey = new JSONObject();
								newkey.put("BOOKID", FlowId);
								newkey.put("TYPE", "01");
								newkey.put("NAME", pname);
								keyCountDao.save(newkey);
							}
						}
						// if (kc.size() > 0 && kc != null) {
						// for (int k = 0; k < kc.size(); k++) {
						// JSONObject newkey = new JSONObject();
						// newkey.put("BOOKID",
						// kc.getJSONObject(k).getString("ID"));
						// newkey.put("TYPE", "01");
						// newkey.put("NAME", pname);
						// keyCountDao.save(newkey);
						// }
						// }
					}
				}
				// 机构库
				JSONArray jg = orgsDao.list(po).getJSONArray("items");
				if (jg.size() > 0 && jg != null) {
					// 查询机构库关键词在图书具体章节
					for (int j = 0; j < jg.size(); j++) {
						String ORGNAME = jg.getJSONObject(j).getString("NAME");
						JSONArray gjc = search.search(FlowId, ORGNAME);
						// JSONArray kc = search.search2(ORGNAME);
						if (gjc.size() > 0 && gjc != null) {
							for (int k = 0; k < gjc.size(); k++) {
								JSONObject keyword = gjc.getJSONObject(k);
								keyword.put("BOOKID", FlowId);
								keyword.put("TYPE", "03");
								keyword.put("NAME", ORGNAME);
								// 保存
								bookKeyCountDao.save(keyword);
								JSONObject newkey = new JSONObject();
								newkey.put("BOOKID", FlowId);
								newkey.put("TYPE", "03");
								newkey.put("NAME", ORGNAME);
								keyCountDao.save(newkey);
							}
						}
						// if (kc.size() > 0 && kc != null) {
						// for (int k = 0; k < kc.size(); k++) {
						// JSONObject newkey = new JSONObject();
						// newkey.put("BOOKID",
						// kc.getJSONObject(k).getString("ID"));
						// newkey.put("TYPE", "03");
						// newkey.put("NAME", ORGNAME);
						// keyCountDao.save(newkey);
						// }
						// }
					}
				}
				// 职位库
				JSONArray zw = postDao.list(po).getJSONArray("items");
				if (zw.size() > 0 && zw != null) {
					// 查询职位库关键词在图书具体章节
					for (int j = 0; j < zw.size(); j++) {
						String ZWNAME = zw.getJSONObject(j).getString("TONAME");
						JSONArray gjc = search.search(FlowId, ZWNAME);
						// JSONArray kc = search.search2(ZWNAME);
						if (gjc.size() > 0 && gjc != null) {
							for (int k = 0; k < gjc.size(); k++) {
								JSONObject keyword = gjc.getJSONObject(k);
								keyword.put("BOOKID", FlowId);
								keyword.put("TYPE", "04");
								keyword.put("NAME", ZWNAME);
								// 保存
								bookKeyCountDao.save(keyword);
								JSONObject newkey = new JSONObject();
								newkey.put("BOOKID", FlowId);
								newkey.put("TYPE", "04");
								newkey.put("NAME", ZWNAME);
								keyCountDao.save(newkey);
							}
						}
						// if (kc.size() > 0 && kc != null) {
						// for (int k = 0; k < kc.size(); k++) {
						// JSONObject newkey = new JSONObject();
						// newkey.put("BOOKID",
						// kc.getJSONObject(k).getString("ID"));
						// newkey.put("TYPE", "04");
						// newkey.put("NAME", ZWNAME);
						// keyCountDao.save(newkey);
						// }
						// }
					}
				}
				// 出版社库
				JSONArray cbs = publicDao.list(po).getJSONArray("items");
				if (cbs.size() > 0 && cbs != null) {
					// 查询出版社关键词在图书具体章节
					for (int j = 0; j < cbs.size(); j++) {
						String CBSNAME = cbs.getJSONObject(j).getString("NAME");
						// String CBSID=cbs.getJSONObject(j).getString("ID");
						JSONArray gjc = search.search(FlowId, CBSNAME);
						JSONArray kc = search.search("", "", "", CBSNAME, "", "", "", "", "");
						if (gjc.size() > 0 && gjc != null) {
							for (int k = 0; k < gjc.size(); k++) {
								JSONObject keyword = gjc.getJSONObject(k);
								keyword.put("BOOKID", FlowId);
								keyword.put("TYPE", "05");
								keyword.put("NAME", CBSNAME);
								// 保存
								bookKeyCountDao.save(keyword);

								JSONObject newkey = new JSONObject();
								newkey.put("BOOKID", kc.getJSONObject(k).getString("ID"));
								newkey.put("TYPE", "05");
								newkey.put("NAME", CBSNAME);
								keyCountDao.save(newkey);
							}
						}
						// if (kc.size() > 0 && kc != null) {
						// for (int k = 0; k < kc.size(); k++) {
						// JSONObject newkey = new JSONObject();
						// newkey.put("BOOKID",
						// kc.getJSONObject(k).getString("ID"));
						// newkey.put("TYPE", "05");
						// newkey.put("NAME", CBSNAME);
						// keyCountDao.save(newkey);
						// }
						// }
					}
				}
			}
		}
		// 去重
		String sql3 = "DELETE FROM WXK_KEYCOUNT where ID not in(select a.ID from(select max(ID) as ID from WXK_KEYCOUNT group by BOOKID,NAME,TYPE) a )";
		DbOpt.getInstance().getJdbcTemplate().execute(sql3.toString());
		// 去重
		String sql4 = "DELETE FROM WXK_BOOKKEYCOUNT where ID not in(select a.ID from(select max(ID) as ID from WXK_BOOKKEYCOUNT group by BOOKID,NAME,TYPE) a )";
		DbOpt.getInstance().getJdbcTemplate().execute(sql4.toString());
	}

	/**
	 * 
	 * 定时访问数据库--->更新首页人物，图书，专家评论json文件
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
//	@Scheduled(cron = "0 0 0/3 * * ?") // 每三小时执行
	@Scheduled(cron = "0 10 0 * * ?")
	public void syQuartz() throws Exception {
		dataService.genHtml();
	}

	/**
	 * 	凌晨两点更新WXK_ZTTYPE2
	 * @throws Exception
	 */
	@Scheduled(cron = "0 0 2 * * ?")
	public void syncZttype() throws Exception {
		dataService.syncZttype();
	}
	
	@Scheduled(cron = "0 0 2 * * ?") // 每天凌晨两点执行
	public void delTemp() {
		// 删除临时文件
		Config vconfig = ServiceFactory.getInstance().getConfig();
		// 获取水印图片路径
		String path = vconfig.getConfigValue("WATERURL");
		delAllFile(path);
	}

	// 删除指定文件夹下所有文件
	// param path 文件夹完整绝对路径
	public static boolean delAllFile(String path) {
		boolean flag = false;
		File file = new File(path);
		if (!file.exists()) {
			return flag;
		}
		if (!file.isDirectory()) {
			return flag;
		}
		String[] tempList = file.list();
		File temp = null;
		for (int i = 0; i < tempList.length; i++) {
			if (path.endsWith(File.separator)) {
				temp = new File(path + tempList[i]);
			} else {
				temp = new File(path + File.separator + tempList[i]);
			}
			if (temp.isFile()) {
				temp.delete();
			}
			if (temp.isDirectory()) {
				delAllFile(path + "/" + tempList[i]);// 先删除文件夹里面的文件
				flag = true;
			}
			temp.delete();
		}
		return flag;
	}

}
