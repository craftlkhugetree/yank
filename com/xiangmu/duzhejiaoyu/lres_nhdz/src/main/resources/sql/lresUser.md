pageQueryList
===
	select 
	@pageTag(){
		* 
	@}
	from 
	(select 
	
		t1.*,t4.name campusName,DATE_FORMAT(t2.CREATE_TIME,'%Y-%m-%d') qtime,t2.IS_PASS,t3.`NAME` qname,t3.test_type,if(test_type=3,t2.level,t2.score) score,t5.READNAME readerTypename
	 
	from LRES_USER t1
	left join (
	select a.*  
	     from LRES_QRECORD a  
	     where not exists(select 1  
	                      from LRES_QRECORD b  
	                      where b.USER_ID=a.USER_ID and b.CREATE_TIME>a.CREATE_TIME) 
	) t2
	on t1.ID = t2.USER_ID
	left join LRES_QRESOURCE t3
	on t2.RES_ID = t3.ID
	left join LRES_CAMPUS t4
	on t1.campus_id = t4.id
	left join LRES_READERTYPE t5
	on t1.READER_TYPE = t5.READTYPE
	where t1.IS_DELETE = 1 and t1.TID=#tid#
	@if(!isEmpty(queryParam)){
	 and (t1.READER_ID like '%'||#queryParam#||'%' or t1.NAME like '%'||#queryParam#||'%' or t1.IDCARD like '%'||#queryParam#||'%' or t1.DEPT like '%'||#queryParam#||'%')
	@}	
	@if(!isEmpty(startDate) && !isEmpty(endDate)){
	 and DATEDIFF(t2.CREATE_TIME,#startDate#)>=0 and DATEDIFF(t2.CREATE_TIME,#endDate#)<=0
	@}
	@if(!isEmpty(grade)){
	 and t1.GRADE=#grade#
	@}
	GROUP BY t1.ID) tt
	
excelList
===
	select 
		t1.*,t4.name campusName,DATE_FORMAT(t2.CREATE_TIME,'%Y-%m-%d') qtime,t2.IS_PASS,t3.`NAME` qname,t3.test_type,if(test_type=3,t2.level,t2.score) score,t5.READNAME readerTypename
	from LRES_USER t1
	left join (
	select a.*  
	     from LRES_QRECORD a  
	     where not exists(select 1  
	                      from LRES_QRECORD b  
	                      where b.USER_ID=a.USER_ID and b.CREATE_TIME>a.CREATE_TIME) 
	) t2
	on t1.ID = t2.USER_ID
	left join LRES_QRESOURCE t3
	on t2.RES_ID = t3.ID
	left join LRES_CAMPUS t4
	on t1.campus_id = t4.id
	left join LRES_READERTYPE t5
	on t1.READER_TYPE = t5.READTYPE
	where t1.IS_DELETE = 1 and t1.TID=#tid#
	@if(!isEmpty(queryParam)){
	 and (t1.READER_ID like '%'||#queryParam#||'%' or t1.NAME like '%'||#queryParam#||'%' or t1.IDCARD like '%'||#queryParam#||'%' or t1.DEPT like '%'||#queryParam#||'%')
	@}	
	@if(!isEmpty(startDate) && !isEmpty(endDate)){
	 and DATEDIFF(t2.CREATE_TIME,#startDate#)>=0 and DATEDIFF(t2.CREATE_TIME,#endDate#)<=0
	@}
	@if(!isEmpty(grade)){
	 and t1.GRADE=#grade#
	@}	
	GROUP BY t1.ID
		
bigThing
===
	select 1 type,null testType,null sourceName,null learnTime,null score,null isPass,DATE_FORMAT(DATE(FIRSTLOGIN),'%Y-%m-%d') create_time from LRES_USER t1
	where t1.ID=#userId# and t1.TID=#tid#
	UNION
	select 2 type,null,null,t1.LEARN_TIME,null,null,DATE_FORMAT(t1.LEARN_DATE,'%Y-%m-%d') create_time from LRES_LRECORD t1
	where t1.USER_ID=#userId# and t1.TID=#tid#
	UNION
	select 3 type,t2.test_type,t2.`NAME` sourceName,null learnTime,t1.SCORE,t1.IS_PASS,DATE_FORMAT(t1.CREATE_TIME,'%Y-%m-%d') create_time from LRES_QRECORD t1
	left join LRES_QRESOURCE t2
	on t1.RES_ID = t2.ID
	where t1.USER_ID=#userId# and t1.TID=#tid# and t2.test_type<>3
	union
	select 4 type,t2.test_type,t2.`NAME` sourceName,null learnTime,t1.LEVEL score,t1.IS_PASS,DATE_FORMAT(t1.CREATE_TIME,'%Y-%m-%d') create_time from LRES_QRECORD t1
	left join LRES_QRESOURCE t2
	on t1.RES_ID = t2.ID
	where t1.USER_ID=#userId# and t1.TID=#tid# and t2.test_type=3
	
deleteUserLRecord
===
	delete from LRES_LRECORD where USER_ID = #userId#
	
deleteUserQRecord
===
	delete from LRES_QRECORD where USER_ID = #userId#
	
deleteUser
===
	delete from LRES_USER where ID = #userId#
	
unnormalStus
===
	select * from 
	(select 
		t1.*,t4.name campusName,DATE_FORMAT(t2.CREATE_TIME,'%Y-%m-%d') qtime,t2.IS_PASS,t3.`NAME` qname,t3.test_type,if(test_type=3,t2.level,t2.score) score,t5.READNAME readerTypename
	from LRES_USER t1
	left join (
	select a.*  
	     from LRES_QRECORD a  
	     where not exists(select 1  
	                      from LRES_QRECORD b  
	                      where b.USER_ID=a.USER_ID and b.CREATE_TIME>a.CREATE_TIME) 
	) t2
	on t1.ID = t2.USER_ID
	left join LRES_QRESOURCE t3
	on t2.RES_ID = t3.ID
	left join LRES_CAMPUS t4
	on t1.campus_id = t4.id
	left join LRES_READERTYPE t5
	on t1.READER_TYPE = t5.READTYPE
	where t1.IS_DELETE = 1 and t1.ISPASS=1 and t1.READER_FLAG = 3
	GROUP BY t1.ID) tt
	
getUserFromAuth
===
	select * from #text(auth)#.AU_USER where ID = #id#