searchData
===
	select 
	@pageTag(){
		tt.*
	@}  
	from
	(
	select t1.*,t2.NAME CTMNAME from WXK_SEARCHRECORD t1 
	left join CRM_CUSTOMER t2 on t1.CTMID = t2.ID
	) tt
	where 1=1
	@if(!isEmpty(ctmname)){
	 and CTMNAME like concat('%',#ctmname#,'%')
	@}
	@if(!isEmpty(starttime)){
	 and DATETIME >= #starttime#
	@}
	@if(!isEmpty(endtime)){
	 and DATETIME <= #endtime#
	@}
	
downloadData
===
	select 
	@pageTag(){
		tt.*
	@}  
	from
	(
	select t1.*,t2.NAME CTMNAME,t3.TITLE BOOKTITLE,DATE_FORMAT(t1.DATETIME,'%Y-%m-%d %h:%i:%s') datetime2 from WXK_DOWNRECORD t1 
	left join CRM_CUSTOMER t2 on t1.CTMID = t2.ID
	left join WXK_BOOK_CNMARC t3 on t1.BOOKID = t3.BOOKID
	) tt
	where 1=1
	@if(!isEmpty(ctmname)){
	 and CTMNAME like concat('%',#ctmname#,'%')
	@}
	@if(!isEmpty(starttime)){
	 and DATE_FORMAT(DATETIME,'%Y%m%d%h%i%s') >= #starttime#
	@}
	@if(!isEmpty(endtime)){
	 and DATE_FORMAT(DATETIME,'%Y%m%d%h%i%s') <= #endtime#
	@}

readData
===
	select 
	@pageTag(){
		tt.*
	@}  
	from
	(
	select t1.*,t2.NAME CTMNAME,t3.TITLE BOOKTITLE from WXK_READRECORD t1 
	left join CRM_CUSTOMER t2 on t1.CTMID = t2.ID
	left join WXK_BOOK_CNMARC t3 on t1.BOOKID = t3.BOOKID
	) tt
	where 1=1
	@if(!isEmpty(ctmname)){
	 and CTMNAME like concat('%',#ctmname#,'%')
	@}
	@if(!isEmpty(starttime)){
	 and DATETIME >= #starttime#
	@}
	@if(!isEmpty(endtime)){
	 and DATETIME <= #endtime#
	@}

searchDataExcel
===
	select 
		tt.*
	from
	(
	select t1.*,t2.NAME CTMNAME from WXK_SEARCHRECORD t1 
	left join CRM_CUSTOMER t2 on t1.CTMID = t2.ID
	order by t1.DATETIME desc
	) tt
	where 1=1
	@if(!isEmpty(ctmname)){
	 and CTMNAME like concat('%',#ctmname#,'%')
	@}
	@if(!isEmpty(starttime)){
	 and DATETIME >= #starttime#
	@}
	@if(!isEmpty(endtime)){
	 and DATETIME <= #endtime#
	@}	
	
downloadDataExcel
===
	select 
		tt.*
	from
	(
	select t1.*,t2.NAME CTMNAME,t3.TITLE BOOKTITLE,DATE_FORMAT(t1.DATETIME,'%Y-%m-%d %h:%i:%s') datetime2 from WXK_DOWNRECORD t1 
	left join CRM_CUSTOMER t2 on t1.CTMID = t2.ID
	left join WXK_BOOK_CNMARC t3 on t1.BOOKID = t3.BOOKID
	order by t1.DATETIME desc
	) tt
	where 1=1
	@if(!isEmpty(ctmname)){
	 and CTMNAME like concat('%',#ctmname#,'%')
	@}
	@if(!isEmpty(starttime)){
	 and DATE_FORMAT(DATETIME,'%Y%m%d%h%i%s') >= #starttime#
	@}
	@if(!isEmpty(endtime)){
	 and DATE_FORMAT(DATETIME,'%Y%m%d%h%i%s') <= #endtime#
	@}
	
readDataExcel
===
	select 
		tt.*
	from
	(
	select t1.*,t2.NAME CTMNAME,t3.TITLE BOOKTITLE from WXK_READRECORD t1 
	left join CRM_CUSTOMER t2 on t1.CTMID = t2.ID
	left join WXK_BOOK_CNMARC t3 on t1.BOOKID = t3.BOOKID
	order by t1.DATETIME desc
	) tt
	where 1=1
	@if(!isEmpty(ctmname)){
	 and CTMNAME like concat('%',#ctmname#,'%')
	@}
	@if(!isEmpty(starttime)){
	 and DATETIME >= #starttime#
	@}
	@if(!isEmpty(endtime)){
	 and DATETIME <= #endtime#
	@}