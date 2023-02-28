sample
===
* 注释

	select #use("cols")# from LRES_QRESITEM  where  #use("condition")#

cols
===
	ID,QRES_ID,LEVEL_ID,QUES_TYPE,QUES_NUM,SCORE,CREATE_TIME,IS_DELETE,TID

updateSample
===
	
	ID=#id#,QRES_ID=#qresId#,LEVEL_ID=#levelId#,QUES_TYPE=#quesType#,QUES_NUM=#quesNum#,SCORE=#score#,CREATE_TIME=#createTime#,IS_DELETE=#isDelete#,TID=#tid#

condition
===

	1 = 1  
	@if(!isEmpty(id)){
	 and ID=#id#
	@}
	@if(!isEmpty(qresId)){
	 and QRES_ID=#qresId#
	@}
	@if(!isEmpty(levelId)){
	 and LEVEL_ID=#levelId#
	@}
	@if(!isEmpty(quesType)){
	 and QUES_TYPE=#quesType#
	@}
	@if(!isEmpty(quesNum)){
	 and QUES_NUM=#quesNum#
	@}
	@if(!isEmpty(score)){
	 and SCORE=#score#
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
	
queryListByQresId
===
	select ID,QRES_ID,QUES_TYPE,QUES_NUM,SCORE from LRES_QRESITEM where IS_DELETE = 1 and QRES_ID=#qresId# 
	@if(!isEmpty(levelId)){
	 and LEVEL_ID=#levelId#
	@}
	
queryListByLevelId
===
	select ID,QRES_ID,LEVEL_ID,QUES_TYPE,QUES_NUM,SCORE from LRES_QRESITEM where IS_DELETE = 1 and LEVEL_ID=#levelId#
	
deleteTrueByQresId
===
	delete from LRES_QRESITEM where QRES_ID=#qresId#
	
deleteByQresId
===
	update LRES_QRESITEM set IS_DELETE=0 where QRES_ID=#qresId#		