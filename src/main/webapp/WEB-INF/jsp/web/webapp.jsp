<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head lang="zn">
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/login.css">
    <%--<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/webapp.css">--%>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/transition.css">
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/lib/sea-2.3.0.js"  id="seajsnode"></script>
</head>
<body>
    <section id="login" role="login"></section>
    <section id="main" class="main" role="main"></section>
    <jsp:include page="tmpl.jsp" />
    <script type="text/javascript">
        /**Created by zqc on 2015/3/15**/
        window.basepath = '${pageContext.request.contextPath}';
        seajs.config({
            paths: {
                'script': window.basepath + '/resources/script',
                'css': window.basepath + '/resources/skin/css'
            },
            alias: {
                'login': 'script/login.js',
                'jquery': 'jquery-1.11.2.min.js',
                'jquery-plugin': 'jquery-plugin.js',
                'template': 'template.js',
                'backbone': 'backbone-min.js',
                'underscore': 'underscore-min.js',
                'webapp': 'script/webapp.js',
                'calendar': 'script/calendar.js',
                'webapp.css': 'css/webapp.css',
                'login.css': 'css/login.css'
            }
        });
        seajs.use('login', function (login) {
            login.loginHw();
        });
    </script>
</body>
</html>