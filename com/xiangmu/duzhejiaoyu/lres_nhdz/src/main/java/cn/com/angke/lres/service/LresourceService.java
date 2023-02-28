package cn.com.angke.lres.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;

import cn.com.angke.lres.dto.LresourceDto;
import cn.com.angke.lres.pojo.LresLresource;
import cn.com.angke.lres.pojo.RUserLearn;
import cn.com.angke.lres.vo.LresourceVo;
import cn.com.angke.lres.vo.PageVo;

public interface LresourceService {
	PageVo<LresourceVo> pageList(PageOpt2 pageDto);
	List<LresLresource> list(String campusId,String readerType);
	JSONObject findById(String id);
	void add(LresourceDto dto);
	void update(LresourceDto dto);
	void delete(String id);
	void saveWatchCount(String resId);
	void saveDownloadCount(String resId);
	PageVo<LresourceVo> findByName(String name);
	LresourceVo findOneByName(String name, String fileType);
	void changeLevelcode(Integer levelcode,String id);
	void saveStudyed(String id);
	List<RUserLearn> userStudyed();
}
