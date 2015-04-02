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
        <div id="info-b">
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
    {{if userType == 'STUDENT'}}
    <div id="hand-in-wrap"></div>
    {{else if userType == 'TEACHER'}}
    <div id="add-work-wrap"></div>
    <div id="add-student-wrap"></div>
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

<script type="text/template" id="info-tip-html">
    <!--<div class="info-b">-->
        <span id="info-btn" class="info-btn"></span>
        <div id="info-tip" class="info-tip">
            <div></div>
            <ul>
                {{if userType == 'STUDENT'}}
                <li data-type="newestwork">最新作业<span>10</span></li>
                <li data-type="unhand">未提交<span>5</span></li>
                <li data-type="feedback">作业反馈<span>3</span></li>
                {{else if userType == 'TEACHER'}}
                <li data-type="new-hand">最新提交<span>10</span></li>
                <li data-type="unalter">未批改<span>5</span></li>
                <li data-type="t-unhand">未提交<span>3</span></li>
                {{/if}}
            </ul>
        </div>
    <!--</div>-->
</script>

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
            <label>20112100167</label>
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
                    <input id="old-pw" name="old-pw" type="password" />
                </div>
                <div class="set-changepw-new">
                    <label for="new-pw">新密码</label>
                    <input id="new-pw" name="new-pw" type="password" />
                </div>
                <div class="set-changepw-sure">
                    <label for="sure-pw">确认密码</label>
                    <input id="sure-pw" name="sure-pw" type="password" />
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
            <label>1234567@126.com</label>
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
                    <input id="new-mail" name="new-mail" type="email" />
                </div>
                <div class="set-mail-sure">
                    <label for="sure-mail">验证码：</label>
                    <input id="sure-mail" name="sure-mail" type="email" />
                </div>
                <span class="fold-mail" id="fold-mail">收起</span>
                <button id="mail-sure" type="button">确认</button>
            </div>
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
<script type="text/template" id="course-list">
    <ul>
        {{each courselist as value}}
        <li class="course-work-list course-has-work">
            <div>
                <p>{{value.hwCourse.courseName}}</p>
                <p>课程人数：40人</p>
            </div>
            {{if view_type == 'hwmanage'}}
            <div class="work-list-btn t-work-list-btn" data-id="{{value.id}}">单击查看该课程作业列表</div>
            {{else if view_type == 'stumanage'}}
            <div class="stumanage-list-btn t-stumanage-list-btn" data-id="{{value.id}}">单击查看该课程学生列表</div>
            {{/if}}
        </li>
        {{/each}}
    </ul>
    <!--</div>-->
</script>
<script type="text/template" id="work-list">
    <!--<div class="work-list-t">-->
    <ul>
        {{each worklist as value}}
        <!--unhand hand remark-->
        <li class="work-student-list work-unhand-student">
            <div>
                <p>{{value.title}}</p>
                <p>共{{value.sum}}人，{{value.submitted}}人已提交</p>
                <p>{{value.deadline.split(':00')[0] + ':00'}}</p>
            </div>
            {{if userType == 'TEACHER'}}
            <div class="student-list-btn t-student-list-btn" data-hwInfoId="{{value.hwInfoId}}">单击批改作业</div>
            {{else if userType == 'STUDENT'}}
            <div class="hand-in-progress"><!--进度显示--></div>
            <div class="hand-in-work t-hand-in" data-hwInfoId="{{value.hwInfoId}}">单击交作业</div>
            {{/if}}
        </li>
        {{/each}}
    </ul>
    {{if userType == 'TEACHER'}}
    <button class="add-work">新增课程作业</button>
    {{/if}}
    <!--</div>-->
</script>
<script type="text/template" id="dailog-html">
    <!--<div class="wrap">-->
    <div class="dailog-area {{if op == 'add-student'}}add-student-area{{/if}}">
        <div class="dailog-title">
            <p role='title'>
                {{if op == 'add-work'}}
                <strong>新增课程作业</strong>
                {{else if op == 'hand-in'}}
                <strong>交作业</strong>
                {{else if op == 'add-student'}}
                <strong>增加学生</strong>
                {{/if}}
            </p>
        </div>
        {{if op == 'add-work'}}
        <div class="dailog-body add-work-dailog-body">
            {{include 'add-work-html'}}
        </div>
        {{else if op == 'hand-in'}}
        <div class="dailog-body">
            {{include 'hand-in'}}
        </div>
        {{else is op == 'add-student'}}
        <div class="dailog-body">
            {{include 'add-stu-html'}}
        </div>
        {{/if}}
        <span class="clear dailog-clear" title="关闭窗口"></span>
    </div>
    <!--</div>-->
</script>
<script type="text/template" id="add-work-html">
    <div class="add-work-course">
        <label>课程名</label>
        <label>计算机组成原理</label>
    </div>
    <div class="add-work-name">
        <label>作业名</label>
        <input name="name" type="text" placeholder="作业名" required/>
    </div>
    <div class="add-work-desc">
        <label>作业描述</label>
        <textarea name="desc" placeholder="可以填写作业注意事项，难度，要求等信息" required></textarea>
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
        <label>学生姓名或学号</label>
        <input name="add-stu-text" type="text" />
        <button class="add-student-search">搜索</button>
        <button class="add-student-pre">上一页</button>
        <button class="add-student-next">下一页</button>
    </div>
    <div class="add-stu-list">
    </div>
    <div class="add-student-page">
        <button class="add-student-next">上一页</button>
        <button class="add-student-pre">下一页</button>
    </div>
</script>
<script type="text/template" id="add-stu-list-html">
    <%--<ul>--%>
    <li class="stu-list-li">
        <p><strong>{{name}}</strong></p>
        <p>{{No}}</p>
        <span></span>
    </li>
    <%--</ul>--%>
</script>
<script type="text/template" id="hand-in">
    <div class="hand-in-course">
        <label>课程名</label>
        <label>{{detaillist.courseName}}</label>
    </div>
    <div class="hand-in-name">
        <label>作业名</label>
        <label>{{detaillist.title}}</label>
    </div>
    <div class="hand-in-desc">
        <label>作业说明</label>
        <label>{{detaillist.hwDesc}}</label>
    </div>
    <div class="hand-in-create">
        <label>作业发布时间</label>
        <label>{{detaillist.createDate}}</label>
    </div>
    <div class="hand-in-deadline">
        <label>截止上交时间</label>
        <label>{{detaillist.deadline}}</label>
    </div>
    <div class="work-upload">
        <label for="work-file">上传作业</label>
        <input id="work-file" name="hw" type="file"/>
        <label></label>
    </div>
    <div class="work-submit">
        <button class="dailog-clear">取消</button>
        <button class="work-submit-sure" data-hwinfoId="{{detaillist.id}}">提交作业</button>
    </div>
    <!--</div>-->
</script>
<script type="text/template" id="student-list">
    <!--<div class="student-list-t">-->
    <ul>
        {{each studentlist as value}}
        <li class="student-alter-list student-has-alter">
            <div>
                <p>{{value.title}}</p>
                <p>{{value.studentName}}</p>
                <p>{{value.studentNo}}</p>
                <p>{{value.submitDate.split(' ')[0]}}</p>
            </div>
            {{if view_type == 'hwmanage'}}
            <div class="alter-btn t-alter-btn" data-id="{{value.id}}">单击批改</div>
            {{else if view_type == 'stumanage'}}
            <div class="check-btn t-check-btn" data-id="{{value.id}}">单击查看{{value.studentName}}的作业列表</div>
            {{/if}}
        </li>
        {{/each}}
    </ul>
    {{if view_type == 'stumanage'}}
    <button class="add-student">添加学生</button>
    {{/if}}
    <!--</div>-->
</script>

<script type="text/template" id="cs-mail-html">
    <div class="set-changepw"><strong>设置课程邮箱</strong></div>
    <div class="cs-mail-list">
        <ul>
            <li class="cs-mail-green">
                <div class="cs-mail-name">
                    <p>计算机组成原理</p>
                </div>
                <div class="cs-mail-adr">
                    <p>1234566@124.com</p>
                </div>
                <div class="cs-mail-btn t-cs-mail">
                    <button class="cs-mail-change" type="submit">修改</button>
                    <button class="cs-mail-clear" type="button">取消</button>
                    <div class="cs-mail-input">
                        <input class="cs-mail-input1" type="email" placeholder="输入新的邮箱"/>
                        <input class="cs-mail-input2" type="text" placeholder="邮箱验证码"/>
                        <button class="cs-mail-sure" type="submit">确认</button>
                    </div>
                </div>
            </li>
            <li class="cs-mail-green">
                <div class="cs-mail-name">
                    <p>计算机组成原理</p>
                </div>
                <div class="cs-mail-adr">
                    <p>1234566@124.com</p>
                </div>
                <div class="cs-mail-btn t-cs-mail">
                    <button class="cs-mail-change" type="submit">修改</button>
                    <button class="cs-mail-clear" type="button">取消</button>
                    <div class="cs-mail-input">
                        <input class="cs-mail-input1" type="email" placeholder="输入新的邮箱"/>
                        <input class="cs-mail-input2" type="text" placeholder="邮箱验证码"/>
                        <button class="cs-mail-sure" type="submit">确认</button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</script>

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
