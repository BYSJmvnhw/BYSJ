<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/1/25
  Time: 15:40
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form" %>
<html>
<head>
    <title></title>
</head>
<body>
<form action="login" method="post">
  Username: <input type="text" name="username" /><br/><br/>
  Password: <input type="password" name="password" /><br/><br/>


  <input type="submit" /><br/>
</form>
${msg}
</body>
</html>
