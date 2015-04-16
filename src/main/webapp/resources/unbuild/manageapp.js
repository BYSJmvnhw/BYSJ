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
        getInitialState: function () { return {curWrap: '', activeLi: ''}; },
        userManage: function () {
            this.setState({curWrap: 't-content-wrap1', activeLi: 'active-li1'});
            appNavigate('main/usermanage', '作业网后台管理系统-用户管理', {trigger: true});
        },
        csManage:function () {
            this.setState({curWrap: 't-content-wrap2', activeLi: 'active-li2'});
            appNavigate('main/csmanage', '作业网后台管理系统-课程管理', {trigger: true});
        },
        takeManage: function () {
            this.setState({curWrap: 't-content-wrap3', activeLi: 'active-li3'});
            appNavigate('main/takemanage', '作业网后台管理系统-选课管理', {trigger: true});
        },
        teacherManage: function () {
            this.setState({curWrap: 't-content-wrap4', activeLi: 'active-li4'});
            appNavigate('main/teachermanage', '作业网后台管理系统-教师管理', {trigger: true});
        },
        studentrManage: function () {
            this.setState({curWrap: 't-content-wrap5', activeLi: 'active-li5'});
            appNavigate('main/studentmanage', '作业网后台管理系统-学生管理', {trigger: true});
        },
        appInitialize: function (type) {
            switch (type) {
                case 'usermanage': this.userManage();return;
                case 'csmanage': this.csManage();return;
                case 'takemanage': this.takeManage();return;
                case 'teachermanage': this.teacherManage();return;
                case 'studentmanage': this.studentrManage();return;
                default : this.userManage();
            }
        },
        componentWillMount: function () {
            this.appInitialize(this.props.type);
        },
        componentWillReceiveProps: function (nextProps) {
            this.appInitialize(nextProps.type);
        },
        getCurUrl: function (curWrap, thisWrap) {
            if(curWrap == thisWrap){
                switch (curWrap) {
                    case 't-content-wrap1': return serverpath + 'user/userList';
                    case 't-content-wrap2': return serverpath + "course/searchCourse";
                    case 't-content-wrap3': return serverpath + "course/courseTeachingList";
                    case 't-content-wrap4': return serverpath + 'manageTeacher/searchTeacher';
                    case 't-content-wrap5': return serverpath + "student/searchStudent";
                    default : return '';
                }
            }
            return '';
        },
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
                            <ul className={"box-style " + this.state.activeLi}>
                                <li className="t-hover" onClick={this.userManage}>用户管理</li>
                                <li className="t-hover" onClick={this.csManage}>课程管理</li>
                                <li className="t-hover" onClick={this.takeManage}>选课管理</li>
                                <li className="t-hover" onClick={this.teacherManage}>教师管理</li>
                                <li className="t-hover" onClick={this.studentrManage}>学生管理</li>
                            </ul>
                        </div>
                        <div className="content">
                            <div className={"content-wrap t-content-wrap box-style " + this.state.curWrap} ref="contentWrap">
                                <section id="content-wrap1">
                                    <UserManage url={this.getCurUrl(this.state.curWrap, 't-content-wrap1')}/>
                                </section>
                                <section id="content-wrap2">
                                    <CsManage url={this.getCurUrl(this.state.curWrap, 't-content-wrap2')} />
                                </section>
                                <section id="content-wrap3">
                                    <TakeManage url={this.getCurUrl(this.state.curWrap, 't-content-wrap3')} />
                                </section>
                                <section id="content-wrap4">
                                    <TeacherManage url={this.getCurUrl(this.state.curWrap, 't-content-wrap4')}/>
                                </section>
                                <section id="content-wrap5">
                                    <StudentManage url={this.getCurUrl(this.state.curWrap, 't-content-wrap5')}/>
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
        enterApp: function (type) {
            React.render(<AppView type={type}/>, document.getElementById('manage-part'));
        }
    }

});

