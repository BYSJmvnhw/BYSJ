<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page import="com.zhuozhengsoft.pageoffice.*"%>
<%
FileSaver fs = (FileSaver)(request.getAttribute("FileSaver"));
fs.close();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>SaveFile</title>
  </head>
  
  <body>
    <h2 style="color:red">${requestScope.message}</h2>
  </body>
</html>
