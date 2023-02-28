package cn.com.angke.lres.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.beetl.sql.core.SQLReady;
import org.beetl.sql.core.engine.PageQuery;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;
import com.somenew.ids.client.LoginUser;
import com.somenew.utils.StringOpt;

import cn.com.angke.lres.dto.LresourceDto;
import cn.com.angke.lres.pojo.LresCampus;
import cn.com.angke.lres.pojo.LresLresource;
import cn.com.angke.lres.pojo.LresReadertype;
import cn.com.angke.lres.pojo.RLsourceCampus;
import cn.com.angke.lres.pojo.RLsourceReadtype;
import cn.com.angke.lres.pojo.RUserLearn;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.LresourceService;
import cn.com.angke.lres.vo.LresourceVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.util.UserUtil;

@Service
public class LresourceServiceImpl extends BaseService implements LresourceService {
//	private final static Logger log = LogManager.getLogger(LresourceServiceImpl.class);
	@Override
	public PageVo<LresourceVo> pageList(PageOpt2 pageDto) {
		PageQuery<LresourceVo> pageQuery = new PageQuery<LresourceVo>();
		JSONArray arrays = pageDto.getConditions();
		Map<String,Object> paras = new HashMap<String,Object>();
		paras.put("tid", UserUtil.getTid());
		if(null!=arrays && !arrays.isEmpty()) {
			arrays.stream().forEach(m->{
				JSONObject json = (JSONObject) m;
				paras.put(json.getString("property"), json.get("value"));
			});
		}
		Integer pageNum = pageDto.getStart()/pageDto.getPageSize()+1;
		pageQuery.setPageNumber(pageNum < 0?1:pageNum);
		pageQuery.setPageSize(pageDto.getPageSize()<1?10:pageDto.getPageSize());
		pageQuery.setParas(paras);
		PageQuery<LresourceVo> result = sqlManager().pageQuery("lresLresource.pageQueryList", LresourceVo.class, pageQuery);
		PageVo<LresourceVo> pageVo = new PageVo<LresourceVo>();
		List<LresourceVo> resultList = result.getList();
		resultList.stream().forEach(m->{
			String filepath = outPath() + m.getUrl();
			File file = new File(filepath);
			if(file.exists()) {
				m.setFileSize(file.length());
			}else {
				m.setFileSize(0l);
			}
		});
		pageVo.setSuccess(true);
		pageVo.setItems(resultList);
		pageVo.setTotal(result.getTotalRow());
		return pageVo;
	}

	@Override
	public JSONObject findById(String id) {
		Map<String,Object> paras = new HashMap<>();
		paras.put("id", id);
		JSONObject res = sqlManager().selectSingle("lresLresource.findById", paras, JSONObject.class);
		return res;
	}

	@Override
	@Transactional
	public void add(LresourceDto dto) {
		LresLresource obj = new LresLresource();
		BeanUtils.copyProperties(dto, obj);
		obj.setId(StringOpt.produceUUID());
		obj.setWatchCount(0);
		obj.setDownloadCount(0);
		this.fillBasePro(obj);
		long count = sqlManager().query(LresLresource.class).andEq("IS_DELETE", 1).count();
		obj.setLevelcode((int)count+1);
		sqlManager().insert(obj);
		List<LresCampus> campuss = dto.getCampuss();
		List<LresReadertype> readerTypes = dto.getReaderTypes();
		List<RLsourceCampus> rs = new ArrayList<>();
		List<RLsourceReadtype> rts = new ArrayList<>();
		for(LresCampus m : campuss) {
			RLsourceCampus rl = new RLsourceCampus();
			rl.setId(StringOpt.produceUUID());
			rl.setCampusid(m.getId());
			rl.setLearnsourceid(obj.getId());
			rs.add(rl);
		}
		for(LresReadertype m : readerTypes) {
			RLsourceReadtype rl = new RLsourceReadtype();
			rl.setId(StringOpt.produceUUID());
			rl.setReadertype(m.getReadtype());
			rl.setLearnsourceid(obj.getId());
			rts.add(rl);
		}
		sqlManager().insertBatch(RLsourceCampus.class, rs);
		sqlManager().insertBatch(RLsourceReadtype.class, rts);
	}

	@Override
	@Transactional
	public void update(LresourceDto dto) {
		LresLresource obj = new LresLresource();
		BeanUtils.copyProperties(dto, obj);
		sqlManager().updateTemplateById(obj);
		sqlManager().query(RLsourceCampus.class).andEq("LEARNSOURCEID", dto.getId()).delete();
		sqlManager().query(RLsourceReadtype.class).andEq("LEARNSOURCEID", dto.getId()).delete();
		List<LresCampus> campuss = dto.getCampuss();
		List<LresReadertype> readerTypes = dto.getReaderTypes();
		List<RLsourceCampus> rs = new ArrayList<>();
		List<RLsourceReadtype> rts = new ArrayList<>();
		for(LresCampus m : campuss) {
			RLsourceCampus rl = new RLsourceCampus();
			rl.setId(StringOpt.produceUUID());
			rl.setCampusid(m.getId());
			rl.setLearnsourceid(obj.getId());
			rs.add(rl);
		}
		for(LresReadertype m : readerTypes) {
			RLsourceReadtype rl = new RLsourceReadtype();
			rl.setId(StringOpt.produceUUID());
			rl.setReadertype(m.getReadtype());
			rl.setLearnsourceid(obj.getId());
			rts.add(rl);
		}
		sqlManager().insertBatch(RLsourceCampus.class, rs);
		sqlManager().insertBatch(RLsourceReadtype.class, rts);
	}

	@Override
	@Transactional
	public void delete(String id) {
		LresLresource res = new LresLresource();
		res.setId(id);
		res.setIsDelete(0);
		sqlManager().updateTemplateById(res);
		sqlManager().query(RLsourceCampus.class).andEq("LEARNSOURCEID", id).delete();
		sqlManager().query(RLsourceReadtype.class).andEq("LEARNSOURCEID", id).delete();
	}

	@Override
	public void saveWatchCount(String resId) {
		LresLresource res = sqlManager().single(LresLresource.class, resId);
		res.setWatchCount(res.getWatchCount()+1);
		res.setCreateTime(null);
		sqlManager().updateTemplateById(res);
	}

	@Override
	public void saveDownloadCount(String resId) {
		LresLresource res = sqlManager().single(LresLresource.class, resId);
		res.setDownloadCount(res.getDownloadCount()+1);
		res.setCreateTime(null);
		sqlManager().updateTemplateById(res);
	}

	@Override
	public PageVo<LresourceVo> findByName(String name) {
		PageQuery<LresourceVo> pageQuery = new PageQuery<LresourceVo>();
		Map<String,Object> paras = new HashMap<String,Object>();
		paras.put("tid", UserUtil.getTid());
		paras.put("name", name);
		pageQuery.setParas(paras);
		List<LresourceVo> resultList = sqlManager().select("lresLresource.queryList", LresourceVo.class, paras);
		PageVo<LresourceVo> pageVo = new PageVo<LresourceVo>();
		pageVo.setSuccess(true);
		pageVo.setItems(resultList);
		pageVo.setTotal((long)resultList.size());
		return pageVo;
	}

	@Override
	public LresourceVo findOneByName(String name,String fileType) {
		LresourceVo vo = null;
		Map<String,Object> paras = new HashMap<String,Object>();
		paras.put("tid", UserUtil.getTid());
		paras.put("name", name);
		paras.put("fileType", fileType);
		List<LresourceVo> resultList = sqlManager().select("lresLresource.findOneByName", LresourceVo.class, paras);
		if(null != resultList && resultList.size() > 0) {
			vo = resultList.get(0);
		}
		return vo;
	}

	@Override
	@Transactional
	public void changeLevelcode(Integer levelcode, String id) {
		SQLReady sql1 = new SQLReady("update LRES_LRESOURCE set LEVELCODE = LEVELCODE + 1 where LEVELCODE > ?",levelcode);
		sqlManager().executeUpdate(sql1);
		int currentCode = levelcode + 1;
		SQLReady sql2 = new SQLReady("update LRES_LRESOURCE set LEVELCODE = ? where ID = ?",currentCode,id);
		sqlManager().executeUpdate(sql2);
	}

	@Override
	public void saveStudyed(String id) {
		RUserLearn learn = new RUserLearn();
		learn.setId(StringOpt.produceUUID());
		learn.setUserid(LoginUser.getUserID());
		learn.setLsourceid(id);
		learn.setIsover("1");
		RUserLearn lout = sqlManager().query(RUserLearn.class).andEq("USERID", learn.getUserid()).andEq("LSOURCEID", learn.getLsourceid()).single();
		if(null == lout) {
			sqlManager().insert(learn);
		}
	}

	@Override
	public List<RUserLearn> userStudyed() {
		List<RUserLearn> list  = sqlManager().query(RUserLearn.class).andEq("USERID", LoginUser.getUserID()).select();
		return list;
	}

	@Override
	public List<LresLresource> list(String campusId,String readerType) {
		String sqlStr = "select t1.* from LRES_LRESOURCE t1 ";
			sqlStr+=	"left join R_LSOURCE_CAMPUS t2 on t1.ID = t2.LEARNSOURCEID ";
			sqlStr+=	"left join R_LSOURCE_READTYPE t3 on t1.ID = t3.LEARNSOURCEID ";
			sqlStr+=	"where t2.CAMPUSID = ? and t3.READERTYPE = ?";
		SQLReady sql = new SQLReady(sqlStr,campusId,readerType);
		List<LresLresource> list = sqlManager().execute(sql, LresLresource.class);
		return list;
	}

}
