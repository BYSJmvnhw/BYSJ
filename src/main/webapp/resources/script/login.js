/**
 * Created by zqc on 2015/3/13.
 */

define(function(require, exports, module) {

    var $ = require('jquery-plugin').$;
    var _ = require('underscore');
    var Backbone = require('backbone');
    Backbone.$ = $; // 使用cmd时需要手动引入$
    //seajs.use('webapp.css');
    //seajs.use('login.css');
    var lgView = Backbone.View.extend({
        el: $('#login'),
        $lghtml: $('#login-html'), // 保存登陆页面的html代码
        $mainhtml: $('#main-html'),
        events: {
            'click #login-btn': 'loginApp',
            'keydown input': 'loginApp'
        },
        initialize: function () {
            _.bindAll(this, 'render');

            var wh = window.innerHeight; // 视窗高度
            this.$el.find('#login-p').css('height', wh + 'px');
            //this.$el.next().html(this.$mainhtml.html());
        },
        loginApp: function (e) {
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
        loginTest: function () { // 用户登录信息检测
            var un = this.$el.find('#lg-info input[type="text"]').val(),
                pw = this.$el.find('#lg-info input[type="password"]').val();
            //this.showLoad()
            this.loginSuccess();
            this.slidePage();
            //$.ajax({
            //    url: 'url',
            //    type: 'post',
            //    data: {username: un, password: pw},
            //    dataType: 'json',
            //    timeOut: 10000,
            //    success: function (data) {
            //        if(data.state == 'success'){
            //            console.log('登陆成功');
            //        }
            //        else{
            //
            //        }
            //    },
            //    error: function (xhr, error, obj) {
            //        console.error(error);
            //    }
            //});
        },
        loginSuccess: function () {
            var that = this;
            require.async('./webapp.js?v=201503', function (webapp) {
                // 执行主页面渲染
                that.$el.next().html(that.$mainhtml.html());

                // 执行主页面各种事件绑定，数据加载
                webapp.slideBar();

                // 设置定时器，从DOM中删除登陆页面的html代码，并将其保存在script中
                setTimeout(function () {
                    that.$lghtml.html(that.$el.find('#login-p').remove());
                }, 1500);

            });
            //this.$lghtml = this.$el.find('#login-p').remove();
            //console.log(this.$lghtml);
            this.$el.find('#lg-shade .lg-shade-tip').addClass('t-success');
        },
        showLoad: function () {
            this.$el.find('#lg-shade').show();
            //this.$el.find('#lg-shade .lg-shade-tip>span').css('background-position-x', '1000px');
            //this.$el.find('#lg-shade .lg-shade-tip>span').addClass('t-load-start');
        },
        slidePage: function () {
            this.$el.children().replaceClass('t-login-close', 't-login-open');
        }
    });
    //console.error('未定义');
    //console.log(new lgView());

    exports.loginHw = function () { // 暴露登陆接口
        $(function ($) {
            //var wh = window.innerHeight, // 视窗高度
            //    $login = $('#login');
            //$login.css('height', wh + 'px');
            //$('#login-btn').click(function () {
            //    $login.children().replaceClass('t-login-close', 't-login-open');
            //    seajs.use('webapp.css');
            //    //$login.children('section').slideUp(500, function () {
            //    //    console.log($login.children('section').remove());
            //    //});
            //});
            new lgView;
        });
    };

});