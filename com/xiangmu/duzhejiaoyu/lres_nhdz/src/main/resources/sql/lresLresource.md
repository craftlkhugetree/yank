queryList
===
	select * from LRES_LRESOURCE where IS_DELETE=1 and TID=#tid#
	@if(!isEmpty(fileType)){
	 and FILE_TYPE=#fileType#
	@}
	@if(!isEmpty(name)){
	 and NAME like CONCAT('%',#name#,'%')
	@}
	order by create_time desc
	
pageQueryList
===
	select 
	@pageTag(){
	tt.* 
	@}
	from (
		select 
		t1.*,GROUP_CONCAT(DISTINCT t2.CAMPUSID) campusIds,GROUP_CONCAT(DISTINCT t3.NAME) campusNames,
		GROUP_CONCAT(DISTINCT t5.READTYPE) readerTypes,GROUP_CONCAT(DISTINCT t5.READNAME) readerNames
		from LRES_LRESOURCE t1
		left join R_LSOURCE_CAMPUS t2 on t1.ID = t2.LEARNSOURCEID
		left join LRES_CAMPUS t3 on t2.CAMPUSID = t3.ID
		left join R_LSOURCE_READTYPE t4 on t1.ID = t4.LEARNSOURCEID
		left join LRES_READERTYPE t5 on t4.READERTYPE = t5.READTYPE
		where t1.IS_DELETE=1 and t1.TID=#tid#
		@if(!isEmpty(fileType)){
		 and t1.FILE_TYPE=#fileType#
		@}
		@if(!isEmpty(name)){
		 and t1.NAME like concat('%', #name#, '%')
		@}
		group by t1.ID
	order by t1.IS_NEEDSTUDY,t1.LEVELCODE) tt
	where 1=1 
	@if(!isEmpty(campusId)){
		and LOCATE(#campusId#,tt.campusIds) > 0
	@}
	@if(!isEmpty(readerType)){
		and LOCATE(#readerType#,tt.readerTypes) > 0
	@}
	
findById
===
	select 
	t1.*,GROUP_CONCAT(DISTINCT t2.CAMPUSID) campusIds,GROUP_CONCAT(DISTINCT t3.READERTYPE) readerTypes
	from LRES_LRESOURCE t1
	left join R_LSOURCE_CAMPUS t2 on t1.ID = t2.LEARNSOURCEID
	left join R_LSOURCE_READTYPE t3 on t1.ID = t3.LEARNSOURCEID
	where t1.IS_DELETE=1 and t1.ID=#id#
	
findOneByName
===
	select * from LRES_LRESOURCE where IS_DELETE=1 and TID=#tid# 
	@if(!isEmpty(name)){
	 and NAME=#name#
	@}
	@if(!isEmpty(fileType)){
	 and FILE_TYPE=#fileType#
	@}