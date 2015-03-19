/**
 * Created by zqc on 2015/3/9.
 */


define(['jquery-plugin', 'underscore', 'backbone'], function(require, exports, module) {

    var $ = require('jquery-plugin').$;
    var _ = require('underscore');
    var Backbone = require('backbone');
    Backbone.$ = $; // 使用cmd时需要手动引入$

    var HomeWork = Backbone.Model.extend({
        initialize: function () {
            console.log('model');
        },
        default: {
            done: false
        },
        toggle: function () {
            this.save({done: !this.get('done')});
        }
    });

    var InfoList = Backbone.Collection.extend({
        model: InfoModel
    });

    var infolist = new InfoList;

    var InfoModel = Backbone.Model.extend({
        default: {
            'tip': '正在加载...'
        }
    });

    var InfoView = Backbone.View.extend({
        tagName: 'div',
        initialize: function () {
            _.bindAll(this, 'render');
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render');
            var ele = _.template($('#man-info').html())(this.model.toJSON());
            this.$el.html(ele);
            return this;
        }
    });

    var AppView = Backbone.View.extend({ // 滑动视图，应用程序主视图类
        el: $('#main'),
        events: {
            'click': 'docEvent', // 隐藏一些弹出框
            'click #left-nav>.l-menu': 'togSlide', // 左侧菜单栏选项事件
            'click #left-nav>ul>li': 'showBarInfo', // 点击左侧菜单栏显示对应信息
            'click #info-btn': 'showTip', // 显示信息提示框
            'click #info-tip>ul>li': 'showInfoTip', // 单击提示条时加载相应信息
            'click #exit': 'exitApp' // 退出系统
        },
        $old_el: null,
        $old_bar: null,
        $tip_btn: null,
        $lghtml: $('#login-html'), // 保存登陆页面的html代码
        $mainhtml: $('#main-html'),
        $content: null,
        type: null, // 视图类型
        bar: null, // 视图子类型
        constructor: function (type, bar) {
            Backbone.View.apply(this, arguments);
            this.type = type;
            this.bar = bar;
            this.initView();
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.$old_el = $('#left-nav .l-menu').first().next();
            this.$tip_btn = $('#info-btn');
            this.$content = $('#content');
            console.log('进入webapp');
            console.log(this.type , this.bar);
//            this.$el.find('#left-nav>.l-menu[data-type="hkmanage"]').click();
            console.log(this.$el.find('#left-nav>.l-menu[data-type="hkmanage"]'));
        },
        initView: function () {
            var that = this;
            setTimeout(function () { // 待视图对象初始化后，恢复到刷新前状态
                var $that_type = that.$el.find('#left-nav>.l-menu[data-type="' + that.type + '"]');
                that.$old_bar = $that_type.next().find('li[data-bar="' + that.bar + '"]');
                $that_type.click(); // 模拟点击事件，展开左侧详细菜单项
                that.$old_bar.addClass('l-active');  // 选中菜单项
            }, 100);
        },
        render: function () {
            // 执行渲染
        },
        togSlide: function (e) { // 滑动切换
            var $temp_el = $(e.currentTarget);
            var ul = $temp_el.next(), // 获取ul元素
                span = $temp_el.find('span.t-rotate');
            this.type = $temp_el.attr('data-type'); // 获取用户点击的菜单项type
            if (this.$old_el[0] === ul[0]) {
                if (ul.hasClass('t-close')) {
                    ul.replaceClass('t-open', 't-close');
                    span.replaceClass('t-rotate-open', 't-rotate-close');
                }
                else {
                    ul.replaceClass('t-close', 't-open');
                    span.replaceClass('t-rotate-close', 't-rotate-open');
                }
            }
            else {
                this.$old_el.replaceClass('t-close', 't-open');
                this.$old_el.prev().find('span.t-rotate').replaceClass('t-rotate-close', 't-rotate-open');
                ul.replaceClass('t-open', 't-close');
                span.replaceClass('t-rotate-open', 't-rotate-close');
                this.$old_el = ul;
            }
        },
        docEvent: function () {
            this.$tip_btn.next().hide();
        },
        showTip: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.$tip_btn.next().show();
        },
        showInfoTip: function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log($(e.currentTarget).attr('data-type'))
        },
        showBarInfo: function (e) {
            var $curli = $(e.currentTarget);
            this.bar = $curli.attr('data-bar');
            window.approuter.navigate('main/' + this.type + '/' + this.bar, {trigger: false});
            this.$old_bar.removeClass('l-active');
            $curli.addClass('l-active');
            this.$old_bar = $curli;

            if(this.type == 'man' && this.bar == 'info'){
//                var infoview = new InfoView({model: InfoModel});
                var infomodel = new InfoModel();

                var infoview = new InfoView({model: infomodel});
                infomodel.sync('read', infoview, {
                    url: 'http://localhost:8080/mvnhk/student/studentDetail',
                    data: {sid: 1},
                    dataType: 'json',
                    success: function (data) {
                        console.log('数据加载成功！', data);
                    },
                    error: function (o, e) {
                        console.log(e);
                    }
                });

                infomodel.set({
                    name: '陈培峰',
                    sn: '20112100187',
                    college: '计算机学院',
                    major: '网络工程'
                });
                console.log(infoview.el)
                console.log(this.$content)
                this.$content.html(infoview.el)
            }
        },
        exitApp: function () {
            console.log('退出');
            var that = this;
            this.$el.prev().html(this.$lghtml.html());
            setTimeout(function () {
                //that.$el.prev().children().replaceClass('t-login-open', 't-login-close');
            },100);
            //this.$el.prev().children().replaceClass('t-login-open', 't-login-close');
        }
    });

    module.exports = {
        appView: function (type, bar) {
            console.log('创建webapp对象');
            console.log(type, bar);
            var a = new AppView(type, bar);
            console.log(a);
        }
    }

});
