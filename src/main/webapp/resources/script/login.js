/**
 * Created by zqc on 2015/3/13.
 */

define(function(require, exports, module) {

    var $ = require('jquery-plugin').$;
    var _ = require('underscore');
    var Backbone = require('backbone');
    Backbone.$ = $; // 使用cmd时需要手动引入$
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
    //seajs.use('webapp.css');
    //seajs.use('login.css');

    window.approuter = null;

    var LoginModel = Backbone.Model.extend({
        default: {
            a: 'test'
        }
    });

    var lgView = Backbone.View.extend({
        el: $('#login'),
        $lghtml: $('#login-html'), // 保存登陆页面的html代码
        $mainhtml: $('#main-html'),
        events: {
            'click': 'hideFailTip',
            'click #lg-fail-tip>span': 'hideFailTip',
            'click #login-btn': 'loginApp',
            'keydown input': 'loginApp'
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.initHeight();
        },
        render: function () {},
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
            //this.showLoad()
            $.ajax({
                url: 'http://localhost:8080/mvnhk/login/logincheck',
                type: 'post',
                data: {username: un, password: pw},
                dataType: 'json',
                timeOut: 10000,
                success: function (data) {
                    if(data.msg == 'success'){
                        console.log('登陆成功');
                        that.loginSuccess('man', 'info');
                        that.slidePage();
                    }
                    else{
                        console.log(data.msg);
                        $('#lg-fail-tip').show(500);
                    }
                },
                error: function (xhr, error, obj) {
                    console.error(error);
                }
            });
        },
        loginSuccess: function (type, bar) {
            var that = this;
            window.approuter.navigate('main/' + type + '/' + bar, {trigger: false});
            require.async('webapp', function (webapp) {
                // 执行主页面渲染
                that.$el.next().html(that.$mainhtml.html());

                // 执行主页面各种事件绑定，数据加载
                webapp.appView(type, bar);

                // 设置定时器，从DOM中删除登陆页面的html代码，并将其保存在script中
                setTimeout(function () {
                    that.$lghtml.html(that.$el.find('#login-p').remove());
                }, 1500);

            });
            this.$el.find('#lg-shade .lg-shade-tip').addClass('t-success');
        },
        showLoad: function () {
            this.$el.find('#lg-shade').show();
        },
        slidePage: function () {
            this.$el.children().replaceClass('t-login-close', 't-login-open');
        }
    });

    var AppRouter = Backbone.Router.extend({
        routes: {
            ':part(/:type/:bar)': 'jmpPart'
        },
        model: null,
        view: null,
        initialize: function () {
            this.navigate('login', {trigger:true});
            this.model = new LoginModel;
            this.view = new lgView({model: this.model});
        },
        login: function () {
            console.log('login');
        },
        jmpPart: function (part, type, bar) { // 页面切换
            if(part == 'login'){ // 登录页面
                this.view.$el.children().css('display', 'block'); // 显示登录界面
                this.view.$el.children().replaceClass('t-login-open', 't-login-close');
            }
            else if(part == 'main'){ // 应用程序主界面
                this.view.$el.children().replaceClass('t-login-close', 't-login-open');
                this.view.loginSuccess(type, bar);
                console.log(type, bar);
            }
        }
    });


    exports.loginHw = function () { // 暴露登陆接口
        $(function () {
            window.approuter =  new AppRouter;
            Backbone.history.start({
                pushState: true,
                root: '/mvnhk/web/'
            });
//            console.log(q);
        });
    };

});