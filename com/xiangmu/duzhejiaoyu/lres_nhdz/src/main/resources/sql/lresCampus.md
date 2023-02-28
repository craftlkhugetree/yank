queryList
===
	select ID,NAME,TYPE from LRES_CAMPUS where IS_DELETE = 1

	
queryByType
===
	select ID from LRES_CAMPUS where IS_DELETE = 1 and TYPE=#type#
