pageQueryList
===
	select 
	@pageTag(){
	t1.*,t2.`NAME` campusStr 
	@} 
	from LRES_QRESOURCE t1
	LEFT JOIN LRES_CAMPUS t2 on t1.CAMPUS_ID = t2.ID
	where t1.IS_DELETE = 1 and t1.TID=#tid#
	order by t1.create_time desc

	
queryMustUseByItem
===
	select *,RAND() as r,#score# as score from 	
	(SELECT t1.*,t3.`NAME` class_str,GROUP_CONCAT(t2.ID) option_ids,GROUP_CONCAT(t2.OPTION_ITEM separator '-Q-') option_str from LRES_QUESTION t1
	left join LRES_QOPTION t2 on t1.id = t2.QUEST_ID 
	left join LRES_QUESTCLASS t3 on t1.CLASS_ID = t3.ID 
	where t1.is_delete = 1 and t1.is_use = 1 and t1.TID=#tid#
	and LOCATE(t1.class_id,#classIds#) > 0 and t1.QUES_TYPE = #quesType#
	GROUP BY t1.id) t5
	ORDER BY r
	limit #quesNum#
	
queryAppendUseByItem
===
	select *,RAND() as r,#score# as score from 	
	(SELECT t1.*,t3.`NAME` class_str,GROUP_CONCAT(t2.ID) option_ids,GROUP_CONCAT(t2.OPTION_ITEM separator '-Q-') option_str from LRES_QUESTION t1
	left join LRES_QOPTION t2 on t1.id = t2.QUEST_ID 
	left join LRES_QUESTCLASS t3 on t1.CLASS_ID = t3.ID 
	where t1.is_delete = 1 and t1.is_use = 0 and t1.TID=#tid#
	and LOCATE(t1.class_id,#classIds#) > 0 and t1.QUES_TYPE = #quesType#
	GROUP BY t1.id) t5
	ORDER BY r
	limit #quesNum#
	
queryByUse
===
	select * from LRES_QRESOURCE where IS_DELETE = 1 
	and IS_USE=1 and CAMPUS_ID=#campusId# 
	and (
	(DATE(#validStart#) between DATE(VALID_START) and DATE(VALID_END)) 
	or (DATE(#validEnd#) between DATE(VALID_START) and DATE(VALID_END))
	or (DATE(VALID_START) between DATE(#validStart#) and DATE(#validEnd#))
	or (DATE(VALID_END) between DATE(#validStart#) and DATE(#validEnd#))
	)
	and TEST_TYPE !=2
	@if(!isEmpty(id)){
	 and ID!=#id#
	@}
	
queryByMobileUse
===
	select * from LRES_QRESOURCE where IS_DELETE = 1 and IS_USE=1 and CAMPUS_ID=#campusId# and LOCATE(','||#userType#||',', ','||USER_TYPE||',') > 0
	@if(!isEmpty(testType)){
	 and TEST_TYPE=#testType#
	@}
	and (DATE(now()) between DATE(VALID_START) and DATE(VALID_END))
	ORDER BY create_time desc
	
updateUseByCampus
===
	update LRES_QRESOURCE set IS_USE=0 where CAMPUS_ID=#campusId# and TEST_TYPE=#testType#	