sample
===
* 注释

	select #use("cols")# from LRES_QUESTION  where  #use("condition")#

cols
===
	ID,CLASS_ID,QUES_TITLE,QUES_TYPE,QUES_ANALY,IS_USE,IS_TRUE,FILE_URL,CREATE_ID,CREATE_TIME,IS_DELETE,TID

updateSample
===
	
	ID=#id#,CLASS_ID=#classId#,QUES_TITLE=#quesTitle#,QUES_TYPE=#quesType#,QUES_ANALY=#quesAnaly#,IS_USE=#isUse#,IS_TRUE=#isTrue#,FILE_URL=#fileUrl#,CREATE_ID=#createId#,CREATE_TIME=#createTime#,IS_DELETE=#isDelete#,TID=#tid#

condition
===

	1 = 1  
	@if(!isEmpty(id)){
	 and ID=#id#
	@}
	@if(!isEmpty(classId)){
	 and CLASS_ID=#classId#
	@}
	@if(!isEmpty(quesTitle)){
	 and QUES_TITLE=#quesTitle#
	@}
	@if(!isEmpty(quesType)){
	 and QUES_TYPE=#quesType#
	@}
	@if(!isEmpty(quesAnaly)){
	 and QUES_ANALY=#quesAnaly#
	@}
	@if(!isEmpty(isUse)){
	 and IS_USE=#isUse#
	@}
	@if(!isEmpty(isTrue)){
	 and IS_TRUE=#isTrue#
	@}
	@if(!isEmpty(fileUrl)){
	 and FILE_URL=#fileUrl#
	@}
	@if(!isEmpty(createId)){
	 and CREATE_ID=#createId#
	@}
	@if(!isEmpty(createTime)){
	 and CREATE_TIME=#createTime#
	@}
	@if(!isEmpty(isDelete)){
	 and IS_DELETE=#isDelete#
	@}
	@if(!isEmpty(tid)){
	 and TID=#tid#
	@}
	
pageQueryList
===
	select 
	@pageTag(){
		t5.*
	@}
	from (SELECT t1.*,t3.`NAME` class_str,GROUP_CONCAT(t2.OPTION_ITEM  separator '|') option_str,GROUP_CONCAT(IF(t2.IS_TRUE=1,t2.OPTION_ITEM,NULL)  separator '|') true_str from LRES_QUESTION t1
	left join LRES_QOPTION t2 on t1.id = t2.QUEST_ID 
	left join LRES_QUESTCLASS t3 on t1.CLASS_ID = t3.ID 
	where t1.is_delete = 1 and t1.TID=#tid#
	@if(!isEmpty(quesType)){
	 and t1.QUES_TYPE=#quesType#
	@}
	@if(!isEmpty(classId)){
	 and t1.CLASS_ID=#classId#
	@}
	@if(!isEmpty(quesTitle)){
	 and t1.QUES_TITLE like CONCAT('%',#quesTitle#,'%')
	@}
	@if(!isEmpty(isUse)){
	 and IS_USE=#isUse#
	@}
 	GROUP BY t1.id) t5
 	order by t5.create_time desc
 	
excelList
===
	select 
		t5.*
	from (SELECT t1.*,t3.`NAME` class_str,GROUP_CONCAT(IF(t2.IS_TRUE=1,CONCAT('$T$',t2.OPTION_ITEM),t2.OPTION_ITEM) separator '|') option_str from LRES_QUESTION t1
	left join LRES_QOPTION t2 on t1.id = t2.QUEST_ID 
	left join LRES_QUESTCLASS t3 on t1.CLASS_ID = t3.ID 
	where t1.is_delete = 1 and t1.TID=#tid#
 	GROUP BY t1.id) t5

findById
===
	select ID,CLASS_ID,QUES_TITLE,QUES_TYPE,QUES_ANALY,IS_USE,IS_TRUE,FILE_URL from LRES_QUESTION where ID = #id#	
	
questionTypeCount
===
	select ques_type,count(id) num from LRES_QUESTION where LOCATE(class_id,#classIds#) > 0 and TID=#tid# and is_delete = 1 
	group by ques_type
	
deleteByIds
===
	delete from LRES_QUESTION where ID IN (
	@for(id in ids){
	    #id#  #text(idLP.last?"":"," )#
	@}
	)