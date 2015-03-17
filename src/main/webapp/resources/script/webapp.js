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

    var HkList = Backbone.Collection.extend({
        model: HomeWork,
        done: function () {
            return this.filter(function (hk) {
                return hk.get('done');
            });
        }
    });

    var info = Backbone.View.extend({
        el: $('.welcome'),
        events: {
            'click #exit': 'exit'
        },
        initialize: function () {
            //_.bindAll(this, 'render');
            //hks.bind('change', this.render);
        },
        exit: function () {
            console.log('exit');
        },
        render: function () {
            console.log('render');
        }
    });

    var SlideBar = Backbone.View.extend({ // 滑动视图
        el: $('#main'),
        events: {
            'click': 'docEvent',
            'click #left-nav>.l-menu': 'togSlide', // 左侧菜单栏选项事件
            'click #info-btn': 'showTip', // 显示信息提示框
            'click #info-tip>ul>li': 'infoTip', // 单击提示条时加载相应信息
            'click #exit': 'exitApp' // 退出系统
        },
        $old_el: null,
        $tip_btn: null,
        $lghtml: $('#login-html'), // 保存登陆页面的html代码
        $mainhtml: $('#main-html'),
        initialize: function () {
            _.bindAll(this, 'render');
            this.$old_el = $('#left-nav .l-menu').first().next();
            this.$tip_btn = $('#info-btn');
            console.log('进入webapp');
            //console.log($('#left-nav'));
            console.log(this.el);
            //$('#left-nav').css('background', 'black');
            //console.log(this.old_el);
        },
        togSlide: function (e) { // 滑动切换
            var $temp_el = $(e.currentTarget);
            var ul = $temp_el.next(), // 获取ul元素
                span = $temp_el.find('span.t-rotate');
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
        infoTip: function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log($(e.currentTarget).attr('data-type'))
        },
        exitApp: function () {
            console.log('退出')
            var that = this;
            this.$el.prev().html(this.$lghtml.html());
            setTimeout(function () {
                //that.$el.prev().children().replaceClass('t-login-open', 't-login-close');
            },100);
            //this.$el.prev().children().replaceClass('t-login-open', 't-login-close');
        }
    });

    module.exports = {
        slideBar: function () {
            console.log('创建webapp对象');
            new SlideBar;
        }
    }

});
