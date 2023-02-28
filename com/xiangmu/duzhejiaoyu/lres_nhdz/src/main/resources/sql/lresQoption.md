sample
===
* 注释

	select #use("cols")# from LRES_QOPTION  where  #use("condition")#

cols
===
	ID,QUEST_ID,OPTION_ITEM,IS_TRUE,CREATE_ID,CREATE_TIME,IS_DELETE,TID

updateSample
===
	
	ID=#id#,QUEST_ID=#questId#,OPTION_ITEM=#optionItem#,IS_TRUE=#isTrue#,CREATE_ID=#createId#,CREATE_TIME=#createTime#,IS_DELETE=#isDelete#,TID=#tid#

condition
===

	1 = 1  
	@if(!isEmpty(id)){
	 and ID=#id#
	@}
	@if(!isEmpty(questId)){
	 and QUEST_ID=#questId#
	@}
	@if(!isEmpty(optionItem)){
	 and OPTION_ITEM=#optionItem#
	@}
	@if(!isEmpty(isTrue)){
	 and IS_TRUE=#isTrue#
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
	
queryListByQid
===
	select ID,QUEST_ID,OPTION_ITEM,IS_TRUE from LRES_QOPTION where IS_DELETE=1 and QUEST_ID=#questId#

	
deleteByIds
===
	update LRES_QOPTION set IS_DELETE=0 where id in (#ids#)
	
deleteTrueByQuestId
===
	delete from LRES_QOPTION where QUEST_ID = #questId#
	
deleteByQuestId
===
	update LRES_QOPTION set IS_DELETE=0 where QUEST_ID = #questId#
	
deleteByQuestIds
===
	delete from LRES_QOPTION where QUEST_ID IN (
	@for(id in ids){
	    #id#  #text(idLP.last?"":"," )#
	@}
	)
