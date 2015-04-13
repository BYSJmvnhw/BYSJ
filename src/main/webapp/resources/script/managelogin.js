/**
 * Created by zqc on 2015/4/10.
 */

define(function(require, exports, module) {

    var React = require('React');
    var _ = require('underscore'); // 框架依赖模块
    var Backbone = require('backbone'); // 主框架模块
    var $ = require('jquery');
    Backbone.$ = $;

    var serverpath = 'http://localhost:8080/mvnhk/',
        imgpath = serverpath + 'resources/skin/images/';

    var Login = React.createClass({displayName: "Login",
        login: function (e) {
            var that = this,
                input = $(e.target).parent().prev().find('input');
            if(input[0].value == '' || input[1].value == ''){
                alert('用户名或密码没有填写');
                return;
            }
            $.ajax({
                url: 'http://localhost:8080/mvnhk/login/logincheck',
                type: 'post',
                data: {username: input[0].value, password: input[1].value},
                dataType: 'json',
                timeOut: 10000,
                success: function (data) {
                    if(data.msg == 'success'){
                        console.log('登陆成功', data);
                        that.loginSuccess('usermanage');
                    }
                    else{
                        alert('用户名或密码错误！');
                        console.log(data.msg);
                    }
                },
                error: function (xhr, error, obj) {
                    console.error(error);
                }
            });
        },
        loginSuccess: function (type) {
            // 登陆成功后，改变url，触发相应路由地址的操作
            appNavigate('main/' + type, '作业网后台管理系统-用户管理', {trigger: true});
        },
        hideLoginDiv: function () {
            $(React.findDOMNode(this.refs.loginDiv)).addClass('login-div-hide');
        },
        render: function () {
            return (
                React.createElement("div", {id: "login-div", className: "login-div t-login-div", ref: "loginDiv"}, 
                    React.createElement("section", {className: "l-up"}, 
                        React.createElement("div", {className: "l-up-txt"}, 
                            React.createElement("div", {className: "txt-img"}, 
                                React.createElement("img", {src: imgpath + "logo.png"})
                            ), 
                            React.createElement("p", null, "作业网后台管理平台")
                        )
                    ), 
                    React.createElement("section", {className: "l-middle"}, 
                        React.createElement("div", {className: "l-input-wrap"}, 
                            React.createElement("div", {className: "l-m-tip"}, "登陆"), 
                            React.createElement("div", {className: "l-input"}, 
                                React.createElement("div", {className: "lg-name"}, 
                                    React.createElement("input", {type: "text", ref: "username", placeholder: "请输入用户名"})
                                ), 
                                React.createElement("div", {className: "lg-pw"}, 
                                    React.createElement("input", {type: "password", ref: "password", placeholder: "请输入密码"})
                                )
                            ), 
                            React.createElement("div", {className: "l-login-btn"}, 
                                React.createElement("button", {onClick: this.login}, "登陆")
                            )
                        )
                    ), 
                    React.createElement("section", {className: "l-down"})
                )
            );
        }
    });

    var AppRouter = Backbone.Router.extend({
        routes: {
            ':part(/:type)': 'jmpPart'
        },
        initialize: function () {
            var that = this;
            window.appNavigate = function (url, title, setting){
                that.navigate(url, setting); // 设置登录路由地址
                document.title = title;
            };
            appNavigate('login', '登陆作业网', {trigger:true}); // 设置登录路由地址
        },
        jmpPart: function (part, type) {
            var that = this;
            if(part == 'login'){
                React.render(React.createElement(Login, null), document.getElementById('login-part'));
            }
            else if(part == 'main') {
                require.async(['manageapp', 'manageapp.css', 'm-dialog.css'], function (manageapp) {
                    var $logindiv = $('#login-div');
                    // 执行主页面渲染
                    manageapp.enterApp(type);
                    // 执行主页面各种事件绑定，数据加载
                    $logindiv.addClass('login-div-hide');
                    // 设置定时器，从DOM中删除登陆页面的html代码，并将其保存在script中
                    setTimeout(function () {
                        $logindiv.remove();
                    }, 1000);
                });
            }
        }
    });

    module.exports.loginManage = function () {
        // 创建全局路由，控制器
        window.approuter =  new AppRouter;
        // 开启路由历史记录
        Backbone.history.start({
            pushState: true,
            root: '/mvnhk/manage/'
        });
    }

});
