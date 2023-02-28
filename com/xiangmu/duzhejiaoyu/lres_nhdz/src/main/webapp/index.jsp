<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<% 
String v = request.getParameter("v");
if(null == v || v.length() == 0){
	v = "1";
}
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Insert title here</title>
<script type="text/javascript">
<%if(v.equals("1")){%>
	window.location.href = "/lres/lres/index.html";
<%}else if(v.equals("2")){ %>
	window.location.href = "/lres/pc/index.html";
<%}else if(v.equals("3")){ %>
	window.location.href = "/lres/mobile/index.html";
<%}else{%>
	window.location.href = "/lres/lres/index.html";
<%}%>
</script>
</head>
<body>

</body>
</html>