/**
 * Created by zqc on 2015/3/9.
 */


define(['jquery-plugin', 'underscore', 'backbone', 'template'], function(require, exports, module) {

    var $ = require('jquery-plugin').$;
    var _ = require('underscore');
    var Backbone = require('backbone');
    var tmpl = require('template');
    Backbone.$ = $; // 使用cmd时需要手动引入$
    var servicepath = 'http://localhost:8080/mvnhk/';
//    var data = {
//        title: '标签',
//        list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
//    };
//    var html = tmpl('test', data);
//    console.log(html);
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
            var ele = tmpl('man-info', this.model.toJSON());
            this.$el.html(ele);
            return this;
        }
    });

    var AppView = Backbone.View.extend({ // 滑动视图，应用程序主视图类
        el: $('#main'),
        events: {
            'click': 'docEvent', // 隐藏一些弹出框
            'click #nav-main>li>ul>li': 'showStateData', // 顶栏菜单
            'click #left-nav>.l-menu': 'togSlide', // 左侧菜单栏选项事件
            'click #left-nav>ul>li': 'showBarInfo', // 点击左侧菜单栏显示对应信息
            'click #info-btn': 'showTip', // 显示信息提示框
            'click #info-tip>ul>li': 'showInfoTip', // 单击提示条时加载相应信息
            'click #exit': 'exitApp' // 退出系统
        },
        $old_el: null,
        $old_bar: null,
        $tip_btn: null,
        $content: null,
        type: null, // 视图类型
        bar: null, // 视图子类型
        constructor: function (type, bar) {
            Backbone.View.apply(this, arguments);
            this.type = type;
            this.bar = bar;
            this.render();
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.$old_el = $('#left-nav .l-menu').first().next();
            this.$tip_btn = $('#info-btn');
            this.$content = $('#content');
            console.log('初始化webapp');
        },
        initView: function () {
            var that = this;
            setTimeout(function () { // 待视图对象初始化后，恢复到刷新前状态
                that.showState(that.type, that.bar);
            }, 100);
        },
        render: function () {
            // 执行渲染
            this.initView();
        },
        closeType: function ($type) {
            $type.replaceClass('t-close', 't-open');
            $type.prev().find('span.t-rotate').replaceClass('t-rotate-close', 't-rotate-open');
            return $type;
        },
        openType: function ($type) {
            $type.replaceClass('t-open', 't-close');
            $type.prev().find('span.t-rotate').replaceClass('t-rotate-open', 't-rotate-close');
            return $type;
        },
        activeBar: function ($bar, active) {
            if(active){
                $bar.addClass('l-active');
            }
            else{
                $bar.removeClass('l-active');
            }
            return $bar;
        },
        showState: function (type, bar) {
            var $that_type = this.$el.find('#left-nav>.l-menu[data-type="' + type + '"]');
            var $that_bar = $that_type.next().find('li[data-bar="' + bar + '"]');
            this.$old_bar = $that_bar;
            $that_bar.click();
            this.$old_el = this.openType($that_type.next());
        },
        showStateData: function (e) {
            var $ele = $(e.currentTarget),
                type = $ele.parent().attr('data-type'),
                bar = $ele.attr('data-bar');
            approuter.navigate('main/' + type + '/' + bar, {trigger: false});
            this.closeType(this.$old_el);
            this.activeBar(this.$old_bar, false);
            this.showState(type, bar);
        },
        togSlide: function (e) { // 滑动切换
            var $temp_el = $(e.currentTarget),
                $ul = $temp_el.next(); // 获取ul元素
            this.type = $temp_el.attr('data-type'); // 获取用户点击的菜单项type
            if (this.$old_el[0] === $ul[0]) {
                if ($ul.hasClass('t-close')) {
                    this.openType($ul);
                }
                else {
                    this.closeType($ul);
                }
            }
            else {
                this.closeType(this.$old_el);
                this.$old_el = this.openType($ul);
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
            e.stopPropagation();
            this.type = 'hkmanage';
            this.bar = 'hkdynamic';
            window.approuter.navigate('main/hkmanage/hkdynamic', {trigger: false});
            console.log($(e.currentTarget).attr('data-type'));
            this.closeType(this.$old_el);
            this.activeBar(this.$old_bar, false);
            this.showState(this.type, this.bar);
        },
        showBarInfo: function (e) {
            console.log(e.currentTarget);
            var that = this,
                $curli = $(e.currentTarget);
            this.bar = $curli.attr('data-bar');
            window.approuter.navigate('main/' + this.type + '/' + this.bar, {trigger: false});
            this.activeBar(this.$old_bar, false);
            this.activeBar($curli, true);
            this.$old_bar = $curli;
            if(this.type == 'man' && this.bar == 'info'){
//                var infoview = new InfoView({model: InfoModel});
                var infomodel = new InfoModel();

                var infoview = new InfoView({model: infomodel});
                infomodel.sync('read', infoview, {
                    url: servicepath + 'user/info',
                    data: null,
                    dataType: 'json',
                    success: function (data) {
                        console.log('数据加载成功！', data);
                        infomodel.set({
                            name: data[1].name,
                            'sex': data[1].sex,
                            sn: data[1].teacherNo || data[1].studentNo,
                            college: data[1].hwCollege.collegeName,
                            major: data[1].hwMajor.name
                        });
                        that.$content.html(infoview.el);
                    },
                    error: function (o, e) {
                        console.log(e);
                    }
                });
            }
        },
        exitApp: function () {
            approuter.navigate('login', {trigger: true});
        }
    });

    module.exports = {
        appView: function (type, bar) {
            console.log('创建webapp对象');
            if(window.appview){
                appview.constructor(type,bar); // 传入初始参数，改变原有对象
            }
            else{
                window.appview = new AppView(type, bar); // 新建view对象
            }
        }
    }

});
