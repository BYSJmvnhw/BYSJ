<%--
  Created by IntelliJ IDEA.
  User: 郑权才
  Date: 15-4-11
  Time: 下午3:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>登陆作业网后台管理系统</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/managelogin.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/manage-t.css">
    <script src="${pageContext.request.contextPath}/resources/lib/sea-2.3.0.js"></script>
</head>
    <body>
        <section id="login-part"></section>
        <section id="manage-part"></section>
        <div id="dialog-wrap"></div>
        <script type="text/javascript">
            window.basepath = '${pageContext.request.contextPath}';
            seajs.config({
                paths: {
                    'script': window.basepath + '/resources/script',
                    'css': window.basepath + '/resources/skin/css'
                },
                alias: {
                    'backbone': 'backbone-min.js',
                    'underscore': 'underscore-min.js',
                    'React': 'react.min.js',
                    'login': 'script/managelogin.js',
                    'manageapp': 'script/manageapp.js',
                    'cellcomponent': 'script/cell-component.js',
                    'managedialog': 'script/managedialog.js',
                    'usermanage': 'script/usermanage.js',
                    'csmanage': 'script/csmanage.js',
                    'takemanage': 'script/takemanage.js',
                    'teachermanage': 'script/teachermanage.js',
                    'studentmanage': 'script/studentmanage.js',
                    'jquery': 'jquery-1.11.2.min.js',
                    'manageapp.css': 'css/manageapp.css',
                    'm-dialog.css': 'css/m-dialog.css'
                }
            });
            seajs.use('login', function (login) {
                login.loginManage();
            });
        </script>
    </body>
</html>
