<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/1/14
  Time: 10:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="s" uri="/struts-tags" %>
<html>
<head>
    <title></title>
</head>
<body>
<form action="upload_upload.action" method="post" enctype="multipart/form-data">

  上传文件  <input type="file" name="file" />
            <input type="submit" name="提交" />

</form>
</body>
</html>
