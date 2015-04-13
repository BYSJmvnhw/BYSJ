/**
 * Created by zqc on 2015/4/10.
 */

define(function (require, exports, module) {

    var React = require('React');
    var cellComponent = require('cellcomponent');
    var _ = require('underscore'); // 框架依赖模块
    var $ = require('jquery');

    var serverpath = 'http://localhost:8080/mvnhk/';

   // 检测服务端session是否过期，若过期则跳转到登陆页面
    // @param status 后台session状态
    var checkSession = cellComponent.checkSession;

    // 用户管理组件
    var UserManage = require('usermanage').UserManage;

    // 课程管理组件
    var CsManage = require('csmanage').CsManage;

    // 选课管理组件
    var TakeManage = require('takemanage').TakeManage;

    // 教师管理组件
    var TeacherManage = require('teachermanage').TeacherManage;

    // 学生管理组件
    var StudentManage = require('studentmanage').StudentManage;

    var AppView = React.createClass({
        getInitialState: function () { return {curWrap: 't-content-wrap2'}; },
        userManage: function () { this.setState({curWrap: 't-content-wrap1'}); },
        csManage:function () { this.setState({curWrap: 't-content-wrap2'}); },
        takeManage: function () { this.setState({curWrap: 't-content-wrap3'}); },
        teacherManage: function () {this.setState({curWrap: 't-content-wrap4'}); },
        studentrManage: function () { this.setState({curWrap: 't-content-wrap5'}); },
        render: function () {
            return (
                <div>
                    <header className="box-style">
                        <span className="h-logo"></span>
                        <p>作业网后台管理系统</p>
                        <div className="h-info box-style">
                            <p>您好，超级管理员</p>
                            <a href="javascript:void(0)" onClick={this.exitApp}>退出</a>
                        </div>
                    </header>
                    <section className="main-content">
                        <div className="menu-bar" role="menu">
                            <ul className="box-style">
                                <li className="t-hover" onClick={this.userManage}>用户管理</li>
                                <li className="active-li t-hover" onClick={this.csManage}>课程管理</li>
                                <li className="t-hover" onClick={this.takeManage}>选课管理</li>
                                <li className="t-hover" onClick={this.teacherManage}>教师管理</li>
                                <li className="t-hover" onClick={this.studentrManage}>学生管理</li>
                            </ul>
                        </div>
                        <div className="content">
                            <div className={"content-wrap t-content-wrap box-style " + this.state.curWrap} ref="contentWrap">
                                <section id="content-wrap1">
                                    <UserManage />
                                </section>
                                <section id="content-wrap2">
                                    <CsManage url={serverpath + "course/searchCourse"} />
                                </section>
                                <section id="content-wrap3">
                                    <TakeManage url={serverpath + "course/courseTeachingList"} />
                                </section>
                                <section id="content-wrap4">
                                    <TeacherManage url={serverpath}/>
                                </section>
                                <section id="content-wrap5">
                                    <StudentManage url={serverpath + "student/searchStudent"}/>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>
                );
        },
        exitApp: function () {
            $.ajax({
                url: serverpath + 'login/logout',
                type: 'get',
                data: null,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('退出', data);
                    appNavigate('login', '登陆作业网后台管理系统', {trigger: true});
                }
            });
        }
    });

    module.exports = {
        enterApp: function (type, bar) {
            React.render(<AppView type={type} bar={bar}/>, document.getElementById('manage-part'));
        }
    }

});

