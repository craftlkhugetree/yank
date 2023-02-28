sample
===
* 注释

	select #use("cols")# from LRES_QUESTCOUNT  where  #use("condition")#

cols
===
	ID,QUEST_ID,USE_NUM,PASS_NUM,CREATE_TIME,IS_DELETE,TID

updateSample
===
	
	ID=#id#,QUEST_ID=#questId#,USE_NUM=#useNum#,PASS_NUM=#passNum#,CREATE_TIME=#createTime#,IS_DELETE=#isDelete#,TID=#tid#

condition
===

	1 = 1  
	@if(!isEmpty(id)){
	 and ID=#id#
	@}
	@if(!isEmpty(questId)){
	 and QUEST_ID=#questId#
	@}
	@if(!isEmpty(useNum)){
	 and USE_NUM=#useNum#
	@}
	@if(!isEmpty(passNum)){
	 and PASS_NUM=#passNum#
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
	
deleteByQuestId
===
	update LRES_QUESTCOUNT set IS_DELETE=0 where QUEST_ID = #questId#	
	
deleteByQuestIds
===
	delete from LRES_QUESTCOUNT where QUEST_ID IN (
	@for(id in ids){
	    #id#  #text(idLP.last?"":"," )#
	@}
	)	
	
queryByQuestId
===
	select * from LRES_QUESTCOUNT where QUEST_ID = #questId#