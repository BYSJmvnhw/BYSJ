<%--
  Created by IntelliJ IDEA.
  User: 郑权才
  Date: 15-3-24
  Time: 上午10:26
  To change this template use File | Settings | File Templates.
  模板集合
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

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
                    <ul data-type="hwmanage" class="type2 nav-main-child t-top">
                        <li data-bar="hwinfo">作业信息</li>
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
            <div class="l-menu" data-type="hwmanage"><strong><span class="work"></span>作业管理<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
            <ul class="t-slide t-close">
                <li data-bar="hwinfo">作业信息</li>
                <li data-bar="hwdynamic">作业动态</li>
            </ul>
        </div>
        <div id="content" class="content"></div>
    </section>
    {{if userType == 'STUDENT'}}
        {{include 'hand-in'}}
    {{/if}}
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
<script type="text/template" id="man-pw">
    <div class="personal-info">
        <div class="p-name">
            <label><strong>登陆账号</strong></label>
            <label>20112100167</label>
        </div>
        <div class="p-name">
            <label><strong>密码</strong></label>
            <label>*********</label>
        </div>
    </div>
</script>
<script type="text/template" id="hw-info">
    <!--<div class="load-data"></div>-->
    <section class="course-list">
        <div class="course-choice">
            <div class="choice-year">
                <p>学年</p>
                <select class="startYear">
                    <option>2011</option>
                    <option>2012</option>
                    <option>2013</option>
                    <option>2014</option>
                    <option>2015</option>
                </select>
            </div>
            <div class="choice-term">
                <p>学期</p>
                <select class="schoolTerm">
                    <option>1</option>
                    <option>2</option>
                </select>
            </div>
            <div class="choice-sure">
                <button class="choice-sure-btn" type="button">搜索课程</button>
            </div>
        </div>
        <div class="course-list-wrap"></div>
    </section>
    <section class="work-list">
        <div class="return-course-list">
            <span class="return-course-btn" data-back="1"></span>
            <span>返回课程列表</span>
        </div>
        <div class="work-list-wrap"></div>
    </section>
    <section class="student-list">
        <div class="return-work-list">
            <span class="return-work-btn" data-back="2"></span>
            <span>返回作业列表</span>
        </div>
        <div class="student-list-wrap"></div>
    </section>
</script>
<script type="text/template" id="course-list">
    <!--<div class="course-list">-->
    <table>
        <tbody>
        <thead><th>课程名</th><th>课程号</th><th>课程人数/人</th><th>操作</th></thead>
        {{each courselist as value}}
        <tr>
            <td>{{value.hwCourse.courseName}}</td>
            <td>{{value.hwCourse.courseNo}}</td>
            <td>50</td>
            <td><span class="work-list-btn" data-id="{{value.id}}">作业列表</span></td>
        </tr>
        {{/each}}
        </tbody>
    </table>
    <!--</div>-->
</script>
<script type="text/template" id="work-list">
    <!--<div class="work-list-t">-->
    <table>
        <thead><th>作业名</th><th>作业号</th><th>课程人数/人</th><th>未交人数/人</th><th>截止时间</th><th>操作</th></thead>
        <tbody>
        {{each worklist as value}}
        <tr>
            <td>{{value.title}}</td>
            <td>{{value.id}}</td>
            <td>50</td>
            <td>40</td>
            <td>{{value.deadline.split(' ')[0]}}</td>
            <td>
            {{if userType == 'TEACHER'}}
                <span class="student-list-btn" data-id="">批改作业</span>
            {{else if userType == 'STUDENT'}}
                <span class="hand-in-work" data-id="">交作业</span>
            {{/if}}
            </td>
        </tr>
        {{/each}}
        </tbody>
    </table>
    <!--</div>-->
</script>
<script type="text/template" id="hand-in">
    <div class="hand-in-wrap">
        <div class="hand-in-area">
            <div class="hand-in-title">
                <p role='title'>交作业</p>
            </div>
            <div class="hand-in-body">
                <div class="hand-in-course">
                    <label>课程：</label>
                    <label>计算机组成原理</label>
                </div>
                <div class="hand-in-name">
                    <label>作业：</label>
                    <label>计算机组成原理第一次作业</label>
                </div>
                <div class="hand-in-desc">
                    <label>作业说明：</label>
                    <label>请按时完成作业，逾期不候！</label>
                </div>
                <div class="hand-in-create">
                    <label>作业发布时间：</label>
                    <label>2015-02-13 17:47:44</label>
                </div>
                <div class="hand-in-deadline">
                    <label>截止上交时间：</label>
                    <label>2015-02-14 17:46:58</label>
                </div>
                <div>
                    <label for="work-file"></label>
                    <input id="work-file" name="work-file" type="file"/>
                    <label></label>
                </div>
                <div class="work-submit">
                    <button>提交作业</button>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/template" id="student-list">
    <!--<div class="student-list-t">-->
    <table>

        <thead><th>作业名</th><th>学生名</th><th>学号</th><th>提交时间</th><th>操作</th></thead>
        <tbody>
        {{each studentlist as value}}
        <tr>
            <td>{{value.title}}</td>
            <td>{{value.studentName}}</td>
            <td>{{value.studentNo}}</td>
            <td>{{value.submitDate.split(' ')[0]}}</td>
            <td><span class="hk-list-btn" data-id="{{value.id}}">批改</span></td>
        </tr>
        {{/each}}
        </tbody>
    </table>
    <!--</div>-->
</script>
