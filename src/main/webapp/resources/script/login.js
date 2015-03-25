/**
 * Created by zqc on 2015/3/13.
 */

define(function(require, exports, module) {

    var $ = require('jquery-plugin').$;
    var _ = require('underscore');
    var Backbone = require('backbone');
    var tmpl = require('template');
    Backbone.$ = $; // 使用cmd时需要手动引入$

    window.approuter = null; // 全局路由常量

    // 登陆view模块
    var lgView = Backbone.View.extend({
        events: {
            'click': 'hideFailTip',
            'click #lg-fail-tip>span': 'hideFailTip',
            'click #login-btn': 'loginApp',
            'keydown input': 'loginApp'
        },
        initialize: function () {
            this.initHeight(); // 初始化登陆视窗高度
        },
        initHeight: function () {
            var wh = window.innerHeight; // 视窗高度
            this.$el.find('#login-p').css('height', wh + 'px');
        },
        loginApp: function (e) {
            e.stopPropagation();
            switch (e.type){
                case 'click':
                    this.loginTest();
                    break;
                case 'keydown':
                    (e.which || e.keyCode) == 13 && this.loginTest();
                    break;
                default :
                    return;
            }
        },
        hideFailTip: function (e) {
            $('#lg-fail-tip').hide();
        },
        loginTest: function () { // 用户登录信息检测
            var that = this,
                un = this.$el.find('#lg-info input[type="text"]').val(),
                pw = this.$el.find('#lg-info input[type="password"]').val();
            this.showLoad(); // 显示登陆进度提示
            $.ajax({
                url: 'http://localhost:8080/mvnhk/login/logincheck',
                type: 'post',
                data: {username: un, password: pw},
                dataType: 'json',
                timeOut: 10000,
                success: function (data) {
                    if(data.msg == 'success'){
                        console.log('登陆成功');
                        sessionStorage.userType = data.userType; // 记录全局用户类型
                        sessionStorage.userName = data.userName; // 记录全局用户类型
                        that.loginSuccess('man', 'info');
                    }
                    else{
                        console.log(data.msg);
                        that.hideLoad();
                        $('#lg-fail-tip').show(500);
                    }
                },
                error: function (xhr, error, obj) {
                    console.error(error);
                }
            });
        },
        loginSuccess: function (type, bar) {
            // 登陆成功后，改变url，触发相应路由地址的操作
            window.approuter.navigate('main/' + type + '/' + bar, {
                trigger: true
            });
        },
        showLoad: function () {
            var $shade = this.$el.find('#lg-shade');
            $shade.show();
            setTimeout(function () {
                $shade.find('.t-load').addClass('t-load-start');
            }, 100);
        },
        hideLoad: function () {
            var $shade = this.$el.find('#lg-shade');
            $shade.find('.t-load').removeClass('t-load-start');
            $shade.hide();
        },
        slidePage: function () {
            this.$el.children().replaceClass('t-login-close', 't-login-open');
            approuter.$lghtml.html(this.$el.html());
        }
    });

    // 主控制器
    var AppRouter = Backbone.Router.extend({
        routes: {
            ':part(/:type/:bar)': 'jmpPart'
        },
        view: null,
        $lghtml: $('#login-html'), // 保存登陆页面的html代码
        $mainhtml: $('#main-html'),
        $view_el: $('#login'),
        $main_el: $('#main'),
        initialize: function () {
            this.navigate('login', {trigger:true}); // 设置登录路由地址
        },
        jmpPart: function (part, type, bar) { // 页面切换
            var that =this;
            if(part == 'login'){ // 登录页面
                this.$view_el.html(this.$lghtml.html()); // 显示登陆界面代码
                if(this.view == null){
                    this.view = new lgView({el: this.$view_el});
                    this.$lghtml.html(this.$view_el.html());
                }
                else
                    this.view.initialize();
                setTimeout(function () {
                    that.view.$el.children().replaceClass('t-login-open', 't-login-close');
                    setTimeout(function () {
                        that.$main_el.children().remove(); // 删除主界面代码
                    }, 900);
                },50);
            }
            else if(part == 'main'){ // 应用程序主界面
                if(that.view == null){ // 登陆后，用户主动刷新页面
                    require.async(['webapp', 'webapp.css'], function (webapp) {
                        // 执行主页面渲染
                        that.$main_el.html(tmpl(that.$mainhtml.attr('id'), {
                            userType: sessionStorage.userType,
                            username: sessionStorage.userName
                        }));
                        // 执行主页面各种事件绑定，数据加载
                        webapp.appView(type, bar);
                    });
                }
                else { // 从登陆界面进入主界面
                    require.async(['webapp', 'webapp.css'], function (webapp) {
                        // 执行主页面渲染
                        that.$main_el.html(tmpl(that.$mainhtml.attr('id'), {
                            userType: sessionStorage.userType,
                            username: sessionStorage.userName
                        }));
                        // 执行主页面各种事件绑定，数据加载
                        webapp.appView(type, bar);
                        that.view.hideLoad();
                        that.view.slidePage();
                        // 设置定时器，从DOM中删除登陆页面的html代码，并将其保存在script中
                        setTimeout(function () {
                            that.view.$el.find('#login-p').remove();
                        }, 1500);
                    });
                    this.view.$el.find('#lg-shade .lg-shade-tip').addClass('t-success');
                }
            }
        }
    });

    exports.loginHw = function () { // 暴露登陆接口
        $(function () {
            // 创建全局路由，控制器
            window.approuter =  new AppRouter;
            // 开启路由历史记录
            Backbone.history.start({
                pushState: true,
                root: '/mvnhk/web/'
            });
        });
    };

});