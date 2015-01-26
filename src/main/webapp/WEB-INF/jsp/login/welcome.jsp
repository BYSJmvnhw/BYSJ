<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/1/25
  Time: 20:02
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>
<h1>${msg}</h1>
欢迎你!!

账号：${loginUser.username}<br/><br/>
姓名：${loginUser.trueName}<br/><br/>
类型：${userType}<br/><br/>
工号：${loginTeacher.teacherNo}<br/><br/>
学号：${loginStudent.studentNo}<br/><br/>
专业：${loginStudent.hwMajor.name}
<br/><br/>
退出：<a href="logout">登出</a>


</body>
</html>
