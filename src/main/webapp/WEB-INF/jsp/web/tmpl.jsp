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
                <div class="lg-name"><input type="text" placeholder="用户名" required/></div>
                <div class="lg-pw"><input type="password" placeholder="密码" required/></div>
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
                    <ul data-type="man" class="type2 nav-main-child t-top">
                        <li data-bar="info">个人信息</li>
                        <li data-bar="setting">设置</li>
                    </ul>
                </li>
                {{if userType == 'STUDENT'}}
                <li>
                    作业管理
                    <ul data-type="hwmanage" class="type2 nav-main-child t-top">
                        <li data-bar="hwinfo">作业信息</li>
                        <li data-bar="hwdynamic">作业动态</li>
                    </ul>
                </li>
                {{else if userType == 'TEACHER'}}
                <li>
                    课程管理
                    <ul data-type="csmanage" class="type2 nav-main-child t-top">
                        <li data-bar="csmail">课程邮箱设置</li>
                    </ul>
                </li>
                <li>
                    作业管理
                    <ul data-type="hwmanage" class="type2 nav-main-child t-top">
                        <li data-bar="hwinfo">作业布置与批改</li>
                        <!--<li data-bar="hwdynamic">作业动态</li>-->
                    </ul>
                </li>
                <li>
                    学生管理
                    <ul data-type="stumanage" class="type2 nav-main-child t-top">
                        <li data-bar="stuinfo">学生信息</li>
                    </ul>
                </li>
                {{/if}}
                <li>帮助</li>
            </ul>
            <div class="welcome">
                <span>您好，{{trueName}}</span>
                <span id="exit" title="退出系统">退出</span>
            </div>
        </div>
    </nav>
    <header>
        <div class="bg">
           <!--提示信息-->
        </div>
    </header>
    <section class="main-content">
        <div id="left-nav" class="left-nav" role="navigation">
            <div class="l-menu" data-type="man"><strong>
                    <!--<span class="man"></span>-->
                    个人中心<span class="bn-slide t-rotate"></span>
            </strong></div>
            <ul class="t-slide">
                <li data-bar="info">个人信息</li>
                <li data-bar="setting">设置</li>
            </ul>
            {{if userType == 'STUDENT'}}
            <div class="l-menu" data-type="hwmanage"><strong>
                <!--<span class="work"></span>-->
                作业管理<span class="bn-slide t-rotate"></span></strong></div>
            <ul class="t-slide">
                <li data-bar="hwinfo">作业提交</li>
                <li data-bar="hwdynamic">作业动态</li>
            </ul>
            {{else if userType == 'TEACHER'}}
            <div class="l-menu" data-type="csmanage"><strong>课程管理<span class="bn-slide t-rotate"></span></strong></div>
            <ul class="t-slide">
                <li data-bar="csmail">课程邮箱设置</li>
            </ul>
            <div class="l-menu" data-type="hwmanage"><strong>
                <!--<span class="work"></span>-->
                作业管理<span class="bn-slide t-rotate"></span></strong></div>
            <ul class="t-slide">
                <li data-bar="hwinfo">作业布置与批改</li>
                <!--<li data-bar="hwdynamic">作业动态</li>-->
            </ul>
            <div class="l-menu" data-type="stumanage"><strong>学生管理<span class="bn-slide t-rotate"></span></strong></div>
            <ul class="t-slide">
                <li data-bar="stuinfo">学生信息</li>
            </ul>
            {{/if}}
        </div>
        <div id="content" class="content"></div>
    </section>
    <div id="dialog-wrap"></div>
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

<%--动态提示--%>
<script type="text/template" id="info-tip-html">
    <!--<div class="info-b">-->
        {{if (data.feedback + data.unsubmitted + data.recentHomework) > 0}}
        <span id="info-btn" class="info-btn info-btn-tip"></span>
        {{else}}
        <span id="info-btn" class="info-btn info-btn-tip"></span>
        {{/if}}
        <div id="info-tip" class="info-tip">
            <div></div>
            <ul>
                {{if userType == 'STUDENT'}}
                <li data-type="newestwork">最新作业<span>{{data.feedback}}</span></li>
                <li data-type="unhand">未提交<span>{{data.unsubmitted}}</span></li>
                <li data-type="feedback">作业反馈<span>{{data.recentHomework}}</span></li>
                {{else if userType == 'TEACHER'}}
                <li data-type="new-hand">最新提交<span>10</span></li>
                <li data-type="unalter">未批改<span>5</span></li>
                <li data-type="t-unhand">未提交<span>3</span></li>
                {{/if}}
            </ul>
        </div>
    <!--</div>-->
</script>

<%--个人中心--%>
<script type="text/template" id="man-info">
    <div class="personal-info">
        <div class="p-name">
            <label><strong>姓名</strong></label>
            <label>{{data.name}}</label>
        </div>
        <div class="p-name">
            <label><strong>性别</strong></label>
            <label>{{data.sex}}</label>
        </div>
        <div class="p-name">
            {{if userType == 'STUDENT'}}
            <label><strong>学号</strong></label>
            <label>{{data.studentNo}}</label>
            {{else if userType == 'TEACHER'}}
            <label><strong>教师号</strong></label>
            <label>{{data.teacherNo}}</label>
            {{/if}}
        </div>
        <div class="p-name">
            <label><strong>校区学院</strong></label>
            <label>{{data.hwCampus.name}}校区-{{data.hwCollege.collegeName}}</label>
        </div>
        {{if userType == 'STUDENT'}}
        <div class="p-name">
            <label><strong>年级班级</strong></label>
            <label>{{data.grade}}级{{data.class_}}班</label>
        </div>
        {{/if}}
        <div class="p-name">
            <label><strong>专业</strong></label>
            <label>{{data.hwMajor.name}}</label>
        </div>
    </div>
    <div class="personal-img">
        <img src="${pageContext.request.contextPath}/resources/skin/images/man.jpg">
    </div>
</script>
<script type="text/template" id="setting-html">
    <div class="set-changepw"><strong>设置密码</strong></div>
    <div class="pw-info">
        <div class="p-name">
            <label><strong>登陆账号</strong></label>
            <label>{{data.username}}</label>
        </div>
        <div class="p-name">
            <label><strong>密码</strong></label>
            <label>*********</label>
        </div>
        <div class="set-changepw-btn">
            <button id="set-changepw-btn" type="button">修改密码</button>
            <div class="set-changepw-submit t-changepw-submit t-changepw-submit-close">
                <div class="set-changepw-old">
                    <label for="old-pw">旧密码</label>
                    <input id="old-pw" name="old-pw" type="password" placeholder="请输入旧密码"/>
                </div>
                <div class="set-changepw-new">
                    <label for="new-pw">新密码</label>
                    <input id="new-pw" name="new-pw" type="password" placeholder="请输入8位以上字符的新密码"/>
                </div>
                <div class="set-changepw-sure">
                    <label for="sure-pw">确认密码</label>
                    <input id="sure-pw" name="sure-pw" type="password" placeholder="请确认密码"/>
                </div>
                <span class="fold-changepw" id="fold-changepw">收起</span>
                <button id="changepw-sure" type="button">确认</button>
            </div>
        </div>
    </div>
    <div class="set-mail"><strong>设置邮箱</strong></div>
    <div class="mail-info">
        <div class="p-name">
            <label><strong>当前邮箱</strong></label>
            <label>{{data.email}}</label>
        </div>
        <div class="p-name">
            <label><strong>邮箱状态</strong></label>
            <label for="mail-state" class="mail-state">
                <div class="mail-switch-wrap">
                    <div class="mail-state-btn t-mail t-mail-open">
                        <input id="mail-state" name="mail-state" type="checkbox" checked/>
                        <span class="mail-switch-on">ON</span>
                        <label for="mail-state"></label>
                        <span class="mail-switch-off">OFF</span>
                    </div>
                </div>
            </label>
        </div>
        <div class="set-mail-btn">
            <button id="set-mail-btn" type="button">修改邮箱</button>
            <div class="set-mail-submit t-mail-submit t-mail-submit-close">
                <div class="set-mail-new">
                    <label for="new-mail">新邮箱：</label>
                    <input id="new-mail" name="new-mail" type="email" placeholder="请输入新邮箱"/>
                </div>
                <div class="set-mail-sure">
                    <label for="sure-mail">验证码：</label>
                    <input id="sure-mail" name="sure-mail" type="email" placeholder="输入邮箱验证码"/>
                </div>
                <span class="fold-mail" id="fold-mail">收起</span>
                <button id="mail-sure" type="button">确认</button>
            </div>
        </div>
    </div>
</script>

<%--课程管理--%>
<script type="text/template" id="cs-mail-html">
    <div class="cs-mail-title">
        <div class="set-changepw cs-mail-setting"><strong>设置课程邮箱</strong></div>
        <div class="course-choice">{{include 'select-course-html'}}</div>
    </div>
    <div class="cs-mail-list">

    </div>
</script>
<script type="text/template" id="cs-mail-list-html">
    <!--<ul>-->
    {{each courselist as value}}
    <li class="cs-mail-green">
        <div class="cs-mail-name">
            <p>{{value.courseName}}</p>
        </div>
        <div class="cs-mail-adr">
            <p>{{value.email}}</p>
        </div>
        <div class="cs-mail-btn t-cs-mail">
            <button class="cs-mail-change" type="submit">修改</button>
            <button class="cs-mail-clear" type="button">取消</button>
            <div class="cs-mail-input">
                <input class="cs-mail-input1" type="email" placeholder="输入新的邮箱"/>
                <button class="cs-mail-sure" type="submit" data-ctId="{{value.ctId}}">确认</button>
            </div>
        </div>
    </li>
    {{/each}}
    <!--</ul>-->
</script>

<%--作业管理--%>
<script type="text/template" id="select-course-html">
    <!--<section class="course-list">-->
        <!--<div class="course-choice">-->
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
        <!--</div>-->
    <!--</section>-->
</script>
<script type="text/template" id="hw-info">
    <!--<div class="load-data"></div>-->
    <section class="course-list">
        <div class="course-list-title">
            <div class="set-changepw cs-mail-setting"><strong>课程列表{{tip}}</strong></div>
            <div class="course-choice">{{include 'select-course-html'}}</div>
        </div>
        <div class="course-list-wrap"></div>
    </section>
    <section class="work-list">
        <div class="return-course-list">
            <span class="return-course-btn" data-cur="2" data-back="1"></span>
            <span>返回课程列表</span>
        </div>
        <div class="work-list-wrap"></div>
    </section>
    <section class="student-list">
        <div class="return-course-list return-course-btn1">
            <span class="return-course-btn" data-cur="3" data-back="1"></span>
            <span>返回课程列表</span>
        </div>
        <div class="return-work-list">
            <span class="return-work-btn" data-cur="3" data-back="2"></span>
            {{if view_type == 'hwmanage'}}
            <span>返回作业列表</span>
            {{else if view_type == 'stumanage'}}
            <span>返回学生列表</span>
            {{/if}}
        </div>
        <div class="student-list-wrap"></div>
    </section>
</script>
<script type="text/template" id="hwmanage-course-list-html">
    <ul>
        {{each courselist as value}}
        <li class="course-work-list course-has-work">
            <div>
                <p>{{value.hwCourse.courseName}}</p>
                <p>课程人数：40人</p>
            </div>
            <div class="work-list-btn t-work-list-btn" data-id="{{value.id}}">
                <span>单击查看该课程作业列表</span>
            </div>
        </li>
        {{/each}}
    </ul>
    <!--</div>-->
</script>
<script type="text/template" id="stumanage-course-list-html">
    <ul>
        {{each courselist as value}}
        <li class="course-work-list course-has-work">
            <div>
                <p>{{value.hwCourse.courseName}}</p>
                <p>课程人数：40人</p>
            </div>
            <div class="stumanage-list-btn t-stumanage-list-btn" data-id="{{value.id}}">
                <span>单击查看该课程学生列表</span>
            </div>
        </li>
        {{/each}}
    </ul>
    <!--</div>-->
</script>
<script type="text/template" id="hwmanage-work-list-html">
    <!--unhand hand remark-->
    {{if userType == 'TEACHER'}}
    {{each worklist as value}}
    <li class="work-student-list work-hand-student {{if value.overtime}}work-overtime-student{{/if}}">
        <div>
            <p>{{value.courseName}}</p>
            <p>{{value.title}}</p>
            <p>共{{value.sum}}人，{{value.submitted}}人已提交</p>
            <p class="deadline-time">{{value.deadline.split(':00')[0] + ':00'}}</p>
            <div class="work-submit-counts" style="height: {{value.submitted / value.sum * 116}}px"><!--数据可视化区域--></div>
        </div>
        <div class="student-list-btn t-student-list-btn">
            <!--<button class="student-list-mark-btn">批改作业</button>-->
            <!--<button class="student-list-delete-btn">删除作业</button>-->
            <div class="student-list-allbtn">
                <span class="student-list-mark-btn" data-hwInfoId="{{value.hwInfoId}}">批改</span>
                <span class="student-list-collect-btn" data-hwInfoId="{{value.hwInfoId}}">收取</span>
                <span class="student-list-remind-btn" data-hwInfoId="{{value.hwInfoId}}">催缴</span>
                <span class="student-list-delete-btn" data-hwInfoId="{{value.hwInfoId}}">删除</span>
            </div>
        </div>
    </li>
    {{/each}}
    <button class="add-work" data-csname="{{worklist[0].courseName}}">新增课程作业</button>
    {{else if userType == 'STUDENT'}}
    {{each worklist as value}}
    {{if value.status == 'UNSUBMITTED'}}
    <li class="work-student-list work-unhand-student {{if value.overtime == true}}work-overtime-student{{/if}}">
        <div>
            <p>{{value.courseName}}</p>
            <p>{{value.title}}</p>
            <p>{{value.deadline.split(':00')[0] + ':00'}}</p>
        </div>
        <div class="hand-in-progress"><!--进度显示--></div>
        {{if value.overtime == true}}
        <div class="hand-in-work t-hand-in">
            <span class="hand-in-work-detail"  data-hwInfoId="{{value.hwInfoId}}">作业详细信息</span>
        </div>
        {{else}}
        <div class="hand-in-work t-hand-in">
            <span class="hand-in-work-btn" data-hwInfoId="{{value.hwInfoId}}">交作业</span>
        </div>
        {{/if}}
    </li>
    {{else if value.status == 'SUBMITTED'}}
    <li class="work-student-list work-hand-student {{if value.overtime == true}}work-overtime-student{{/if}}">
        <div>
            <p>{{value.courseName}}</p>
            <p>{{value.title}}</p>
            <p>{{value.deadline.split(':00')[0] + ':00'}}</p>
        </div>
        <div class="hand-in-progress"><!--进度显示--></div>
        {{if value.overtime == true}}
        <div class="hand-in-work t-hand-in">
            <span class="hand-in-work-detail" data-hwInfoId="{{value.hwInfoId}}">作业详细信息</span>
        </div>
        {{else}}
        <div class="hand-in-work t-hand-in">
            <span class="hand-in-work-btn" data-hwInfoId="{{value.hwInfoId}}">重新交作业</span>
        </div>
        {{/if}}
    </li>
    {{else if value.status == 'MARKED'}}
    <li class="work-student-list work-remark-student {{if value.overtime == true}}work-overtime-student{{/if}}">
        <div>
            <p>{{value.courseName}}</p>
            <p>{{value.title}}</p>
            <p>{{value.deadline.split(':00')[0] + ':00'}}</p>
        </div>
        <div class="hand-in-progress"><!--进度显示--></div>
        <div class="hand-in-work t-hand-in">
            <div class="work-marked-btn">
                <span class="hand-in-work-detail" data-hwInfoId="{{value.hwInfoId}}">作业详细信息</span>
                <span class="hand-in-work-feedback" data-hwInfoId="{{value.hwInfoId}}">作业反馈</span>
            </div>
        </div>
    </li>
    {{else}}
    <li class="work-student-list work-unhand-student">
        <div>
            <p>{{value.courseName}}</p>
            <p>{{value.title}}</p>
            <p>{{value.deadline.split(':00')[0] + ':00'}}</p>
        </div>
        <div class="hand-in-progress"><!--进度显示--></div>
        <div class="hand-in-work t-hand-in">
            <span class="hand-in-work-btn" data-hwInfoId="{{value.hwInfoId}}">交作业</span>
        </div>
    </li>
    {{/if}}
    {{/each}}
    {{/if}}
    <!--</div>-->
</script>
<script type="text/template" id="stumanage-work-list-html">
    {{each worklist as value}}
    {{if value.status == 'UNSUBMITTED'}}
    <li class="work-student-list work-unhand-student {{if value.overtime == true}}work-overtime-student{{/if}}">
    {{else if value.status == 'SUBMITTED'}}
    <li class="work-student-list work-hand-student {{if value.overtime == true}}work-overtime-student{{/if}}">
    {{else if value.status == 'MARKED'}}
    <li class="work-student-list work-remark-student {{if value.overtime == true}}work-overtime-student{{/if}}">
    {{else}}
    <li class="work-student-list work-unhand-student">
    {{/if}}
        <div>
            <p>{{value.title}}</p>
            <p>{{value.studentName}}</p>
            <p>{{value.studentNo}}</p>
        </div>
        <div class="student-list-btn t-student-list-btn">
            <span class="stumanage-mark-work-btn" data-hwInfoId="{{value.id}}">批改作业</span>
        </div>
    </li>
    {{/each}}
</script>
<script type="text/template" id="hwmanage-student-list-html0">
<!--<ul>-->
    {{each studentlist as value}}
    {{if value.status == 'SUBMITTED'}}
    <li class="student-alter-list student-hand-alter">
        <div>
            <p>{{value.title}}</p>
            <p>{{value.studentName}}</p>
            <p>{{value.studentNo}}</p>
            <p>{{value.submitDate.replace(/(:\d{2,2})$/, '')}}</p>
        </div>
        <div class="alter-btn t-alter-btn" data-id="{{value.id}}"><span>单击批改</span></div>
    </li>
    {{else if value.status == 'UNSUBMITTED'}}
    <li class="student-alter-list student-unhand-alter">
        <div>
            <p>{{value.title}}</p>
            <p>{{value.studentName}}</p>
            <p>{{value.studentNo}}</p>
            <p>{{value.submitDate.replace(/(:\d{2,2})$/, '')}}</p>
        </div>
        <!--<div class="alter-btn t-alter-btn" data-id="{{value.id}}"><span>单击批改</span></div>-->
        <div class="nononno" data-id="{{value.id}}"><span>未提交作业</span></div>
    </li>
    {{else if value.status == 'MARKED'}}
    <li class="student-alter-list student-marked-alter">
        <div>
            <p>{{value.title}}</p>
            <p>{{value.studentName}}</p>
            <p>{{value.studentNo}}</p>
            <p>{{value.submitDate.replace(/(:\d{2,2})$/, '')}}</p>
        </div>
        <div class="alter-btn t-alter-btn" data-id="{{value.id}}"><span>重新批改</span></div>
    </li>
    {{/if}}
    {{/each}}
<!--</ul>-->
</script>
<script type="text/template" id="hwmanage-student-list-html">
    <!--<div class="student-list-t">-->
    <ul>
    {{include 'hwmanage-student-list-html0'}}
    </ul>
    <div class="student-list-classify">
        <!--hand-part unhand-part-->
        <button class="student-list-classify-hand choice-part" data-hwInfoId="{{hwInfoId}}">已提交</button>
        <button class="student-list-classify-unhand" data-hwInfoId="{{hwInfoId}}">未提交</button>
    </div>
    <!--</div>-->
</script>
<script type="text/template" id="stumanage-student-list-html">
    <!--<div class="student-list-t">-->
    <ul>
        {{each studentlist as value}}
        <li class="student-alter-list student-hand-alter">
            <div>
                <p>{{value.hwStudent.name}}</p>
                <p>{{value.hwStudent.studentNo}}</p>
            </div>
            <div class="check-btn t-check-btn" data-ctId="{{value.hwCourseTeaching.id}}" data-sId="{{value.hwStudent.id}}">
                <span>单击查看{{value.hwStudent.name}}的作业列表</span>
            </div>
        </li>
        {{/each}}
    </ul>
    <button class="add-student" data-ctId="{{studentlist[0].hwCourseTeaching.id}}">添加学生</button>
    <button class="export-student" data-ctId="{{studentlist[0].hwCourseTeaching.id}}">导出课程学生列表</button>
    <!--</div>-->
</script>
<%--作业动态--%>
<script type="text/template" id="hw-dynamic-html">
    <div class="d-newestwork">
        <div class="d-newestwork-title">
            <strong>最新作业</strong>
            <button class="d-newestwork-unfold">展开</button>
            <button class="d-newestwork-fold">收起</button>
        </div>
        <div class="d-newestwork-list t-newestwork-list"></div>
    </div>
    <div class="d-unhand">
        <div class="d-unhand-title">
            <strong>未提交</strong>
            <button class="d-unhand-unfold">展开</button>
            <button class="d-unhand-fold">收起</button>
        </div>
        <div class="d-unhand-list t-unhand-list"></div>
    </div>
    <div class="d-feedback">
        <div class="d-feedback-title">
            <strong>作业反馈</strong>
            <button class="d-feedback-unfold">展开</button>
            <button class="d-feedback-fold">收起</button>
        </div>
        <div class="d-feedback-list t-feedback-list"></div>
    </div>
</script>

<%--弹框--%>
<script type="text/template" id="dialog-html">
    <!--<div class="wrap">-->
    <div class="dailog-area {{if op == 'add-student'}}add-student-area{{/if}}">
        {{if op == 'add-work'}}
        <div class="dailog-title">
            <p role='title'><strong>新增课程作业</strong></p>
        </div>
        <div class="dailog-body add-work-dailog-body">
            {{include 'add-work-html'}}
        </div>
        {{else if op == 'hand-in'}}
        <div class="dailog-title">
            <p role='title'><strong>交作业</strong></p>
        </div>
        <div class="dailog-body hand-in-dailog-body">
            {{include 'hand-in'}}
        </div>
        {{else if op == 'add-student'}}
        <div class="dailog-title">
            <p role='title'><strong>增加学生</strong></p>
        </div>
        <div class="dailog-body">
            {{include 'add-stu-html'}}
        </div>
        {{else if op == 'work-feedback'}}
        <div class="dailog-title">
            <p role='title'><strong>作业反馈</strong></p>
        </div>
        <div class="dailog-body hand-in-dailog-body">
            {{include 'work-feedback-html'}}
        </div>
        {{else}}
        <div class="dailog-title">
            <p role='title'><strong>操作提示</strong></p>
        </div>
        <div class="dailog-body">
            {{include op}}
        </div>
        {{/if}}
        <span class="clear dailog-clear" title="关闭窗口"></span>
    </div>
    <!--</div>-->
</script>
<script type="text/template" id="delete-sure">
    <p class="delete-sure-text" role="tip">
        确定删除这个作业吗？删除后如果该有学生提交，那么所有学生的作业都将被删除！
        <span>（删除后不可恢复）</span>
    </p>
    <div class="delete-sure-btn">
        <button class="delete-sure-btn1">确定</button>
        <button class="delete-sure-btn2">取消</button>
    </div>
</script>
<script type="text/template" id="mail-incorrect">

</script>
<script type="text/template" id="auth-code">
    <div class="auth-code-sure-text" role="tip">
        <p>系统检测到您的邮箱账号尚未验证，【验证码】已经发送到您邮箱<p>
        <p><a href="{{mail_url}}" target="_blank">点此登陆邮箱{{mail}}</a></p>
        <div class="auth-code">
            <label>填写邮箱验证码</label>
            <input type="text" name="mail"/>
            <button class="auth-code-send-btn">重发</button>
        </div>
    </div>
    <div class="auth-code-sure-btn">
        <button class="auth-code-sure-btn1">取消</button>
        <button class="auth-code-sure-btn2">提交并修改</button>
    </div>
</script>
<script type="text/template" id="add-work-html">
    <div class="add-work-course">
        <label>课程名</label>
        <p>{{csname}}</p>
    </div>
    <div class="add-work-name">
        <label>作业名</label>
        <input name="name" type="text" placeholder="作业名" required/>
    </div>
    <div class="add-work-desc">
        <label>作业描述</label>
        <textarea name="desc" placeholder="可以填写作业注意事项，难度，要求等信息" required></textarea>
    </div>
    <div class="add-work-marktype">
        <label>评分标准</label>
        <select>
            <option value="HUNDRED" selected>百分制</option>
            <option value="TEN">十分制</option>
            <option value="FIVE">五分制</option>
            <option value="CHAR_LEVEL">ABCDE等级制</option>
            <option value="CHINESE_LEVEL">优秀、良好、一般、差等级制</option>
            <option value="PASSING">合格、不合格等级制</option>
        </select>
    </div>
    <div class="add-work-deadline">
        <label for="choice-deadline">截止日期</label>
        <input id="choice-deadline" name="deadline" type="datetime" required readonly/>
    </div>
    <div class="add-submit">
        <button class="dailog-clear">取消</button>
        <button class="add-work-sure" data-id="">发布作业</button>
    </div>
</script>
<script type="text/template" id="add-stu-html">
    <div class="add-stu-choice">
        <label>校区</label>
        <select class="campus-choice">
            <option>石牌校区</option>
            <option>大学城校区</option>
            <option>南海校区</option>
        </select>
        <label>学院</label>
        <select class="college-choice">
            <option>计算机学院</option>
            <option>外国语文化学院</option>
            <option>政治与行政学院</option>
        </select>
        <label>学生姓名或学号</label>
        <input name="add-stu-text" type="text" placeholder="输入学号或姓名"/>
        <button class="add-student-search">搜索</button>
    </div>
    <p class="stu-search-result">搜索结果</p>
    <div class="add-stu-list">
    </div>
    <div class="add-student-page">
        <button class="add-student-sure">确认添加</button>
        <button class="add-student-pre">上一页</button>
        <button class="add-student-next">下一页</button>
    </div>
</script>
<script type="text/template" id="add-stu-list-html">
    <%--<ul>--%>
    {{each studentlist as value}}
    <li class="stu-list-li" data-sId="{{value.id}}">
        <p><strong>{{value.name}}</strong></p>
        <p>{{value.studentNo}}</p>
        <span></span>
    </li>
    <div class="stu-list-li-details" title="点击添加该学生">
        <p><strong>姓名：</strong>{{value.name}}</p>
        <p><strong>学号：</strong>{{value.studentNo}}</p>
        <p><strong>性别：</strong>{{value.sex}}</p>
        <p><strong>校区学院：</strong>{{value.hwCampus.name}}校区{{value.hwCollege.collegeName}}</p>
        <p><strong>年级专业：</strong>{{value.hwMajor.name}}</p>
    </div>
    {{/each}}
    <%--</ul>--%>
</script>
<script type="text/template" id="hand-in">
    <div class="hand-in-course">
        <label>课程名</label>
        <label>{{workdata.courseName}}</label>
    </div>
    <div class="hand-in-name">
        <label>作业名</label>
        <label>{{workdata.title}}</label>
    </div>
    <div class="hand-in-desc">
        <label>作业说明</label>
        <label>{{workdata.hwDesc}}</label>
    </div>
    <div class="hand-in-markstand">
        <label>评分标准</label>
        {{if workdata.markType == 'HUNDRED'}}
        <label>百分制</label>
        {{else if workdata.markType == 'TEN'}}
        <label>十分制</label>
        {{else if workdata.markType == 'FIVE'}}
        <label>五分制</label>
        {{else if workdata.markType == 'CHAR_LEVEL'}}
        <label>ABCDE等级制</label>
        {{else if workdata.markType == 'CHINESE_LEVEL'}}
        <label>优秀、良好、一般、差等级制</label>
        {{else}}
        <label>合格、不合格等级制</label>
        {{/if}}
    </div>
    <div class="hand-in-create">
        <label>作业发布时间</label>
        <label>{{workdata.createDate}}</label>
    </div>
    <div class="hand-in-deadline">
        <label>截止上交时间</label>
        <label>{{workdata.deadline}}</label>
    </div>
    {{if !detail}}
    <div class="work-upload">
        <label for="work-file">上传作业</label>
        <input id="work-file" name="hw" type="file"/>
        <label></label>
    </div>
    {{/if}}
    <div class="work-submit">
        <button class="dailog-clear">取消</button>
        <button class="work-submit-sure" data-hwinfoId="{{workdata.id}}">提交作业</button>
    </div>
    <!--</div>-->
</script>
<script type="text/template" id="work-feedback-html">
    <div class="work-feedback-score">
        <label>作业得分</label>
        <label>{{workdata.mark}}</label>
    </div>
    <div class="work-feedback-comment">
        <label>教师评语</label>
        <label>{{workdata.comment}}</label>
    </div>
    <div class="work-submit">
        <button class="dailog-clear">关闭</button>
    </div>
</script>

<%--进度加载条--%>
<script type="text/template" id="loadtip-html">
    <!--<div class="loadtip-wrap">-->
        <div class="lg-shade-tip loadtip-progess">
            <p><strong>正在加载中...</strong></p>
            <span class="t-load t-load-start"></span>
        </div>
    <!--</div>-->
</script>