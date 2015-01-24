<%@ taglib prefix="s" uri="/struts-tags" %>
<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/1/14
  Time: 2:04
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
    当前用户：<s:property value="#session.loginUser.username"/><br/>
    提示信息：<s:property value="#session.msg"/>
    <s:debug/>
</head>
<body>

</body>
</html>
