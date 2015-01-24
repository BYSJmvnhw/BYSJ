<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2014/12/25
  Time: 13:27
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="s" uri="/struts-tags" %>
<html>
<head>
    <title>登陆</title>
</head>
<body>
<br/>
<form action="login_login.action" method="post">
  <label>用户名</label>
  <input type="text" name="username" /><br/><br/>
  <label>密&nbsp&nbsp码</label>
  <input type="password" name="password" /><br/>
  <input type="submit" value="登陆"/>
  <s:property value="#msg"/>
  <s:debug/>
</form>
</body>
</html>
