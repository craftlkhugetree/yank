bottom
===
	select * from (
		select 
			t1.DEPT,COUNT(*) zrs,COUNT(t2.id) ksrs,SUM(t2.is_pass) tgrs,COUNT(t2.id)-SUM(t2.is_pass) wtgrs,
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
		where t1.IS_DELETE = 1 and t1.DEPT is not null
		@if(!isEmpty(starttime) && !isEmpty(endtime)){
		 and (t2.kstime between #starttime# and #endtime#)
		@}
		GROUP BY t1.DEPT) tt