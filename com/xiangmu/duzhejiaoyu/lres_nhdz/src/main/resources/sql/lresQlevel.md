sample
===
* 注释

	select #use("cols")# from LRES_QLEVEL  where  #use("condition")#

cols
===
	ID,QRES_ID,CLASS_ID,NEED_TIME,LEVEL_NUM,SCORE,PASS_SCORE,IS_DELETE,CREATE_TIME,TID

updateSample
===
	
	ID=#id#,QRES_ID=#qresId#,CLASS_ID=#classId#,NEED_TIME=#needTime#,LEVEL_NUM=#levelNum#,SCORE=#score#,PASS_SCORE=#passScore#,IS_DELETE=#isDelete#,CREATE_TIME=#createTime#,TID=#tid#

condition
===

	1 = 1  
	@if(!isEmpty(id)){
	 and ID=#id#
	@}
	@if(!isEmpty(qresId)){
	 and QRES_ID=#qresId#
	@}
	@if(!isEmpty(classId)){
	 and CLASS_ID=#classId#
	@}
	@if(!isEmpty(needTime)){
	 and NEED_TIME=#needTime#
	@}
	@if(!isEmpty(levelNum)){
	 and LEVEL_NUM=#levelNum#
	@}
	@if(!isEmpty(score)){
	 and SCORE=#score#
	@}
	@if(!isEmpty(passScore)){
	 and PASS_SCORE=#passScore#
	@}
	@if(!isEmpty(isDelete)){
	 and IS_DELETE=#isDelete#
	@}
	@if(!isEmpty(createTime)){
	 and CREATE_TIME=#createTime#
	@}
	@if(!isEmpty(tid)){
	 and TID=#tid#
	@}
	
queryListByQresId
===
	select * from LRES_QLEVEL where IS_DELETE = 1 and QRES_ID=#qresId# ORDER BY LEVEL_NUM
	
deleteTrueByQresId
===
	delete from LRES_QLEVEL where QRES_ID=#qresId#	
	
deleteByQresId
===
	update LRES_QLEVEL set IS_DELETE=0 where QRES_ID=#qresId#		