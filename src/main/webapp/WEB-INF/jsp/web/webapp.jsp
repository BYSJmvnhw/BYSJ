<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head lang="zn">
    <meta charset="UTF-8">
    <title>个人信息</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/login.css">
    <%--<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/webapp.css">--%>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/transition.css">
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/lib/sea-2.3.0.js"  id="seajsnode"></script>
</head>
<body>
    <section id="login" role="login"></section>
    <section id="main" class="main" role="main"></section>
    <script type="text/html" id="login-html">
        <section id="login-p" class="login-p t-login t-login-open" role="login-p">
            <section class="lg-header">
                <div class="lg-bg"></div>
                <div class="lg-logo">
                    <img src="${pageContext.request.contextPath}/resources/skin/images/logo.png">
                </div>
            </section>
            <section class="lg-info-wrap">
                <div id="lg-info" class="lg-info">
                    <div class="lg-text"><strong>登录作业网</strong></div>
                    <div class="lg-name"><input type="text" placeholder="用户名"/></div>
                    <div class="lg-pw"><input type="password" placeholder="密码"/></div>
                    <div class="lg-login-btn">
                        <button id="login-btn" role="button"><strong>登陆</strong></button>
                        <div id="lg-fail-tip">用户名或密码错误噢，请重试！<span>X</span></div>
                    </div>
                </div>
                <div class="lg-footer">
                    <p class="lg-site">
                        <span>网站首页</span>|<span>关于我们</span>|<span>联系方式</span>|<span>版权声明</span>|<span>友情链接</span>
                    </p>
                    <p class="lg-copyright">
                        <span>&copy;</span>Copyright 2015. All Rights Reserved 三脚猫
                    </p>
                </div>
            </section>
            <div id="lg-shade" class="lg-shade">
                <div class="lg-shade-tip">
                    <p><strong>正在登陆...</strong></p>
                    <span class="t-load"></span>
                </div>
            </div>
        </section>
    </script>
    <script type="text/html" id="main-html">
        <nav>
            <div class="nav-wrap" role="navigation">
                <ul id="nav-main" class="nav-main" role="menubar">
                    <li class="logo" role="logo"><span></span></li>
                    <li class="active">首页</li>
                    <li>
                        个人中心
                        <ul data-type="man" class="type1 nav-main-child t-top">
                            <li data-bar="info">个人信息</li>
                            <li data-bar="changepw">密码修改</li>
                            <li data-bar="setmail">设置邮箱</li>
                        </ul>
                    </li>
                    <li>
                        作业管理
                        <ul data-type="hkmanage" class="type2 nav-main-child t-top">
                            <li data-bar="hkinfo">作业信息</li>
                            <li data-bar="hkdynamic">作业动态</li>
                        </ul>
                    </li>
                    <li>帮助</li>
                </ul>
                <div class="welcome">
                    <span>您好，陈培峰</span>
                    <span id="exit" title="退出系统">退出</span>
                </div>
            </div>
        </nav>
        <header>
            <div class="bg"></div>
            <div class="info-b">
                <span id="info-btn"></span>
                <div id="info-tip" class="info-tip">
                    <div></div>
                    <ul>
                        <li data-type="work">最新作业<span>10</span></li>
                        <li data-type="unhand">未提交<span>5</span></li>
                        <li data-type="feedback">作业反馈<span>3</span></li>
                    </ul>
                </div>
            </div>
        </header>
        <section class="main-content">
            <div id="left-nav" class="left-nav" role="navigation">
                <div class="l-menu" data-type="man"><strong><span class="man"></span>个人中心<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
                <ul class="t-slide t-close">
                    <li data-bar="info">个人信息</li>
                    <li data-bar="changepw">密码修改</li>
                    <li data-bar="setmail">设置邮箱</li>
                </ul>
                <div class="l-menu" data-type="hkmanage"><strong><span class="work"></span>作业管理<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
                <ul class="t-slide t-close">
                    <li data-bar="hkinfo">作业信息</li>
                    <li data-bar="hkdynamic">作业动态</li>
                </ul>
            </div>
            <div id="content" class="content">
                <!--主要信息-->
            </div>
        </section>
        <footer>
            <div class="line"></div>
            <div class="site-footer">
                <p class="site-info">
                    <span>网站首页</span>|<span>关于我们</span>|<span>联系方式</span>|<span>版权声明</span>|<span>友情链接</span>
                </p>
                <p class="copyright">
                    <span>&copy;</span>Copyright 2015. All Rights Reserved 三脚猫
                </p>
                <p></p>
            </div>
        </footer>
    </script>
    <script type="text/template" id="man-info">
        <div class="personal-info">
            <div class="p-name">
                <label><strong>姓名</strong></label>
                <label>{{name}}</label>
            </div>
            <div class="p-name">
                <label><strong>性别</strong></label>
                <label>{{sex}}</label>
            </div>
            <div class="p-name">
                {{if userType == 'STUDENT'}}
                    <label><strong>学号</strong></label>
                    <label>{{studentNo}}</label>
                {{else if userType == 'TEACHER'}}
                    <label><strong>教师号</strong></label>
                    <label>{{teacherNo}}</label>
                {{/if}}
            </div>
            <div class="p-name">
                <label><strong>校区学院</strong></label>
                <label>{{hwCampus}}-{{hwCollege}}</label>
            </div>
            <div class="p-name">
                <label><strong>年级班级</strong></label>
                <label>{{grade}}级{{class_}}班</label>
            </div>
            <div class="p-name">
                <label><strong>专业</strong></label>
                <label>{{hwMajor}}</label>
            </div>
        </div>
        <div class="personal-img">
            <img src="${pageContext.request.contextPath}/resources/skin/images/man.jpg">
        </div>
    </script>
    <script id="test" type="text/html">
        <h1>{{title}}</h1>
        <ul>
            {{each list as value i}}
            <li>索引 {{i + 1}} ：{{value}}</li>
            {{/each}}
        </ul>
    </script>
    <!--<script type="text/javascript" src="script/webapp.js"></script>-->
    <!--<script type="text/javascript" src="script/login.js"></script>-->
    <%--<script type="text/javascript" src="${pageContext.request.contextPath}/resources/script/seajs-ready.js"></script>--%>
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
                'webapp': 'script/webapp.js?v=201503181523',
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