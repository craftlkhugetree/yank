package cn.com.angke.app.service.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.jaxen.function.StringFunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt;
import com.somenew.cache.DataCacheOpt;
import com.somenew.config.service.Config;
import com.somenew.config.service.ConfigOpt;
import com.somenew.db.DbOpt;
import com.somenew.db.RootDao;
import com.somenew.exception.BusException;
import com.somenew.qywx.MyDate;
import com.somenew.service.PlatformBaseServiceImpl;
import com.somenew.service.ServiceFactory;

import cn.com.angke.app.dao.ImgDao;
import cn.com.angke.app.service.ImgService;
import cn.com.angke.app.util.FileUtil;
import cn.com.angke.utils.CreateHTML;

@Service
public class ImgServiceImpl extends PlatformBaseServiceImpl implements ImgService {
	@Autowired
	private ImgDao imgDao;

	@Override
	public JSONObject getDir() {
		return null;
	}

	@Override
	public JSONObject rootDir() {
		return null;
	}

	@Override
	public JSONObject updatePICI(String pici) {
		String yuanshi = ConfigOpt.getConfigValue("YUANSHI");
		String jiagong = ConfigOpt.getConfigValue("JIAGONG");
		// 现在的原始批次
		JSONArray yuanshiPICI = imgDao.getDir("YUANSHI").getJSONArray("items");
		System.out.println("现在的原始批次:" + yuanshiPICI);
		// 现在的加工批次
		JSONArray jiagongPICI = imgDao.getDir("JIAGONG").getJSONArray("items");
		System.out.println("现在的加工批次:" + jiagongPICI);
		// 数据库的批次
		JSONArray dbPICI = imgDao.getPICINames();
		System.out.println("数据库批次:" + dbPICI);
		// 删除不存在的批次，添加新增的批次
		JSONObject delAdd = this.getAddAndReduce(dbPICI, yuanshiPICI);
		JSONArray add = delAdd.getJSONArray("add");
		JSONArray del = delAdd.getJSONArray("del");
		for (int i = 0; i < add.size(); i++) {
			this.addNewByName(add.getString(i));
		}
		for (int i = 0; i < del.size(); i++) {
			this.delByName(del.getString(i));
		}
		JSONArray checkPICI = new JSONArray();
		if(StringUtils.isBlank(pici)||(StringUtils.isNotBlank(pici)&&pici.equals("PICI_ALL"))){
			checkPICI = yuanshiPICI;
		}else if(pici.equals("PICI_BLANK")){
			checkPICI = add;
		}else{
			checkPICI.add(pici);
		}
		
		// 逐一检测批次
		for (int i = 0; i < checkPICI.size(); i++) {
			String piciName = checkPICI.getString(i);
			int BOOKNUM = 0;
			int BOOKNUMJ = 0;
			int TIFNUM = 0;
			int TIFNUMJ = 0;
			File file = new File(yuanshi + piciName);
			File[] books = file.listFiles();
			for (int j = 0; j < books.length; j++) {
				File oneBookFile = books[j];
				if (oneBookFile.isDirectory()) {
					String bookDir = jiagong + piciName + File.separator + oneBookFile.getName();
					System.out.println("正在处理:"+bookDir);
					BOOKNUM += 1;
					// 检测该图书是否加工
					boolean bookIsJia = FileUtil.ifExist(bookDir);
					if (bookIsJia) {
						BOOKNUMJ += 1;
					}
					// 检查下面的tif加工情况
					JSONObject bookJiaObj = this.checkBook(yuanshi + piciName, jiagong + piciName,
							oneBookFile.getName());
					//System.out.println(oneBookFile.getName() + "加工情况:" + bookJiaObj);
					TIFNUM += bookJiaObj.getIntValue("tifNum");
					TIFNUMJ += bookJiaObj.getIntValue("tifJNum");
				}
			}
			JSONObject changes = new JSONObject();
			changes.put("BOOKNUM", BOOKNUM);
			changes.put("BOOKNUMJ", BOOKNUMJ);
			changes.put("TIFNUM", TIFNUM);
			changes.put("TIFNUMJ", TIFNUMJ);
			this.updateByName(piciName, changes);
		}
		return new JSONObject();
	}

	// 检测图书加工度,通过检测原始路径下图书的tif文件数，到对应加工目录寻找加工的文件
	public static JSONObject checkBook(String yuanshi, String jiagong, String bookName) {
		JSONObject obj = new JSONObject();
		JSONArray hasJia = new JSONArray();
		JSONArray noJia = new JSONArray();
		File file = new File(yuanshi + File.separator + bookName);
		File[] tifList = file.listFiles();
		File jiaFile = new File(jiagong + File.separator + bookName + File.separator + "/scanpic/m");
		JSONArray pngArr = new JSONArray();
		if (jiaFile.exists()) {
			File[] pngFiles = jiaFile.listFiles();
			for (int i = 0; i < pngFiles.length; i++) {
				File oneFile = pngFiles[i];
				if (oneFile.isFile() && oneFile.getName().endsWith("png")) {
					
					try {
						pngArr.add(oneFile.getName().substring(0, oneFile.getName().indexOf(".")));
					} catch (Exception e) {
						System.out.println("错误png:"+jiaFile.getAbsolutePath()+File.separator+oneFile.getName());
						e.printStackTrace();
						throw new BusException(jiaFile.getAbsolutePath()+File.separator+oneFile.getName(), jiaFile.getAbsolutePath()+File.separator+oneFile.getName());
					}
				}
			}
		}
		for (int i = 0; i < tifList.length; i++) {
			File oneFile = tifList[i];
			if (oneFile.isFile()) {
				String fileName = oneFile.getName();
				if (fileName.endsWith("tif")) {
					
					try {
						if (pngArr.contains(fileName.substring(0, fileName.indexOf(".")))) {
							hasJia.add(fileName);
						} else {
							noJia.add(fileName);
						}
					} catch (Exception e) {
						System.out.println("检查tif："+file.getAbsolutePath()+File.separator+fileName);
						e.printStackTrace();
						throw new BusException(file.getAbsolutePath()+File.separator+fileName, file.getAbsolutePath()+File.separator+fileName);
					}
				}
			}
		}
		obj.put("hasJia", hasJia);
		obj.put("noJia", noJia);
		obj.put("tifNum", hasJia.size() + noJia.size());
		obj.put("tifJNum", hasJia.size());
		return obj;
	}

	public JSONObject getAddAndReduce(JSONArray oldArr, JSONArray newArr) {
		JSONObject obj = new JSONObject();
		JSONArray add = new JSONArray();
		JSONArray del = new JSONArray();
		JSONArray mix = new JSONArray();
		for (int i = 0; i < newArr.size(); i++) {
			if (!oldArr.contains(newArr.get(i))) {
				add.add(newArr.get(i));
			} else {
				mix.add(newArr.get(i));
			}
		}
		for (int i = 0; i < oldArr.size(); i++) {
			if (!newArr.contains(oldArr.get(i))) {
				del.add(oldArr.get(i));
			}
		}
		obj.put("add", add);
		obj.put("mix", mix);
		obj.put("del", del);
		return obj;
	}

	@Override
	public void addNewByName(String name) {
		JSONObject obj = new JSONObject();
		obj.put("NAME", name);
		obj.put("RESULT", "{}");
		obj.put("CREATETIME", MyDate.getNow14Date());
		imgDao.save(obj);
	}

	@Override
	public void delByName(String name) {
		String sql = "delete from WXK_IMG where NAME = '" + name + "'";
		this.getJdbcTemplate().execute(sql);
	}

	@Override
	public void updateByName(String name, JSONObject changes) {
		String id = imgDao.getIdByName(name);
		changes.put("ID", id);
		changes.put("UPDATETIME", MyDate.getNow14Date());
		imgDao.save(changes);
	}

	@Override
	public JSONObject piciList(PageOpt po) {
		JSONObject obj = imgDao.list(po);
		JSONArray items = obj.getJSONArray("items");
		for (int i = 0; i < items.size(); i++) {
			if (StringUtils.isNotBlank(items.getJSONObject(i).getString("RESULT"))) {
				items.getJSONObject(i).put("RESULT", JSONObject.parse(items.getJSONObject(i).getString("RESULT")));
			}
		}
		return obj;
	}

	@Override
	public JSONObject preWork(String pici) {
		JSONObject obj = new JSONObject();
		boolean canGo = true;
		String piciId = imgDao.getIdByName(pici);
		JSONObject one = imgDao.viewById(piciId).getJSONObject("item");
		String status = one.getString("STATUS");
		JSONObject changes = new JSONObject();
		if (status.equals("加工中")) {
			// 检查加工线程是否有误
			String piciStr = DataCacheOpt.get(piciId);
			if (StringUtils.isNotBlank(piciStr)) {
				// 说明该处理线程还存在
				canGo = false;
			}
		}
		if(canGo){
			changes.put("STATUS", "加工中");
			this.updateByName(pici, changes);
		}
		obj.put("canGo", canGo);
		return obj;
	}
	
	public void dataOptReset(String id,String info,int minute){
		DataCacheOpt.del(id);
		DataCacheOpt.setex(id, minute*60, info);
	}
	
	// 加工
	@Override
	public JSONObject work(String pici, String isAll) {
		int bookNum = 0;
		int tifNum = 0;
		int errorTifNum = 0;
		JSONArray errorInfoArr = new JSONArray();
		String piciId = imgDao.getIdByName(pici);
		StringBuffer jiaBuff = new StringBuffer();
		jiaBuff.append("开始处理</br>");
		System.out.println("开始处理！");
		this.dataOptReset(piciId, jiaBuff.toString(), 5);
		String yuanshi = ConfigOpt.getConfigValue("YUANSHI");
		String jiagong = ConfigOpt.getConfigValue("JIAGONG");
		File file = new File(yuanshi + pici);// 原始目录
		File fileJ = new File(jiagong + pici);// 加工目录
		if (!fileJ.exists()) {
			fileJ.mkdir();
		}
		File[] filesY = file.listFiles();
		jiaBuff.append(pici + "  共" + filesY.length + "个目录</br>");
		this.dataOptReset(piciId, jiaBuff.toString(), 5);
		System.out.println(pici + "  共" + filesY.length + "个目录</br>");
		for (int i = 0; i < filesY.length; i++) {
			File oneBook = filesY[i];// 一本图书的目录
			if (oneBook.isDirectory()) {
				bookNum+=1;
				// 更新对应加工目录
				FileUtil.updateJiagongDir(jiagong + pici + File.separator + oneBook.getName());
				File mPng = new File(jiagong + pici + File.separator + oneBook.getName() + File.separator + "scanpic"
						+ File.separator + "m");
				File[] oneBookTifs = oneBook.listFiles();
				File[] oneBookPngs = mPng.listFiles();
				JSONObject addDel = FileUtil.getFileAddDel(oneBookTifs, "tif", oneBookPngs, "png");
				JSONArray jia = new JSONArray();
				if (isAll.equals("1")) {
					jia = addDel.getJSONArray("old");
				} else {
					jia = addDel.getJSONArray("del");
				}
				// 开始加工
				jiaBuff.append("</br>正在处理:" + oneBook.getName() + ",进度:" + FileUtil.getProcess(i + 1, filesY.length)
						+ ",共需要加工" + jia.size() + "个tif文件" + "</br>");
				this.dataOptReset(piciId, jiaBuff.toString(), 5);
				System.out.println("正在处理:" + oneBook.getName() + ",进度:" + FileUtil.getProcess(i + 1, filesY.length)
						+ ",共需要加工" + jia.size() + "个tif文件" + "</br>");
				for (int j = 0; j < jia.size(); j++) {
					// 每10个刷新一下，以免过期
					if (j % 10 == 0) {
						this.dataOptReset(piciId, jiaBuff.toString(), 5);
					}
					try {
						tifNum+=1;
						this.JiaGong(new File(yuanshi + pici + File.separator + oneBook.getName()+File.separator+jia.getString(j)+".tif"),jiagong + pici + File.separator + oneBook.getName() + File.separator + "scanpic",jia.getString(j) );
						System.out.println("正在处理:"+jia.getString(j));
					} catch (Exception e) {
						errorTifNum+=1;
						JSONObject errorObj = new JSONObject();
						errorObj.put("bookName", oneBook.getName());
						errorObj.put("tifName", jia.getString(j)+".tif");
						errorInfoArr.add(errorObj);
						jiaBuff.append("<span class='error'>出错了!"+jia.getString(j)+".tif</span></br>");
						this.dataOptReset(piciId, jiaBuff.toString(), 5);
						System.out.println("出错了!"+jia.getString(j)+".tif");
					}
				}
			}

		}
		DataCacheOpt.del(piciId);
		JSONObject changes = new JSONObject();
		changes.put("STATUS", "加工完毕");
		JSONObject result = new JSONObject();
		result.put("bookNum", bookNum);
		result.put("tifNum", tifNum);
		result.put("errorTifNum", errorTifNum);
		result.put("errorInfoArr", errorInfoArr);
		changes.put("RESULT", result);
		this.updateByName(pici, changes);
		this.updatePICIByName(pici);
		return new JSONObject();
	}
	
	public void JiaGong(File tifFile,String targetDir,String fileName) throws Exception{
		File tempFile = FileUtil.tif2png(tifFile, targetDir+File.separator+fileName+".png");
		FileUtil.producePng(tempFile, fileName, targetDir);
	}

	@Override
	public JSONObject getWorkInfo(String ID) {
		JSONObject obj = new JSONObject();
		String cache = DataCacheOpt.get(ID);
		if(StringUtils.isBlank(cache)){
			obj.put("info", "暂无信息");
		}else{
			obj.put("info", cache);
		}
		return obj;
	}

	@Override
	public JSONObject updatePICIByName(String NAME) {
		String yuanshi = ConfigOpt.getConfigValue("YUANSHI");
		String jiagong = ConfigOpt.getConfigValue("JIAGONG");
		String piciName = NAME;
		int BOOKNUM = 0;
		int BOOKNUMJ = 0;
		int TIFNUM = 0;
		int TIFNUMJ = 0;
		File file = new File(yuanshi + piciName);
		File[] books = file.listFiles();
		for (int j = 0; j < books.length; j++) {
			File oneBookFile = books[j];
			if (oneBookFile.isDirectory()) {
				String bookDir = jiagong + piciName + File.separator + oneBookFile.getName();
				BOOKNUM += 1;
				// 检测该图书是否加工
				boolean bookIsJia = FileUtil.ifExist(bookDir);
				if (bookIsJia) {
					BOOKNUMJ += 1;
				}
				// 检查下面的tif加工情况
				JSONObject bookJiaObj = this.checkBook(yuanshi + piciName, jiagong + piciName,
						oneBookFile.getName());
				//System.out.println(oneBookFile.getName() + "加工情况:" + bookJiaObj);
				TIFNUM += bookJiaObj.getIntValue("tifNum");
				TIFNUMJ += bookJiaObj.getIntValue("tifJNum");
			}
		}
		JSONObject changes = new JSONObject();
		changes.put("BOOKNUM", BOOKNUM);
		changes.put("BOOKNUMJ", BOOKNUMJ);
		changes.put("TIFNUM", TIFNUM);
		changes.put("TIFNUMJ", TIFNUMJ);
		this.updateByName(piciName, changes);
		return new JSONObject();
	}

	@Override
	public void createIndexPage() {
		System.out.println("执行了生成首页！0801");
		Map<String, Object> m = new HashMap<>();
		// 生成最新10本书的json文件
		StringBuffer booksql = new StringBuffer();
		booksql.append(
				"select b.ID,(CASE WHEN b.TITLE LIKE '%册' then SUBSTRING(b.TITLE,1,CHAR_LENGTH(b.TITLE)-3) else b.title end) as TITLE, ");
		booksql.append(
				" p.`NAME` as 'PUBLISHNAME',b.BOOKDIR,b.BOOKID,b.BOOKDIR,bzt.ZTSYMBOL as 'ZTTYPE' from WXK_BOOK b ");
		booksql.append("left join WXK_PUBLISHING p on(b.PUBLISHINGID=p.ID) left join ");
		booksql.append(
				"(select bz.BOOKID,bz.ZTTYPEID,z.ZTSYMBOL from WXK_BOOKZTTYPE bz LEFT JOIN WXK_ZTTYPE z ON bz.ZTTYPEID=z.ID ) bzt on (b.ID=bzt.BOOKID)");
		booksql.append(
				" GROUP BY (CASE WHEN b.TITLE LIKE '%册' then SUBSTRING(b.TITLE,1,CHAR_LENGTH(b.TITLE)-3) else b.title end)");
		booksql.append(" order by b.CREATETIME desc limit 10");
		List<JSONObject> bdata = this.getJdbcTemplate().query(booksql.toString(), null, null, RootDao.readRows);
		for (int i = 0; i < bdata.size(); i++) {
			String path = bdata.get(i).getString("BOOKDIR");
			path = path.replace("\\", "/");
			bdata.get(i).put("BOOKDIR", path);
		}
		m.put("NEWARRIVAL", bdata);
		// 生成人物的json数据
		StringBuffer peoplesql = new StringBuffer();
		peoplesql.append("select CONCAT(p.LASTNAME,p.FIRSTNAME) as 'NAME',p.BIRTHDAY,p.YH,");
		peoplesql.append("o.Z,o.H,o.BC,p.JG from WXK_PEOPLE p");
		peoplesql.append(" LEFT JOIN (SELECT a.PEOPLEID, ");
		peoplesql.append("MAX( CASE WHEN a.`NTYPE`='字' THEN  a.`NAME` END  ) Z, ");
		peoplesql.append("MAX( CASE WHEN a.`NTYPE`='号' THEN  a.`NAME` END  ) H,");
		peoplesql.append("MAX( CASE WHEN a.`NTYPE`='别名' THEN a.`NAME` END ) BC ");
		peoplesql.append(" FROM (SELECT PEOPLEID, GROUP_CONCAT(`NAME`)as 'NAME',NTYPE ");
		peoplesql.append(" FROM WXK_OTHERNAME group BY PEOPLEID,NTYPE) a  group BY a.PEOPLEID) o ");
		peoplesql.append(" ON(p.ID=o.PEOPLEID) where p.BIRTHDAY<>''and p.JG<>'' order by RAND() limit 5");
		List<JSONObject> pdata = this.getJdbcTemplate().query(peoplesql.toString(), null, null, RootDao.readRows);
		m.put("MGMASTERCOMMENT", pdata);
		// 生成专家评论数据
		StringBuffer commentSql = new StringBuffer();
		commentSql.append(
				" select AUTHOR as EXPERTER,TITLE as EXPERTERCOMMENT,CONTENT,COMMENTTIME from WXK_EXPERTCOMMENT where ISSHOW='1' limit 4");
		List<JSONObject> cdata = this.getJdbcTemplate().query(commentSql.toString(), null, null, RootDao.readRows);
		m.put("EXPERTCOMMENT", cdata);
		Config vconfig = ServiceFactory.getInstance().getConfig();
		// 获取图片路径
		String path = vconfig.getConfigValue("IMGURL");
		// 获取首页模版地址
		String temppath = vconfig.getConfigValue("INDEXTEMP");
		m.put("IMGURL", path);
		CreateHTML cre = new CreateHTML();
		cre.geneHtmlFile("indexftl.html", m, temppath, "index.html", temppath);
	}

	// public static void main(String[] args) {
	// JSONObject obj =
	// ImgServiceImpl.checkBook("D:\\fileuploadmgk\\yuanshi\\C002_00_20181024",
	// "D:\\fileuploadmgk\\jiagong\\C002_00_20181024", "009051浙江省政府二十一年度施政方針");
	// System.out.println(obj);
	// }
}
