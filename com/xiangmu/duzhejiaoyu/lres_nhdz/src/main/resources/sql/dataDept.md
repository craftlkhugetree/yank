top
===
	select count(t1.USER_ID) ksrs,SUM(t1.is_pass) tgrs,count(t1.USER_ID)-SUM(t1.is_pass) wtgrs
	from LRES_QRECORD t1  
	left join LRES_USER t2 on t1.USER_ID = t2.ID
	where t2.ID is not null
	and not exists(select 1  from LRES_QRECORD t2  
						where t1.USER_ID=t2.USER_ID and t2.CREATE_TIME>t1.CREATE_TIME)
	@if(!isEmpty(grade)){
	 and t1.GRADE=#grade#
	@}
	@if(!isEmpty(starttime) && !isEmpty(endtime)){
	 and (DATE_FORMAT(t1.CREATE_TIME,'%Y%m%d') between #starttime# and #endtime#)
	@}
	
bottom
===
	select 
	@pageTag(){
	* 
	@}
	from (
		select 
			t1.GRADE,t1.DEPT,COUNT(*) zrs,COUNT(t2.id) ksrs,SUM(t2.is_pass) tgrs,COUNT(t2.id)-SUM(t2.is_pass) wtgrs,
			CAST(IFNULL(SUM(t2.is_pass)/COUNT(t2.id)*100,0) AS signed) tgl 
		from LRES_USER t1
		left join (
		select a.*,DATE_FORMAT(a.CREATE_TIME,'%Y%m%d') kstime
		     from LRES_QRECORD a  
		     where not exists(select 1  
		                      from LRES_QRECORD b  
		                      where b.USER_ID=a.USER_ID and b.CREATE_TIME>a.CREATE_TIME) 
		) t2
		on t1.ID = t2.USER_ID
		where t1.IS_DELETE = 1
		@if(!isEmpty(grade)){
		 and t1.GRADE=#grade#
		@}
		@if(!isEmpty(starttime) && !isEmpty(endtime)){
		 and (t2.kstime between #starttime# and #endtime#)
		@}
		GROUP BY t1.DEPT,t1.GRADE) tt
		
bottomExport
===
	select * from (
		select 
			t1.GRADE,t1.DEPT,COUNT(*) zrs,COUNT(t2.id) ksrs,SUM(t2.is_pass) tgrs,COUNT(t2.id)-SUM(t2.is_pass) wtgrs,
			CAST(IFNULL(SUM(t2.is_pass)/COUNT(t2.id)*100,0) AS signed) tgl 
		from LRES_USER t1
		left join (
		select a.*,DATE_FORMAT(a.CREATE_TIME,'%Y%m%d') kstime
		     from LRES_QRECORD a  
		     where not exists(select 1  
		                      from LRES_QRECORD b  
		                      where b.USER_ID=a.USER_ID and b.CREATE_TIME>a.CREATE_TIME) 
		) t2
		on t1.ID = t2.USER_ID
		where t1.IS_DELETE = 1
		@if(!isEmpty(grade)){
		 and t1.GRADE=#grade#
		@}
		@if(!isEmpty(starttime) && !isEmpty(endtime)){
		 and (t2.kstime between #starttime# and #endtime#)
		@}
		GROUP BY t1.DEPT,t1.GRADE) tt
		