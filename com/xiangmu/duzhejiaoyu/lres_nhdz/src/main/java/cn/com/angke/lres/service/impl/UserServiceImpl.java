package cn.com.angke.lres.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.beetl.sql.core.engine.PageQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.excel.EasyExcel;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;
import com.somenew.ids.client.LoginUser;
import com.somenew.utils.StringOpt;
import com.somenew.web.RequestHelper;

import cn.com.angke.api.Reader;
import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.pojo.LresReadertype;
import cn.com.angke.lres.pojo.LresUser;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.UserService;
import cn.com.angke.lres.vo.BigTingVo;
import cn.com.angke.lres.vo.CampusVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.UserVo;
import cn.com.angke.util.DateTimeUtil;
import cn.com.angke.util.HttpClientUtil;
import cn.com.angke.util.UserUtil;

@Service
public class UserServiceImpl extends BaseService implements UserService {
	private final static Logger log = LogManager.getLogger(UserServiceImpl.class);
	@Override
	public PageVo<UserVo> pageQuery(PageOpt2 pageDto) {
		PageQuery<UserVo> pageQuery = new PageQuery<UserVo>();
		JSONArray arrays = pageDto.getConditions();
		Map<Object,Object> paras = new HashMap<Object,Object>();
		paras.put("tid", UserUtil.getTid());
		if(null!=arrays && !arrays.isEmpty()) {
			arrays.stream().forEach(m->{
				JSONObject json = (JSONObject) m;
				paras.put(json.get("property"), json.get("value"));
			});
		}
		if(null != paras.get("orderBy") && null != paras.get("sort")) {
			String orderBy = paras.get("orderBy")+" "+paras.get("sort");
			pageQuery.setOrderBy(orderBy);
		}
		Integer pageNum = pageDto.getStart()/pageDto.getPageSize()+1;
		pageQuery.setPageNumber(pageNum < 0?1:pageNum);
		pageQuery.setPageSize(pageDto.getPageSize()<1?10:pageDto.getPageSize());
		pageQuery.setParas(paras);
		PageQuery<UserVo> result = sqlManager().pageQuery("lresUser.pageQueryList", UserVo.class, pageQuery);
		PageVo<UserVo> pageVo = new PageVo<UserVo>(true,result.getList(),result.getTotalRow());
		return pageVo;
	}
	
	@Override
	public void acitveReader(String id) throws LresException{
		LresUser user = sqlManager().single(LresUser.class, id);
		if(StringUtils.isBlank(user.getReaderId())) {
			return;
		}
		boolean result = Reader.active(user.getReaderId());
		if(result) {
			user.setReaderFlag(1);
			sqlManager().updateTemplateById(user);
		}else {
			throw new LresException("10001", "借书证激活失败");
		}
	}

	@Override
	public void add(LresUser obj) {
		obj.setId(UserUtil.getUserId());
		LresUser user = sqlManager().single(LresUser.class, UserUtil.getUserId());
		if(null == user) {
			this.fillBasePro(obj);
			sqlManager().insert(obj);
		}
	}

	@Override
	public void update(LresUser obj) {
		// TODO Auto-generated method stub

	}

	@Override
	@Transactional
	public void delete(String id) {
		LresUser user = sqlManager().single(LresUser.class, id);
		if(null != user) {
			Reader.disable(user.getReaderId());
			Map<String,Object> params = new HashMap<>();
			params.put("userId", user.getId());
			sqlManager().update("lresUser.deleteUserLRecord", params);
			sqlManager().update("lresUser.deleteUserQRecord", params);
			sqlManager().update("lresUser.deleteUser", params);
		}
	}

	@Override
	public List<BigTingVo> bigThing() {
		Map<String,String> params = new HashMap<String,String>();
		params.put("userId", UserUtil.getUserId());
		params.put("tid", UserUtil.getTid());
		List<BigTingVo> resultVo = sqlManager().select("lresUser.bigThing", BigTingVo.class, params);
		return resultVo;
	}

	@Override
	public List<List<String>> excelList(Map<String, String> params) {
		params.put("tid", UserUtil.getTid());
		List<UserVo> list = sqlManager().select("lresUser.excelList", UserVo.class, params);
		List<List<String>> rowData = new ArrayList<>();
		list.stream().forEach(m->{
			String sexStr = "";
			String readerFlag = "";
			String isPass = "";
			String testType = "";
			String qContext = null == m.getQname()?"":m.getQname();
			if(null != m.getSex()) {
				switch (m.getSex()) {
				case 0:
					sexStr = "男";
					break;
				case 1:
					sexStr = "女";
					break;
				}
			}
			if(null != m.getReaderFlag()) {
				switch (m.getReaderFlag()) {
				case 3:
					readerFlag = "停借";
					break;
				case 2:
					readerFlag = "挂失";
					break;
				case 1:
					readerFlag = "正常";
					break;
				case 0:
					readerFlag = "注销";
					break;
				}
			}
			
			if(null != m.getIsPass()) {
				switch (m.getIsPass()) {
				case 0:
					isPass = "未通过";
					break;
				case 1:
					isPass = "已通过";
					break;
				}
			}
			
			if(null != m.getTestType()) {
				switch (m.getTestType()) {
				case 1:
					testType = "（普通），"+m.getScore()+"分，";
					break;
				case 2:
					testType = "（模拟），"+m.getScore()+"分，";
					break;
				case 3:
					testType = "（闯关），第"+m.getScore()+"关，";
					break;
				}
			}
			
			qContext = qContext +testType +isPass;
			if(params.get("needqq").equals("1")) {
				rowData.add(Arrays.asList(new String[] {m.getReaderId(),m.getBarcode(),m.getIdcard(),m.getCampusName(),m.getDept(),m.getName(),sexStr,m.getReaderTypename(),m.getQqcard(),m.getMobile(),m.getEmail(),readerFlag,m.getQtime(),qContext}));
			}else {
				rowData.add(Arrays.asList(new String[] {m.getReaderId(),m.getBarcode(),m.getIdcard(),m.getCampusName(),m.getDept(),m.getName(),sexStr,m.getReaderTypename(),readerFlag,m.getQtime(),qContext}));
			}
		});
		return rowData;
	}

	@Override
	public void bindUserCampus(JSONObject params) {
		LresUser user = new LresUser();
		user.setId(UserUtil.getUserId());
		user.setCampusId(params.getString("campusId"));
		user.setQqcard(params.getString("qqcard"));
		user.setEmail(params.getString("email"));
		user.setMobile(params.getString("mobile"));
		sqlManager().updateTemplateById(user);
	}

	@Override
	public void newStuTemplate(String path) {
		this.download(path, getResponse());
	}

	@Override
	public void syncStuTemplate(String path) {
		this.download(path, getResponse());
	}

	@Override
	@Transactional
	public JSONObject importNewStu(MultipartFile file) throws IOException {
		JSONObject result = new JSONObject();
		result.put("success", true);
		List<Map<Integer, String>> dataList = EasyExcel.read(file.getInputStream()).sheet().doReadSync();
		//校区判断
		List<CampusVo> campuss= sqlManager().select("lresCampus.queryList", CampusVo.class);
		Map<String, String> campusMap = new HashMap<>();
		for (CampusVo campus : campuss) {
			campusMap.put(campus.getName(), campus.getId());
		}
		//读者类型
		List<LresReadertype> readertypes = sqlManager().query(LresReadertype.class).select();
		Map<String, String> readertypesMap = new HashMap<>();
		for (LresReadertype type : readertypes) {
			readertypesMap.put(type.getReadname(), type.getReadtype());
		}
		// 判断重复数据
		List<LresUser> oldlist = sqlManager().query(LresUser.class).select();
		Map<String, String> oldDataMap = new HashMap<>();
		for (LresUser user : oldlist) {
			String key = user.getIdcard();
			oldDataMap.put(key, key);
		}
		List<LresUser> saveList = new ArrayList<>();
		List<JSONObject> authusers = new ArrayList<>();
		Map<Integer,String> errMap = new HashMap<>();
		for (int i = 0;i<dataList.size();i++) {
			Map<Integer, String> map = dataList.get(i);
			int k = i+1;
			if(StringUtils.isBlank(map.get(0))) {
				errMap.put(k, "姓名不能为空");
				continue;
			}else if(StringUtils.isBlank(map.get(1))) {
				errMap.put(k, "身份证不能为空");
				continue;
			}else if(StringUtils.isBlank(map.get(2))) {
				errMap.put(k, "校区不能为空");
				continue;
			}else if(StringUtils.isBlank(map.get(3))) {
				errMap.put(k, "用户对象不能为空");
				continue;
			}
			// 是否正确的校区
			String campusId = campusMap.get(map.get(2));
			if (null == campusId) {
				errMap.put(k, "校区名称不存在");
				continue;
			}
			// 重复数据
			String key = map.get(1);
			String existKey = oldDataMap.get(key);
			if (null != existKey) {
				errMap.put(k, "重复的数据");
				continue;
			}else {
				oldDataMap.put(key, key);
			}
			// 读者类型
			String typeCode = readertypesMap.get(map.get(3));
			if (null == typeCode) {
				errMap.put(k, "用户对象不存在");
				continue;
			}
			LresUser user = new LresUser();
			user.setId(StringOpt.produceUUID());
			user.setCampusId(campusId);
			user.setIdcard(map.get(1));
			user.setName(map.get(0));
			user.setReaderType(typeCode);
			user.setCreateTime(new Date());
			user.setCreateId(LoginUser.getUserID());
			user.setTid("ZH0001");
			user.setIsDelete(1);
			JSONObject authuser = new JSONObject();
			authuser.put("ID", user.getId());
			authuser.put("IDCARD", user.getIdcard());
			authuser.put("NAME", user.getName());
			authuser.put("TID", "ZH0001");
			authusers.add(authuser);
			saveList.add(user);
		}
		if (errMap.size() > 0) {
			result.put("success", false);
			result.put("message", errMap);
		}
		if (saveList.size() > 0) {
			sqlManager().insertBatch(LresUser.class, saveList);
			//同步到AUTH库，远程调用
			String url=RequestHelper.getAppRestUrl("auth");
			url+="User/batchSave";
			Map<String,String> params = new HashMap<>();
			params.put("data", JSONObject.toJSONString(authusers));
			String restout = HttpClientUtil.doPost(url,params);
			log.info("auth user sync one==============="+restout);
		}
		return result;
	}

	@Override
	@Transactional
	public JSONObject importSyncStu(MultipartFile file) throws IOException {
		JSONObject result = new JSONObject();
		result.put("success", true);
		List<Map<Integer, String>> dataList = EasyExcel.read(file.getInputStream()).sheet().doReadSync();
		List<LresUser> oldlist = sqlManager().query(LresUser.class).select();
		List<LresUser> saveList = new ArrayList<>();
		List<JSONObject> authusers = new ArrayList<>();
		Map<String, LresUser> oldDataMap = new HashMap<>();
		for (LresUser user : oldlist) {
			String key = user.getIdcard();
			oldDataMap.put(key, user);
		}
		Map<Integer,String> errMap = new HashMap<>();
		for (int i = 0;i<dataList.size();i++) {
			Map<Integer, String> map = dataList.get(i);
			int k = i+1;
			if(StringUtils.isBlank(map.get(0))) {
				errMap.put(k, "学号不能为空");
				continue;
			}else if(StringUtils.isBlank(map.get(1))) {
				errMap.put(k, "身份证不能为空");
				continue;
			}
			// 重复数据
			String key = map.get(1);
			LresUser existUser = oldDataMap.get(key);
			if (null == existUser) {
				errMap.put(k, "不存在的用户");
				continue;
			}
			JSONObject obj = Reader.userinfo(map.get(0));
			if(null == obj) {
				errMap.put(k, "不存在的OPAC用户");
				continue;
			}
			existUser.setBarcode(obj.getString("BARCODE"));
			existUser.setDept(obj.getString("DEPT"));
			existUser.setReaderId(obj.getString("ID"));
			existUser.setName(obj.getString("NAME"));
			existUser.setGrade(obj.getString("NOWGRADE"));
			existUser.setSex(Integer.parseInt(obj.getString("SEX")));
			existUser.setReaderType(obj.getString("USERTYPE"));
			existUser.setReaderFlag(Integer.parseInt(obj.getString("READERFLAG")));
			//激活图书证
			if(null != existUser.getIspass() && existUser.getIspass().equals("1")) {
				if(null != existUser.getReaderFlag() && !existUser.getReaderFlag().equals(1)) {
					boolean activeResult = Reader.active(existUser.getReaderId());
					if(activeResult) {
						existUser.setReaderFlag(1);
					}
				}
			}
			JSONObject authuser = new JSONObject();
			authuser.put("ID", existUser.getId());
			authuser.put("IDCARD", existUser.getIdcard());
			authuser.put("NAME", existUser.getName());
			authuser.put("LOGINNAME", existUser.getReaderId());
			authusers.add(authuser);
			saveList.add(existUser);
		}
		if (saveList.size() > 0) {
			sqlManager().updateBatchTemplateById(LresUser.class, saveList);
			//同步到AUTH库，远程调用
			String url=RequestHelper.getAppRestUrl("auth");
			url+="User/batchSave";
			Map<String,String> params = new HashMap<>();
			params.put("data", JSONObject.toJSONString(authusers));
			HttpClientUtil.doPost(url,params);
		}
		if (errMap.size() > 0) {
			result.put("success", false);
			result.put("message", errMap);
		}
		return result;
	}

	@Override
	public LresUser userInfo() {
		LresUser lresuser = sqlManager().query(LresUser.class).andEq("ID", LoginUser.getUserID()).single();
		boolean addFlag = false;
		if(null == lresuser) {
			lresuser = new LresUser();
			addFlag = true;
		}
		JSONObject readerUser = Reader.userinfo(UserUtil.loginname());
		if(null != readerUser) {
			lresuser.setId(readerUser.getString("id"));
			lresuser.setReaderId(readerUser.getString("id"));
			lresuser.setBarcode(readerUser.getString("barcode"));
			lresuser.setName(readerUser.getString("name"));
			lresuser.setDept(readerUser.getString("dept"));
			lresuser.setGrade(readerUser.getString("nowgrade"));
			lresuser.setSex(Integer.valueOf(readerUser.getString("sex")));
			lresuser.setReaderType(readerUser.getString("usertype"));
			lresuser.setReaderFlag(Integer.valueOf(readerUser.getString("readerflag")));
			lresuser.setIdcard(readerUser.getString("idcard"));
			lresuser.setTid(UserUtil.getTid());
			if(addFlag) {
				sqlManager().insertTemplate(lresuser);
			}else {
				sqlManager().updateTemplateById(lresuser);
			}
		}
		if(null == lresuser.getFirstlogin()) {
			lresuser.setFirstlogin(DateTimeUtil.sysDateTimeStr());
			sqlManager().updateTemplateById(lresuser);
			lresuser.setFirstlogin(null);
		}
		lresuser.setIdcard(null);
		return lresuser;
	}

	@Override
	public List<JSONObject> unnormalStus() {
		List<JSONObject> result = sqlManager().select("lresUser.unnormalStus", JSONObject.class);
		return result;
	}
	
	

}
