<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head lang="zn">
    <meta charset="UTF-8">
    <title>个人信息</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/login.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/webapp.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/skin/css/transition.css">
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/lib/sea-2.3.0.js"  id="seajsnode"></script>
</head>
<body>
    <section id="login">
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
                    <div class="lg-login-btn"><button id="login-btn" role="button"><strong>登陆</strong></button></div>
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
        </section>
    </section>
    <section id="main" class="main" role="main"></section>
    <script type="text/html" id="login-html"></script>
    <script type="text/html" id="main-html">
        <nav>
            <div class="nav-wrap" role="navigation">
                <ul class="nav-main" role="menubar">
                    <li class="logo" role="logo">
                        <a href="#"><span></span></a>
                    </li>
                    <li class="active"><a href="#">首页</a></li>
                    <li><a href="#">个人中心</a></li>
                    <li><a href="#">作业管理</a></li>
                    <li><a href="#">帮助</a></li>
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
                <div class="l-menu" data-type="man"><strong><span class="man"></span>个人中心<span class="bn-slide t-rotate t-rotate-open"></span></strong></div>
                <ul class="t-slide t-close">
                    <li data-bar="info">个人信息</li>
                    <li data-bar="changepw">密码修改</li>
                    <li data-bar="setmail">设置邮箱</li>
                </ul>
                <div class="l-menu" data-type="hkmanage"><strong><span class="work"></span>作业管理<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
                <ul class="t-slide t-close">
                    <li data-bar="hklist">作业列表</li>
                    <li>密码修改</li>
                    <li>设置邮箱</li>
                </ul>
            </div>
            <div id="content" class="content">
                <!--主要信息-->
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
                        <label><strong>学号</strong></label>
                        <label>{{studentNo}}</label>
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
                <input type="text" value="{{name}}" readonly/>
            </div>
            <div class="p-name">
                <label><strong>学号</strong></label>
                <input type="text" value="{{sn}}" readonly/>
            </div>
            <div class="p-name">
                <label><strong>学院</strong></label>
                <input type="text" value="{{college}}" readonly/>
            </div>
            <div class="p-name">
                <label><strong>专业</strong></label>
                <input type="text" value="{{major}}" readonly/>
            </div>
        </div>
        <div class="personal-img">
            <img src="${pageContext.request.contextPath}/resources/skin/images/man.jpg">
        </div>
    </script>
    <!--<script type="text/javascript" src="script/webapp.js"></script>-->
    <!--<script type="text/javascript" src="script/login.js"></script>-->
    <%--<script type="text/javascript" src="${pageContext.request.contextPath}/resources/script/seajs-ready.js"></script>--%>
    <script type="text/javascript">
        /**Created by zqc on 2015/3/15**/
        seajs.config({
            paths: {
                'script': '${pageContext.request.contextPath}/resources/script',
                'css': '${pageContext.request.contextPath}/resources/skin/css'
            },
            alias: {
                'login': 'script/login.js',
                'jquery': 'jquery-1.11.2.min.js',
                'jquery-plugin': 'jquery-plugin.js',
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