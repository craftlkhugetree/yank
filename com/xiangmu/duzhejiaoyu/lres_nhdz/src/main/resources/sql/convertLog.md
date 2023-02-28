sample
===
* 注释

	select #use("cols")# from CONVERT_LOG  where  #use("condition")#

cols
===
	ID,SOURCE,TARGET,USE_TIME,RESULT_CODE,CREATE_ID,CREATE_TIME,IS_DELETE,TID

updateSample
===
	
	ID=#id#,SOURCE=#source#,TARGET=#target#,USE_TIME=#useTime#,RESULT_CODE=#resultCode#,CREATE_ID=#createId#,CREATE_TIME=#createTime#,IS_DELETE=#isDelete#,TID=#tid#

condition
===

	1 = 1  
	@if(!isEmpty(id)){
	 and ID=#id#
	@}
	@if(!isEmpty(source)){
	 and SOURCE=#source#
	@}
	@if(!isEmpty(target)){
	 and TARGET=#target#
	@}
	@if(!isEmpty(useTime)){
	 and USE_TIME=#useTime#
	@}
	@if(!isEmpty(resultCode)){
	 and RESULT_CODE=#resultCode#
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
	
	