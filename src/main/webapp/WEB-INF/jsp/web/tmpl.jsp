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
                    <ul data-type="man" class="type2 nav-main-child t-top">
                        <li data-bar="info">个人信息</li>
                        <li data-bar="setting">设置中心</li>
                    </ul>
                </li>
                <li>
                    作业管理
                    <ul data-type="hwmanage" class="type2 nav-main-child t-top">
                        <li data-bar="hwinfo">作业信息</li>
                        <li data-bar="hwdynamic">作业动态</li>
                    </ul>
                </li>
                {{if userType == 'TEACHER'}}
                <li>
                    课程管理
                    <ul data-type="csmanage" class="type2 nav-main-child t-top">
                        <li data-bar="csinfo">课程信息</li>
                        <li data-bar="csdynamic">作业动态</li>
                    </ul>
                </li>
                <li>
                    学生管理
                    <ul data-type="stumanage" class="type2 nav-main-child t-top">
                        <li data-bar="stuinfo">选课信息</li>
                        <li data-bar="hwdynamic">作业动态</li>
                    </ul>
                </li>
                {{/if}}
                <li>帮助</li>
            </ul>
            <div class="welcome">
                <span>您好，{{userName}}</span>
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
            <div class="l-menu" data-type="man"><strong><span class="man"></span>个人中心<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
            <ul class="t-slide t-close">
                <li data-bar="info">个人信息</li>
                <li data-bar="setting">设置</li>
            </ul>
            {{if userType == 'STUDENT'}}
            <div class="l-menu" data-type="hwmanage"><strong><span class="work"></span>作业管理<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
            <ul class="t-slide t-close">
                <li data-bar="hwinfo">作业提交</li>
                <li data-bar="hwdynamic">作业动态</li>
            </ul>
            {{else if userType == 'TEACHER'}}
            <div class="l-menu" data-type="csmanage"><strong>课程管理<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
            <ul class="t-slide t-close">
                <li data-bar="csmail">课程邮箱设置</li>
            </ul>
            <div class="l-menu" data-type="hwmanage"><strong><span class="work"></span>作业管理<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
            <ul class="t-slide t-close">
                <li data-bar="hwinfo">作业布置与批改</li>
                <!--<li data-bar="hwdynamic">作业动态</li>-->
            </ul>
            <div class="l-menu" data-type="stumanage"><strong>学生管理<span class="bn-slide t-rotate t-rotate-close"></span></strong></div>
            <ul class="t-slide t-close">
                <li data-bar="stuinfo">学生信息</li>
            </ul>
            {{/if}}
        </div>
        <div id="content" class="content"></div>
    </section>
    {{if userType == 'STUDENT'}}
        <div id="hand-in-wrap"></div>
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
                <li data-type="new-work">最新作业<span>10</span></li>
                <li data-type="s-unhand">未提交<span>5</span></li>
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
            <span>返回作业列表</span>
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
            <div class="work-list-btn t-work-list-btn" data-id="{{value.id}}">点击查看课程作业</div>
        </li>
        {{/each}}
    </ul>
    <!--</div>-->
</script>
<script type="text/template" id="work-list">
    <!--<div class="work-list-t">-->
    <ul>
        {{each worklist as value}}
        <li class="work-student-list work-has-student">
            <div>
                <p>{{value.title}}</p>
                <p>共50人，4人未交</p>
                <p>{{value.deadline.split(' ')[0]}}</p>
            </div>
            {{if userType == 'TEACHER'}}
            <div class="student-list-btn t-student-list-btn" data-id="{{value.id}}">单击批改作业</div>
            {{else if userType == 'STUDENT'}}
            <div class="hand-in-work t-hand-in" data-id="{{value.id}}">单击交作业</div>
            {{/if}}
        </li>
        {{/each}}
    </ul>
    <!--</div>-->
</script>
<script type="text/template" id="hand-in">
    <div class="hand-in-wrap">
        <div class="hand-in-area">
            <div class="hand-in-title">
                <p role='title'><strong>交作业</strong></p>
            </div>
            <div class="hand-in-body">
                <div class="hand-in-course">
                    <label>课程：</label>
                    <label>{{detaillist.courseName}}</label>
                </div>
                <div class="hand-in-name">
                    <label>作业：</label>
                    <label>{{detaillist.title}}</label>
                </div>
                <div class="hand-in-desc">
                    <label>作业说明：</label>
                    <label>{{detaillist.hwDesc}}</label>
                </div>
                <div class="hand-in-create">
                    <label>作业发布时间：</label>
                    <label>{{detaillist.createDate}}</label>
                </div>
                <div class="hand-in-deadline">
                    <label>截止上交时间：</label>
                    <label>{{detaillist.deadline}}</label>
                </div>
                <div class="work-upload">
                    <label for="work-file">上传作业</label>
                    <input id="work-file" name="work-file" type="file"/>
                    <label></label>
                </div>
                <div class="work-submit">
                    <button class="work-submit-clear">取消</button>
                    <button class="work-submit-sure" data-id="{{detaillist.id}}">提交作业</button>
                </div>
            </div>
            <span class="clear work-submit-clear" title="关闭窗口"></span>
        </div>
    </div>
</script>
<script type="text/template" id="student-list">
    <!--<div class="student-list-t">-->
    <!--<table>-->

        <!--<thead><th>作业名</th><th>学生名</th><th>学号</th><th>提交时间</th><th>操作</th></thead>-->
        <!--<tbody>-->
        <!--{{each studentlist as value}}-->
        <!--<tr>-->
            <!--<td>{{value.title}}</td>-->
            <!--<td>{{value.studentName}}</td>-->
            <!--<td>{{value.studentNo}}</td>-->
            <!--<td>{{value.submitDate.split(' ')[0]}}</td>-->
            <!--<td><span class="hk-list-btn" data-id="{{value.id}}">批改</span></td>-->
        <!--</tr>-->
        <!--{{/each}}-->
        <!--</tbody>-->
    <!--</table>-->
    <ul>
        {{each studentlist as value}}
        <li class="student-alter-list student-has-alter">
            <div>
                <p>{{value.title}}</p>
                <p>{{value.studentName}}</p>
                <p>{{value.studentNo}}</p>
                <p>{{value.submitDate.split(' ')[0]}}</p>
            </div>
            <div class="alter-btn t-alter-btn" data-id="{{value.id}}">单击批改</div>
        </li>
        {{/each}}
    </ul>
    <!--</div>-->
</script>
