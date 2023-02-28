package cn.com.angke.lres.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.beetl.sql.core.engine.PageQuery;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.somenew.action.PageOpt2;
import com.somenew.utils.StringOpt;

import cn.com.angke.lres.dto.QlevelDto;
import cn.com.angke.lres.dto.QresourceDto;
import cn.com.angke.lres.exception.LresException;
import cn.com.angke.lres.pojo.LresQlevel;
import cn.com.angke.lres.pojo.LresQrecord;
import cn.com.angke.lres.pojo.LresQresitem;
import cn.com.angke.lres.pojo.LresQresource;
import cn.com.angke.lres.pojo.LresQuestcount;
import cn.com.angke.lres.pojo.RQresClass;
import cn.com.angke.lres.service.BaseService;
import cn.com.angke.lres.service.QrecordService;
import cn.com.angke.lres.service.QresourceService;
import cn.com.angke.lres.service.QuestionService;
import cn.com.angke.lres.service.UserService;
import cn.com.angke.lres.vo.OptionVo;
import cn.com.angke.lres.vo.PageVo;
import cn.com.angke.lres.vo.QlevelVo;
import cn.com.angke.lres.vo.QresitemVo;
import cn.com.angke.lres.vo.QresourceUseVo;
import cn.com.angke.lres.vo.QresourceVo;
import cn.com.angke.lres.vo.QuestionUseVo;
import cn.com.angke.lres.vo.QuestionVo;
import cn.com.angke.util.DateTimeUtil;
import cn.com.angke.util.UserUtil;

@Service
public class QresourceServiceImpl extends BaseService implements QresourceService {
	@Autowired
	QuestionService questionService;
	@Autowired
	QrecordService qrecordService;
	@Autowired
	UserService userService;
	@Override
	public PageVo<QresourceVo> list(PageOpt2 pageDto) {
		PageQuery<QresourceVo> pageQuery = new PageQuery<QresourceVo>();
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
		PageQuery<QresourceVo> result = sqlManager().pageQuery("lresQresource.pageQueryList", QresourceVo.class, pageQuery);
		PageVo<QresourceVo> pageVo = new PageVo<QresourceVo>();
		List<QresourceVo> resultList = result.getList();
		pageVo.setSuccess(true);
		pageVo.setItems(resultList);
		pageVo.setTotal(result.getTotalRow());
		return pageVo;
	}
	
	@Override
	public QresourceVo findById(String id) {
		QresourceVo resVo = new QresourceVo();
		LresQresource res = sqlManager().single(LresQresource.class, id);
		BeanUtils.copyProperties(res, resVo);
		resVo.setValidStart(DateTimeUtil.formatDatetoString(res.getValidStart()));
		resVo.setValidEnd(DateTimeUtil.formatDatetoString(res.getValidEnd()));
		LresQresitem param = new LresQresitem();
		param.setQresId(id);
		if(resVo.getTestType().intValue() == 3) {
			List<QlevelVo> levelList = sqlManager().select("lresQlevel.queryListByQresId", QlevelVo.class, param);
			levelList.stream().forEach(m->{
				param.setLevelId(m.getId());
				List<QresitemVo> qList = sqlManager().select("lresQresitem.queryListByLevelId", QresitemVo.class, param);
				m.setItemList(qList);
			});
			resVo.setLevelList(levelList);
		}else {
			List<QresitemVo> list = sqlManager().select("lresQresitem.queryListByQresId", QresitemVo.class, param);
			List<RQresClass> classList = sqlManager().select("rQresClass.queryListByQresId", RQresClass.class, param);
			resVo.setItemList(list);
			resVo.setClassList(classList);
		}
		return resVo;
	}

	@Override
	@Transactional
	public JSONObject add(QresourceDto obj) throws Exception {
		JSONObject result = new JSONObject();
		result.put("success", true);
		LresQresource res = new LresQresource();
		BeanUtils.copyProperties(obj, res);
		String qresId = StringOpt.produceUUID();
		res.setId(qresId);
		res.setValidStart(DateTimeUtil.parseToDate(obj.getValidStart()));
		res.setValidEnd(DateTimeUtil.parseToDate(obj.getValidEnd()));
		this.fillBasePro(res);
		int isUse = res.getIsUse();
		if(isUse == 1 && !res.getTestType().equals(2)) {
			List<LresQresource> resList = sqlManager().select("lresQresource.queryByUse", LresQresource.class, res);
			if(null != resList && resList.size() > 0) {
				for(LresQresource m : resList) {
					String types = m.getUserType();
					String[] typeArr = types.split(",");
					String oldType = ","+ res.getUserType()+",";
					for(String type : typeArr) {
						type = "," +type + ",";
						if(oldType.contains(type)) {
							result.put("success", false);
							result.put("msg", "当前时间段存在使用的试卷");
							return result;
						}
					}
				}
			}
		}
		//放开试卷唯一启用验证
//		if(res.getIsUse().intValue() == 1) {
//			List<LresQresource> resList = excSQL().select("lresQresource.queryByUse", LresQresource.class, res);
//			if(null != resList && resList.size() > 0) {
//				excSQL().update("lresQresource.updateUseByCampus", res);
//			}
//		}
		sqlManager().insert(res);
		
		if(obj.getTestType().intValue() == 3) {
			//闯关试卷
			List<QlevelDto> levelList = obj.getLevelList();
			if(null != levelList && levelList.size() > 0) {
				List<LresQlevel> levList = new ArrayList<LresQlevel>();
				List<LresQresitem> litemList = new ArrayList<LresQresitem>();
				levelList.stream().forEach(m->{
					LresQlevel lq = new LresQlevel();
					BeanUtils.copyProperties(m, lq);
					String levelId = StringOpt.produceUUID();
					lq.setId(levelId);
					lq.setQresId(qresId);
					this.fillBasePro(lq);
					levList.add(lq);
					List<LresQresitem> litems = m.getItemList();
					for(LresQresitem l : litems) {
						l.setLevelId(levelId);
						l.setQresId(qresId);
						l.setId(StringOpt.produceUUID());
						this.fillBasePro(l);
						litemList.add(l);
					}
				});
				sqlManager().insertBatch(LresQlevel.class, levList);
				sqlManager().insertBatch(LresQresitem.class, litemList);
			}
		}else {
			//插入试卷试题题库分类
			List<RQresClass> classList = obj.getClassList();
			if(null != classList && classList.size() > 0) {
				classList.stream().forEach(m->{
					m.setId(StringOpt.produceUUID());
					m.setQresId(qresId);
					this.fillBasePro(m);
				});
				sqlManager().insertBatch(RQresClass.class,classList);
			}
			//插入试卷试题规则
			List<LresQresitem> itemList = obj.getItemList();
			if(null != itemList && itemList.size() > 0) {
				itemList.stream().forEach(m->{
					m.setId(StringOpt.produceUUID());
					m.setQresId(qresId);
					this.fillBasePro(m);
				});
				sqlManager().insertBatch(LresQresitem.class, itemList);
			}
		}
		return result;
	}

	@Override
	@Transactional
	public JSONObject update(QresourceDto obj) throws Exception {
		JSONObject result = new JSONObject();
		result.put("success", true);
		LresQresource res = new LresQresource();
		BeanUtils.copyProperties(obj, res);
		String qresId = res.getId();
		res.setValidStart(DateTimeUtil.parseToDate(obj.getValidStart()));
		res.setValidEnd(DateTimeUtil.parseToDate(obj.getValidEnd()));
//		if(res.getIsUse().intValue() == 1) {
//			List<LresQresource> resList = excSQL().select("lresQresource.queryByUse", LresQresource.class, res);
//			if(null != resList && resList.size() > 0) {
//				excSQL().update("lresQresource.updateUseByCampus", res);
//			}
//		}
		int isUse = res.getIsUse();
		if(isUse == 1 && !res.getTestType().equals(2)) {
			List<LresQresource> resList = sqlManager().select("lresQresource.queryByUse", LresQresource.class, res);
			if(null != resList && resList.size() > 0) {
				for(LresQresource m : resList) {
					String types = m.getUserType();
					String[] typeArr = types.split(",");
					String oldType = ","+ res.getUserType()+",";
					for(String type : typeArr) {
						type = "," +type + ",";
						if(oldType.contains(type)) {
							result.put("success", false);
							result.put("msg", "当前时间段存在使用的试卷");
							return result;
						}
					}
				}
			}
		}
		sqlManager().updateTemplateById(res);
		if(obj.getTestType().intValue() == 3) {
			//更新闯关
			List<QlevelDto> levelList = obj.getLevelList();
			if(null != levelList && levelList.size() > 0) {
				List<LresQlevel> levList = new ArrayList<LresQlevel>();
				List<LresQresitem> litemList = new ArrayList<LresQresitem>();
				levelList.stream().forEach(m->{
					LresQlevel lq = new LresQlevel();
					BeanUtils.copyProperties(m, lq);
					String levId = StringOpt.produceUUID();
					lq.setId(levId);
					lq.setQresId(qresId);
					this.fillBasePro(lq);
					levList.add(lq);
					List<LresQresitem> litems = m.getItemList();
					litems.stream().forEach(l->{
						l.setLevelId(levId);
						l.setQresId(qresId);
						l.setId(StringOpt.produceUUID());
						this.fillBasePro(l);
						litemList.add(l);
					});
				});
				LresQlevel lparam = new LresQlevel();
				lparam.setQresId(qresId);
				sqlManager().update("lresQlevel.deleteTrueByQresId", lparam);
				LresQresitem param = new LresQresitem();
				param.setQresId(qresId);
				sqlManager().update("lresQresitem.deleteTrueByQresId", param);
				sqlManager().insertBatch(LresQlevel.class, levList);
				sqlManager().insertBatch(LresQresitem.class, litemList);
			}
		}else {
			//更新分类
			List<RQresClass> classList = obj.getClassList();
			if(null != classList && classList.size() > 0) {
				classList.stream().forEach(m->{
					m.setId(StringOpt.produceUUID());
					m.setQresId(qresId);
					fillBasePro(m);
				});
				RQresClass param = new RQresClass();
				param.setQresId(qresId);
				sqlManager().update("rQresClass.deleteTrueByQresId", param);
				sqlManager().insertBatch(RQresClass.class,classList);
			}
			
			//更新试题规则
			List<LresQresitem> itemList = obj.getItemList();
			if(null != itemList && itemList.size() > 0) {
				itemList.stream().forEach(m->{
					m.setId(StringOpt.produceUUID());
					m.setQresId(qresId);
					fillBasePro(m);
				});
				LresQresitem param = new LresQresitem();
				param.setQresId(qresId);
				sqlManager().update("lresQresitem.deleteTrueByQresId", param);
				sqlManager().insertBatch(LresQresitem.class, itemList);
			}
		}
		return result;
	}

	@Override
	@Transactional
	public void delete(String id) {
		LresQresource res = new LresQresource();
		res.setId(id);
		res.setIsDelete(0);
		sqlManager().updateTemplateById(res);
		RQresClass rParam = new RQresClass();
		rParam.setQresId(id);
		sqlManager().update("lresQresitem.deleteByQresId", rParam);
		LresQresitem param = new LresQresitem();
		param.setQresId(id);
		sqlManager().update("lresQresitem.deleteByQresId", param);
		LresQlevel lparam = new LresQlevel();
		lparam.setQresId(id);
		sqlManager().update("lresQlevel.deleteByQresId", lparam);
	}

	/**   
	 * <p>Title: queryUseQresByCampusId</p>   
	 * <p>Description: 生成试卷给用户使用，生成规则：
	 * 	闯关考试与普通考试不同
	 * </p>   
	 * @param res
	 * @return
	 * @throws LresException   
	 * @see cn.com.angke.lres.service.QresourceService#queryUseQresByCampusId(cn.com.angke.lres.pojo.LresQresource)   
	 */
	@Override
	public List<QresourceUseVo> queryUseQresByCampusId(LresQresource res) throws LresException{
		List<QresourceUseVo> outList = new ArrayList<QresourceUseVo>();
		//查询可以使用的试卷（一个类型只有一份）
		List<LresQresource> resList = sqlManager().select("lresQresource.queryByMobileUse", LresQresource.class, res);
		List<Integer> typeList = new ArrayList<>();
		if(null != resList && resList.size() > 0) {
			for(LresQresource resUse : resList) {
				if(typeList.contains(resUse.getTestType()) && !resUse.getTestType().equals(2)) {
					continue;
				}else {
					typeList.add(resUse.getTestType());
				}
				QresourceUseVo resVo = new QresourceUseVo();
				BeanUtils.copyProperties(resUse, resVo);
				String startDate = DateTimeUtil.formatDatetoString(resUse.getValidStart());
				String endDate = DateTimeUtil.formatDatetoString(resUse.getValidEnd());
				resVo.setValidStart(startDate);
				resVo.setValidEnd(endDate);
				//闯关考试
				if(resUse.getTestType().intValue() == 3) {
					resVo = this.fillLevelResult(resVo);
				}else {
					//普通考试
					//查询试卷题库分类
					Map<String,String> param = new HashMap<String,String>();
					param.put("qresId", resUse.getId());
					List<RQresClass> classList = sqlManager().select("rQresClass.queryListByQresId", RQresClass.class, param);
					String classIds = classList.stream().map(n->n.getClassId()).collect(Collectors.joining(","));
					resVo = fillItemResult(resVo,classIds,null);
				}
				outList.add(resVo);
			}
		}else {
			throw new LresException("10001", "没有可用的考卷");
		}
		
		return outList;
	}

	/**   
	 * @Title: fillLevelResult   
	 * @Description: TODO(生成闯关考试试卷)   
	 * @param: @param resVo
	 * @param: @return      
	 * @return: QresourceUseVo      
	 * @throws   
	 */  
	private QresourceUseVo fillLevelResult(QresourceUseVo resVo) {
		LresQlevel lparam = new LresQlevel();
		lparam.setQresId(resVo.getId());
		List<QlevelVo> levelList = sqlManager().select("lresQlevel.queryListByQresId", QlevelVo.class, lparam);
		levelList.stream().forEach(m->{
			QresourceUseVo useVo = fillItemResult(resVo,m.getClassId(),m.getId());
			m.setQuestList(useVo.getQuestionList());
		});
		resVo.setQuestionList(null);
		resVo.setLevelList(levelList);
		resVo.setScore(levelList.size());
		return resVo;
	}

	/**   
	 * @Title: fillItemResult   
	 * @Description: TODO(生成普通考试试卷)   
	 * @param: @param resVo
	 * @param: @param classIds
	 * @param: @return      
	 * @return: QresourceUseVo      
	 * @throws   
	 */  
	private QresourceUseVo fillItemResult(QresourceUseVo resVo,String classIds,String levelId) {
		LresQresitem param = new LresQresitem();
		param.setQresId(resVo.getId());
		param.setLevelId(levelId);
		List<LresQresitem> itemList = sqlManager().select("lresQresitem.queryListByQresId", LresQresitem.class, param);
		List<QuestionUseVo> resultList = new ArrayList<QuestionUseVo>();
		int totalScore = 0;
		if(null != itemList && itemList.size() > 0) {
			for(LresQresitem item : itemList) {
				int currentScore = null == item.getScore() ? 0 : item.getScore();
				totalScore = totalScore + item.getQuesNum()*currentScore;
				int total = item.getQuesNum();
				//必考题
				List<QuestionUseVo> list = questionService.listByQresitem(item,classIds,true);
				resultList.addAll(list);
				int other = total-list.size();
				//如果必考题不满足提目数量,从剩余题目中随机补足
				if(other > 0) {
					item.setQuesNum(other);
					List<QuestionUseVo> otherList = questionService.listByQresitem(item,classIds,false);
					resultList.addAll(otherList);
				}
			}
		}
		//将选项封装到题目中
		resultList.stream().forEach(m->{
			String ids = m.getOptionIds();
			if(null != ids && ids.trim().length() > 0) {
				String[] arrIds = ids.split(",");
				String[] items = m.getOptionStr().split("-Q-");
				List<OptionVo> list = new ArrayList<OptionVo>();
				for(int i = 0;i<arrIds.length;i++) {
					OptionVo vo = new OptionVo();
					vo.setId(arrIds[i]);
					vo.setOptionItem(items[i]);
					vo.setQuestId(m.getId());
					list.add(vo);
				}
				m.setOptionList(list);
			}
		});
		resVo.setQuestionList(resultList);
		resVo.setScore(totalScore);
		return resVo;
	}

	@Override
	public boolean optionIsTrue(String questId, String optionIds) {
		boolean result = false;
		QuestionVo vo = questionService.findById(questId);
		if(vo.getQuesType().intValue() == 3) {
			result = vo.getIsTrue().toString().equals(optionIds);
		}else {
			List<OptionVo> options = vo.getOptionList();
			String trueIds = options.stream().filter(m->m.getIsTrue().equals(1)).map(m->m.getId()).collect(Collectors.joining(","));
			result = trueIds.equals(optionIds);
		}
		LresQuestcount count = new LresQuestcount();
		count.setQuestId(questId);
		List<LresQuestcount> countVoList = sqlManager().select("lresQuestcount.queryByQuestId", LresQuestcount.class,count);
		count.setId(countVoList.get(0).getId());
		count.setUseNum(countVoList.get(0).getUseNum()+1);
		if(result) {
			count.setPassNum(countVoList.get(0).getPassNum()+1);
		}
		sqlManager().updateTemplateById(count);
		return result;
	}
	
	@Override
	public boolean optionIsTrue(String questId, String optionIds,QuestionVo vo) {
		boolean result = false;
		if(vo.getQuesType().intValue() == 3) {
			result = vo.getIsTrue().toString().equals(optionIds);
		}else {
			List<OptionVo> options = vo.getOptionList();
			String trueIds = options.stream().filter(m->m.getIsTrue().equals(1)).map(m->m.getId()).collect(Collectors.joining(","));
			result = trueIds.equals(optionIds);
		}
		return result;
	}

//这个方法只能按顺序匹配，顺序不对就不行了	
//	@Override
//	public JSONObject optionResultAna(String questId, String optionIds) {
//		boolean result = false;
//		QuestionVo vo = questionService.findById(questId);
//		if(vo.getQuesType().intValue() == 3) {
//			result = vo.getIsTrue().toString().equals(optionIds);
//		}else {
//			List<OptionVo> options = vo.getOptionList();
//			String trueIds = options.stream().filter(m->m.getIsTrue().equals(1)).map(m->m.getId()).collect(Collectors.joining(","));
//			result = trueIds.equals(optionIds);
//		}
//		JSONObject obj = new JSONObject();
//		obj.put("result", result);
//		obj.put("analy", vo.getQuesAnaly());
//		return obj;
//	}

	@Override
	public JSONObject optionResultAna(String questId, String optionIds) {
		boolean result = false;
		QuestionVo vo = questionService.findById(questId);
		if(vo.getQuesType().intValue() == 3) {
			result = vo.getIsTrue().toString().equals(optionIds);
		}else {
			List<OptionVo> options = vo.getOptionList();
			String trueIds = options.stream().filter(m->m.getIsTrue().equals(1)).map(m->m.getId()).collect(Collectors.joining(","));
			List<String> trueList = Arrays.asList(trueIds.split(","));
			List<String> myList = Arrays.asList(optionIds.split(","));			
			if(trueList.size() == myList.size()) {
				result = true;
				for(int i=0;i<myList.size();i++) {
					if(!trueList.contains(myList.get(i))  ) {
						result = false;
						break;
					}
				}				
			}
		}
		JSONObject obj = new JSONObject();
		obj.put("result", result);
		obj.put("analy", vo.getQuesAnaly());
		return obj;
	}
	
	@Override
	public JSONObject trueResultAna(String questId) {
		QuestionVo vo = questionService.findById(questId);
		JSONObject obj = new JSONObject();
		if(vo.getQuesType().intValue() == 3) {
			obj.put("trueIds", vo.getIsTrue().toString());
		}else {
			List<OptionVo> options = vo.getOptionList();
			String trueIds = options.stream().filter(m->m.getIsTrue().equals(1)).map(m->m.getId()).collect(Collectors.joining(","));
			obj.put("trueIds", trueIds);
		}
		obj.put("analy", vo.getQuesAnaly());
		return obj;
	}

	@Override
	@Transactional
	public JSONObject checkResultList(String id,List<JSONObject> questList) {
		JSONObject resultJ = new JSONObject();
		LresQresource qVo = sqlManager().single(LresQresource.class, id);
		List<LresQuestcount> updateList = new ArrayList<>();
		int haveScore = 0;
		for(JSONObject m : questList) {
			String questId = m.getString("questId");
			String optionIds = m.getString("optionIds");
			int score = m.getInteger("score");
			QuestionVo vo = questionService.findById(questId);
			boolean result = optionIsTrue(questId, optionIds,vo);
			LresQuestcount count = new LresQuestcount();
			count.setQuestId(questId);
			List<LresQuestcount> countVoList = sqlManager().select("lresQuestcount.queryByQuestId", LresQuestcount.class,count);
			count.setId(countVoList.get(0).getId());
			count.setUseNum(countVoList.get(0).getUseNum()+1);
			if(result) {
				haveScore = haveScore + score;
				count.setPassNum(countVoList.get(0).getPassNum()+1);
			}
			updateList.add(count);
		}
		boolean active = false;
		//如果是正式考试，更新试题使用次数，通过数
		if(qVo.getTestType().intValue() == 1) {
			active = true;
			sqlManager().updateBatchTemplateById(LresQuestcount.class, updateList);
		}
		if(haveScore >= qVo.getPassScore().intValue()) {
			resultJ.put("isPass", true);
			resultJ.put("sumScore", haveScore);
		}else {
			resultJ.put("isPass", false);
			resultJ.put("sumScore", haveScore);
		}
		//保存考试记录
		LresQrecord dto = new LresQrecord();
		dto.setUserId(UserUtil.getUserId());
		dto.setResId(id);
		dto.setIsPass(resultJ.getBoolean("isPass")?1:0);
		dto.setScore(resultJ.getIntValue("sumScore"));
//		dto.setId(StringOpt.produceUUID());
		fillBasePro(dto);
		qrecordService.saveQrecord(dto,active);
		return resultJ;
	}

	@Override
	@Transactional
	public JSONObject checkLevelResultList(String levelId,List<JSONObject> questList) {
		JSONObject resultJ = new JSONObject();
		LresQlevel qVo = sqlManager().single(LresQlevel.class, levelId);
		LresQresource resVo = sqlManager().single(LresQresource.class, qVo.getQresId());
		boolean result = true;
//		List<LresQuestcount> updateList = new ArrayList<>();
		for(JSONObject m : questList) {
			String questId = m.getString("questId");
			String optionIds = m.getString("optionIds");
			QuestionVo vo = questionService.findById(questId);
			boolean v = optionIsTrue(questId, optionIds,vo);
//			LresQuestcount count = new LresQuestcount();
//			count.setQuestId(questId);
//			List<LresQuestcount> countVoList = excSQL().select("lresQuestcount.queryByQuestId", LresQuestcount.class,count);
//			count.setId(countVoList.get(0).getId());
//			count.setUseNum(countVoList.get(0).getUseNum()+1);
			if(!v) {
				result = false;
			}else {
//				count.setPassNum(countVoList.get(0).getPassNum()+1);
			}
//			updateList.add(count);
		}
		//更新试题使用次数，通过数
//		excSQL().updateBatchTemplateById(LresQuestcount.class, updateList);
		resultJ.put("active", false);
		if(result) {
			resultJ.put("isPass", true);
			if(resVo.getPassScore() <= qVo.getLevelNum()) {
				resultJ.put("active", true);
			}
		}else {
			resultJ.put("isPass", false);
		}
		//判断已通关的关卡，玩的是已通关关卡，不做记录
		LresQrecord record = qrecordService.findQrecord(qVo.getQresId());
		if(null !=record && null != record.getId()) {
			if(record.getIsPass().intValue()==1 || qVo.getLevelNum().intValue() < record.getLevel().intValue()) {
				return resultJ;
			}
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		    String ds1 = sdf.format(record.getCreateTime());
		    String ds2 = sdf.format(new Date());
		    if(ds1.equals(ds2)){
				//修改考试记录
				record.setIsPass(resultJ.getBoolean("active")?1:0);
				record.setLevel(qVo.getLevelNum());
				record.setPassLevel(resultJ.getBoolean("isPass")?1:0);
			}else {
				//保存考试记录
				record = new LresQrecord();
				record.setUserId(UserUtil.getUserId());
				record.setResId(qVo.getQresId());
				record.setIsPass(resultJ.getBoolean("active")?1:0);
				record.setLevel(qVo.getLevelNum());
				record.setPassLevel(resultJ.getBoolean("isPass")?1:0);
				fillBasePro(record);
			}
		}else {
			//保存考试记录
			record = new LresQrecord();
			record.setUserId(UserUtil.getUserId());
			record.setResId(qVo.getQresId());
			record.setIsPass(resultJ.getBoolean("active")?1:0);
			record.setLevel(qVo.getLevelNum());
			record.setPassLevel(resultJ.getBoolean("isPass")?1:0);
			fillBasePro(record);
		}
		qrecordService.saveQrecord(record,true);
		return resultJ;
	}

	@Override
	@Transactional
	public JSONObject checkResultListAna(String id, List<JSONObject> questList) {
		JSONObject resultJ = new JSONObject();
		LresQresource qVo = sqlManager().single(LresQresource.class, id);
		List<LresQuestcount> updateList = new ArrayList<>();
		List<JSONObject> errorAna = new ArrayList<JSONObject>();
		int haveScore = 0;
		for(JSONObject m : questList) {
			String questId = m.getString("questId");
			String optionIds = m.getString("optionIds");
			int score = m.getInteger("score");
			QuestionVo vo = questionService.findById(questId);
//			boolean result = optionIsTrue(questId, optionIds, vo);
			boolean result = false;
			String trueIds = "";
			if(vo.getQuesType().intValue() == 3) {
				result = vo.getIsTrue().toString().equals(optionIds);
			}else {
				List<OptionVo> options = vo.getOptionList();
				trueIds = options.stream().filter(o->o.getIsTrue().equals(1)).map(o->o.getId()).collect(Collectors.joining(","));
				result = trueIds.equals(optionIds);
			}
			LresQuestcount count = new LresQuestcount();
			count.setQuestId(questId);
			List<LresQuestcount> countVoList = sqlManager().select("lresQuestcount.queryByQuestId", LresQuestcount.class,count);
			count.setId(countVoList.get(0).getId());
			count.setUseNum(countVoList.get(0).getUseNum()+1);
			if(result) {
				haveScore = haveScore + score;
				count.setPassNum(countVoList.get(0).getPassNum()+1);
			}else {
				JSONObject jsonObj = new JSONObject();
				jsonObj.put("id", vo.getId());
				jsonObj.put("quesType", vo.getQuesType());
				jsonObj.put("quesTitle", vo.getQuesTitle());
				jsonObj.put("options", vo.getOptionList());
				jsonObj.put("fileUrl", vo.getFileUrl());
				jsonObj.put("isTrue", vo.getIsTrue());
				jsonObj.put("trueIds", trueIds);
				jsonObj.put("chooseIds", optionIds);
				jsonObj.put("quesAnaly", vo.getQuesAnaly());
				errorAna.add(jsonObj);
			}
			updateList.add(count);
		}
		boolean active = false;
		//如果是正式考试，更新试题使用次数，通过数
		if(qVo.getTestType().intValue() == 1) {
			active = true;
			sqlManager().updateBatchTemplateById(LresQuestcount.class, updateList);
		}
		if(haveScore >= qVo.getPassScore().intValue()) {
			resultJ.put("isPass", true);
			resultJ.put("sumScore", haveScore);
		}else {
			resultJ.put("isPass", false);
			resultJ.put("sumScore", haveScore);
		}
		resultJ.put("errorItem", errorAna);
		//保存考试记录
		LresQrecord dto = new LresQrecord();
		dto.setUserId(UserUtil.getUserId());
		dto.setResId(id);
		dto.setIsPass(resultJ.getBoolean("isPass")?1:0);
		dto.setScore(resultJ.getIntValue("sumScore"));
//		dto.setId(StringOpt.produceUUID());
		fillBasePro(dto);
		qrecordService.saveQrecord(dto,active);
		return resultJ;
	}
	
}
