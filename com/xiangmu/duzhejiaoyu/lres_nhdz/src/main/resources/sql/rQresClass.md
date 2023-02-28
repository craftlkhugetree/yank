queryListByQresId
===
	select * from R_QRES_CLASS where is_delete=1 and QRES_ID=#qresId#

deleteTrueByQresId
===
	delete from R_QRES_CLASS where QRES_ID=#qresId#
	
deleteByQresId
===
	update R_QRES_CLASS set IS_DETELE=0 where QRES_ID=#qresId#
	