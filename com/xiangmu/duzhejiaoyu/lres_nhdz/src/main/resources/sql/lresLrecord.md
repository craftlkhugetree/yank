findByDate
===
	select * from LRES_LRECORD where USER_ID=#userId# and DATEDIFF(LEARN_DATE,#learnDate#) = 0	
	
queryByUserId
===
	select IFNULL(sum(LEARN_TIME),0) from LRES_LRECORD where USER_ID=#userId# group by USER_ID