/**
 * Created by zqc on 2015/4/10.
 */

define(function (require, exports, module) {

    var React = require('React');
    var cellComponent = require('cellcomponent');
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

    var AppView = React.createClass({displayName: "AppView",
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
                React.createElement("div", null, 
                    React.createElement("header", {className: "box-style"}, 
                        React.createElement("span", {className: "h-logo"}), 
                        React.createElement("p", null, "作业网后台管理系统"), 
                        React.createElement("div", {className: "h-info box-style"}, 
                            React.createElement("p", null, "您好，超级管理员"), 
                            React.createElement("a", {href: "javascript:void(0)", onClick: this.exitApp}, "退出")
                        )
                    ), 
                    React.createElement("section", {className: "main-content"}, 
                        React.createElement("div", {className: "menu-bar", role: "menu"}, 
                            React.createElement("ul", {className: "box-style " + this.state.activeLi}, 
                                React.createElement("li", {className: "t-hover", onClick: this.userManage}, "用户管理"), 
                                React.createElement("li", {className: "t-hover", onClick: this.csManage}, "课程管理"), 
                                React.createElement("li", {className: "t-hover", onClick: this.takeManage}, "选课管理"), 
                                React.createElement("li", {className: "t-hover", onClick: this.teacherManage}, "教师管理"), 
                                React.createElement("li", {className: "t-hover", onClick: this.studentrManage}, "学生管理")
                            )
                        ), 
                        React.createElement("div", {className: "content"}, 
                            React.createElement("div", {className: "content-wrap t-content-wrap box-style " + this.state.curWrap, ref: "contentWrap"}, 
                                React.createElement("section", {id: "content-wrap1"}, 
                                    React.createElement(UserManage, {url: this.getCurUrl(this.state.curWrap, 't-content-wrap1')})
                                ), 
                                React.createElement("section", {id: "content-wrap2"}, 
                                    React.createElement(CsManage, {url: this.getCurUrl(this.state.curWrap, 't-content-wrap2')})
                                ), 
                                React.createElement("section", {id: "content-wrap3"}, 
                                    React.createElement(TakeManage, {url: this.getCurUrl(this.state.curWrap, 't-content-wrap3')})
                                ), 
                                React.createElement("section", {id: "content-wrap4"}, 
                                    React.createElement(TeacherManage, {url: this.getCurUrl(this.state.curWrap, 't-content-wrap4')})
                                ), 
                                React.createElement("section", {id: "content-wrap5"}, 
                                    React.createElement(StudentManage, {url: this.getCurUrl(this.state.curWrap, 't-content-wrap5')})
                                )
                            )
                        )
                    )
                )
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
            React.render(React.createElement(AppView, {type: type}), document.getElementById('manage-part'));
        }
    }

});

