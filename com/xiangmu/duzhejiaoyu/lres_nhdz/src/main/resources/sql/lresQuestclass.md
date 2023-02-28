sample
===
* 注释

	select #use("cols")# from LRES_QUESTCLASS  where  #use("condition")#

cols
===
	ID,NAME,CREATE_ID,CREATE_TIME,IS_DELETE,TID

updateSample
===
	
	ID=#id#,NAME=#name#,CREATE_ID=#createId#,CREATE_TIME=#createTime#,IS_DELETE=#isDelete#,TID=#tid#

condition
===

	1 = 1  
	@if(!isEmpty(id)){
	 and ID=#id#
	@}
	@if(!isEmpty(name)){
	 and NAME=#name#
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
	
queryList
===
	select ID,NAME from LRES_QUESTCLASS where IS_DELETE = 1 and TID=#tid#
	
