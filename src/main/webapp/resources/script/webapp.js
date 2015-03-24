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

    function ajaxRead (model, view, url, data, fun) {
        model.sync('read', view, {
            url: servicepath + url,
            data: data,
            dataType: 'json',
            success: fun,
            error: function (o, e) {
                console.log(e);
            }
        });
    }

    var TypeModel = Backbone.Model.extend({
        default: {
            'tip': '正在加载...'
        }
    });

    var TypeView = Backbone.View.extend({
        model: null,
        tmpl_id: null,
        $content: null,
        constructor: function (obj) {
            console.log(obj);
            this.model = obj.model;
            this.tmpl_id = obj.tmpl_id;
            this.$content = obj.$content;
            this.listenTo(this.model, "change", this.render);
        },
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function () {
            console.log('render');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            this.$content.html(ele);
        }
    });

    // 学生作业视图类
    var StudentListView = Backbone.View.extend({
        targetName: 'div',
        className: 'student-list-t',
        tmpl_id: 'student-list',
        events: {

        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-stuentwork');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            console.log(this.el)
            this.model.attributes.$studentlist.children('.student-list-wrap').html(this.el);
        }
    });

    //作业视图类
    var WorkListView = Backbone.View.extend({
        targetName: 'div',
        className: 'work-list-t',
        tmpl_id: 'work-list',
        events: {
            'click .student-list-btn': 'showStudentList', // 教师查看每个学生的作业
            'click .hand-in-work': 'handInWork' // 学生交作业
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-work');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$worklist.children('.work-list-wrap').html(this.el);
        },
        showStudentList: function (e) {
            console.log('查看学生的作业列表');
            var that = this;
            this.model.attributes.$worklist.parent().replaceClass('hw-content-wrap-3', 'hw-content-wrap-2')
            var studentmodel = new TypeModel;
            var studentview = new StudentListView({
                model: studentmodel
            });
            studentmodel.sync('read', studentview, {
                url: servicepath + 'homework/homeworkList',
                data: {hwInfoId: 1, submited: true},
                dataType: 'json',
                success: function (data) {
                    console.log('学生作业', data);
                    studentmodel.set({
                        studentlist: data.data,
                        $studentlist: that.model.attributes.$worklist.next()
                    });
                }
            });
        },
        handInWork: function () {

        }
    });

    // 课程视图类，生成作业信息所有模板
    var CourseView = Backbone.View.extend({
        targetName: 'div',
        className: 'course-list',
        tmpl_id: 'course-list',
        events: {
            'click .work-list-btn': 'showWorkList' // 查看该课程的作业列表
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-course');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$courselist.children('.course-list-wrap').html(this.el);
        },
        showWorkList: function (e) {
            var that = this;
            this.model.attributes.$courselist.parent().replaceClass('hw-content-wrap-2', 'hw-content-wrap-1');
            var id = $(e.currentTarget).attr('data-id');
            var workmodel = new TypeModel;
            var workview = new WorkListView({model: workmodel});
            workmodel.sync('read', workview, {
                url: servicepath + 'homework/homeworkInfoList',
                data: {cid: id},
                dataType: 'json',
                success: function (data) {
                    console.log('作业信息', data);
                    console.log(window.userType);
                    workmodel.set({
                        worklist: data.data,
                        userType: sessionStorage.userType,
                        $worklist: that.model.attributes.$courselist.next()
                    });
                }
            });
        }
    });

    var HwInfoView = Backbone.View.extend({
        targetName: 'div',
        className: 'hw-content-wrap hw-content-wrap-k hw-content-wrap-1',
        $tmpl: $('#hw-info'),
        events: {
            'click .return-course-btn': 'slideHwContentWrap', // 返回课程列表
            'click .return-work-btn': 'slideHwContentWrap', // 返回作业列表
            'click .choice-sure-btn': 'termCourse' // 搜索按钮
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.render(); // 初始化作业信息基本视图
            this.getCourseData(2011, 1);
        },
        render: function () {
            console.log('render-hwinfo');
            $(this.el).html(this.$tmpl.html());
            $('#content').html(this.el);
        },
        slideHwContentWrap: function (e) {
            console.log('返回成功');
            var page = parseInt($(e.currentTarget).attr('data-back'));
            this.$el.replaceClass('hw-content-wrap-' + page.toString(), 'hw-content-wrap-' + (page + 1).toString());
        },
        termCourse: function () {
            var startYear = this.$el.find('.startYear').val(),
                schoolTerm = this.$el.find('.schoolTerm').val();
            this.getCourseData(startYear, schoolTerm);
        },
        getCourseData: function (year, term) {
            var that = this;
            var coursemodel = new TypeModel;
            var courseview = new CourseView({
                model: coursemodel
            });
            that.$el.find('.course-list-wrap').html('正在加载');
            coursemodel.sync('read', courseview, {
                url: servicepath + 'homework/courseList',
                data: {startYear: year, schoolTerm: term},
                dataType: 'json',
                success: function (data) {
                    console.log('课程信息', data);
                    coursemodel.set({
                        courselist: data.data,
                        $courselist: that.$el.children('.course-list')
                    });
                },
                error: function (o, e) {
                    console.log(e);
                }
            });
        }
    });

    // 应用总视图
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
        models: {},
        views: {},
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
            this.type = 'hwmanage';
            this.bar = 'hwdynamic';
            approuter.navigate('main/hwmanage/hwdynamic', {trigger: false});
            this.closeType(this.$old_el);
            this.activeBar(this.$old_bar, false);
            this.showState(this.type, this.bar);
        },
        showBarInfo: function (e) {
            var that = this,
                $curli = $(e.currentTarget);
            this.bar = $curli.attr('data-bar');
            var datatype = this.type + '/' + this.bar;
            window.approuter.navigate('main/' + this.type + '/' + this.bar, {trigger: false});
            this.activeBar(this.$old_bar, false);
            this.activeBar($curli, true);
            this.$old_bar = $curli;
            // 获取数据病渲染UI
            switch (datatype){
                case  'man/info':
                    that.getInfoData();
                    break;
                case  'man/changepw':
                    break;
                case  'man/setmail':
                    break;
                case  'hwmanage/hwinfo':
                    that.getHwInfo();
                    break;
                case 'hwmanage/hwdynamic':
                    break;
                default:
                    console.log('没有找到相关类型');
            }
        },
        getInfoData: function () {
            var that = this;
            that.models.infomodel = that.models.infomodel || new TypeModel();
            that.views.infoview = that.views.infoview || new TypeView({
                model: that.models.infomodel,
                tmpl_id: 'man-info',
                $content: that.$content
            });
            that.models.infomodel.sync('read', that.views.infoview, {
                url: servicepath + 'user/info',
                data: null,
                dataType: 'json',
                success: function (data) {
                    console.log('个人数据加载成功！', data);
                    sessionStorage.userType = data[0].userType; // 记录全局用户类型
                    that.models.infomodel.set({
                        userType: data[0].userType,
                        name: data[1].name,
                        sex: data[1].sex,
                        teacherNo: data[1].teacherNo,
                        studentNo: data[1].studentNo,
                        hwCollege: data[1].hwCollege.collegeName,
                        hwMajor: data[1].hwMajor.name,
                        hwCampus: data[1].hwCampus
                    });
                },
                error: function (o, e) {
                    console.log(e);
                }
            });
        },
        getPwData: function () {

        },
        getHwInfo: function () { // 获取课程信息
            var that = this;
            that.views.hwinfoview = that.views.hwinfoview || new HwInfoView;
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
