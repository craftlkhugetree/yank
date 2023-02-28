package cn.com.angke.lres.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.pojo.LresUser;
import cn.com.angke.lres.vo.BigTingVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.UserVo;

public interface UserService {
	PageVo<UserVo> pageQuery(PageOpt2 pageDto);
	void acitveReader(String id);
	void add(LresUser obj);
	void update(LresUser obj);
	void delete(String id);
	List<BigTingVo> bigThing();
	List<List<String>> excelList(Map<String, String> params);
	void bindUserCampus(JSONObject params);
	void newStuTemplate(String path);
	void syncStuTemplate(String path);
	JSONObject importNewStu(MultipartFile file) throws IOException;
	JSONObject importSyncStu(MultipartFile file) throws IOException;
	LresUser userInfo();
	List<JSONObject> unnormalStus();
} 
