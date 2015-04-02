/**
 * Created by zqc on 2015/3/9.
 */


define(function(require, exports, module) {

    // 引入模块依赖
    var $ = require('jquery-plugin').$;
    var _ = require('underscore');
    var Backbone = require('backbone');
    var tmpl = require('template');

    // 使用cmd时需要手动引入$
    Backbone.$ = $;

    // ajax请求服务端地址
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

    // 公共模型类
    var TypeModel = Backbone.Model.extend({
        default: {
            'tip': '正在加载...'
        }
    });

    // 公共类视图模板
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

    // 设置中心视图，学生，教师兼有
    var SettingView = Backbone.View.extend({
         tagName: 'div',
        className: 'setting-wrap',
        tmpl_id: 'setting-html',
        events: {
            'click #set-changepw-btn': 'unfoldChangePW', // 修改密码按钮，点击显示修改部分
            'click #set-mail-btn': 'unfoldChangeMail', // 更改邮箱设置
            'click #fold-changepw': 'foldChangePW', // 折叠
            'click #fold-mail': 'foldChangeMail', // 折叠
            'click #changepw-sure': 'changePW', // 确认修改密码
            'click #mail-sure': 'changeMail', // 确认修改邮箱
            'change #mail-state': 'setMailState' // 开启/关闭邮箱收发功能
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-setting');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$content.html(this.el);
        },
        unfoldChangePW: function (e) {
            $(e.currentTarget).next().replaceClass('t-changepw-submit-open', 't-changepw-submit-close');
        },
        unfoldChangeMail: function (e) {
            $(e.currentTarget).next().replaceClass('t-mail-submit-open', 't-mail-submit-close');
        },
        foldChangeMail: function (e) {
            $(e.currentTarget).parent().replaceClass('t-mail-submit-close', 't-mail-submit-open');
        },
        foldChangePW: function (e) {
            $(e.currentTarget).parent().replaceClass('t-changepw-submit-close', 't-changepw-submit-open');
        },
        setMailState: function (e) {
            var $cur = $(e.currentTarget);
            $cur.get(0).checked ? $cur.parent().replaceClass('t-mail-open', 't-mail-close') : $cur.parent().replaceClass('t-mail-close', 't-mail-open');
        },
        changePW: function () {
            var oldpw = this.$el.find('#old-pw').val(),
                newpw = this.$el.find('#new-pw').val(),
                surepw = this.$el.find('#sure-pw').val();
            console.log(oldpw, newpw, surepw);

        },
        changeMail: function () {
            var newmail = this.$el.find('#new-mail').val(),
                authcode = this.$el.find('#sure-mail').val();
            console.log(newmail, authcode)
        }
    });

    // 学生管理->学生列表视图
    var AddStuListView = Backbone.View.extend({
        tagName: 'ul',
        events: {
            'click .stu-list-li': 'addStudent'
        },
        tmpl_id: 'add-stu-list-html',
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render 学生列表');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap.html(this.el);
        },
        addStudent: function () {

        }
    });

    // 弹出框公共视图类
    var DialogView = Backbone.View.extend({
        tagName: 'div',
        className: 'shade-wrap',
        tmpl_id: 'dailog-html',
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap.html(this.el);
        },
        closeHandIn: function () {
            this.$el.hide(300);
        },
        showFileName: function (e) { // 显示上传文件的名字
            $(e.currentTarget).next().html($(e.currentTarget).val().split('\\').pop());
        }
    });

    // 学生上交作业视图，弹框
    var HandInView = DialogView.extend({
        events: {
            'click .work-submit-sure': 'submitWork', // 点击提交按钮
            'click .dailog-clear': 'closeHandIn', // 关闭提交窗口
            'change #work-file': 'showFileName' // 展示上传的文件名
        },
        submitWork: function (e) {
            console.log('上传');
            var name = this.$el.find('#work-file').attr('name');
            var hwinfoId = $(e.currentTarget).attr('data-hwinfoId');
            $.ajax({
                type: 'post',
                url: servicepath + 'homework/upload',
                enctype: "multipart/form-data",
                data: JSON.stringify({hw: name, hwinfoId: hwinfoId}),
//                dataType: 'json',
                success: function (data) {
                    console.log(data);
                },
                error: function (o, e) {
                    console.log(e);
                }
            });
        }
    });

    // 教师新增作业，弹框
    var AddWorkView = DialogView.extend({
        events: {
            'click .add-work-sure': 'submitAddWork',
            'click .dailog-clear': 'closeHandIn',
            'click #choice-deadline': 'choiceDeadline'
        },
        submitAddWork: function () {
            var $t = this.$el,
                that = this;
            var data = $t.find('input, textarea');
            console.log(data, that.model.attributes.cid);
            $.ajax({
                type: 'POST',
                url: servicepath + 'homework/addHomeworkInfo',
                data: {
                    jsonObject: JSON.stringify({
                        title: data[0].value,
                        hwDesc: data[1].value,
                        deadline: Date.parse(new Date(data[2].value)),
                        cid: that.model.attributes.cid
                    })
                },
                dataType: 'json',
                timeOut: 10000,
                success: function (data) {
                    console.log('成功新增作业', data);
                    if(data.msg == 'success')
                        that.closeHandIn(); // 新增成功后，销毁弹框
                    else
                        alert('操作失败！');
                },
                error: function (xhr, error, obj) {
                    console.error(error);
                    alert('操作失败！');
                }
            });
        },
        choiceDeadline: function (e) {
            var that = this;
            e.stopPropagation();
            require.async('calendar', function (MyDate) {
                MyDate.calendar(that.$el.children('.dailog-area'), "4%", 170,
                    function (date) {
                        console.log(date.Format("yyyy-MM-dd-HH"));
                        $(e.currentTarget).val(date.Format("yyyy/MM/dd HH:00"));
                    });
            })
        }
    });

    // 学生信息-增加学生-学生列表弹框，教师才有
    var AddStuView = DialogView.extend({
        events: {
            'click .add-work-sure': 'submitAddWork',
            'click .dailog-clear': 'closeHandIn',
            'click .add-student-search': 'searchStu',
            'click .add-student-pre': 'preStu',
            'click .add-student-next': 'nextStu'
        },
        keyword: '',
        curpage: 1,
        maxpage: null,
        render: function () {
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap.html(this.el);
            this.getStudentData('', this.curpage);
        },
        searchStu: function (e) {
            this.keyword = $(e.currentTarget).prev().val();
        },
        preStu: function () {
            if(this.curpage > 1)
                this.getStudentData(this.keyword, this.curpage - 1);
        },
        nextStu:function () {
            if(this.curpage < this.maxpage)
                this.getStudentData(this.keyword, this.curpage + 1);
        },
        getStudentData: function (keyword, page) {
            var that = this;
            var stumodel = new TypeModel;
            var stuview = new AddStuListView({
                model: stumodel
            });
//            stumodel.sync('read', stuview, {
//                url: servicepath + '',
//                data: {cid: id},
//                dataType: 'json',
//                success: function (data) {
//                    console.log('学生列表', data);
//                    stumodel.set({
//                    });
//                },
//                error: function (o, e) {
//                    console.log(e);
//                }
//            });
            stumodel.set({
                name: 'name',
                No: '20112100168',
                $wrap: that.model.attributes.$wrap.find('.add-stu-list')
            });
        }
    });

    // 学生视图类，教师才有
    var StudentListView = Backbone.View.extend({
        tagName: 'div',
        className: 'student-list',
        tmpl_id: 'student-list',
        events: {
            'click .add-student': 'addStudent', // 添加学生
            'click .check-btn': 'checkStuWork', // 教师查看该生作业
            'click .alter-btn': 'alterStuWork' // 教师批改该作业
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-stuentwork');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$studentlistwrap.html(this.el);
        },
        addStudent: function () {
            console.log('添加学生');
            var addstumodel = new TypeModel;
            var addstuview = new AddStuView({
                model: addstumodel
            });
//            addstumodel.sync('read', addstuview, {
//                url: servicepath + '',
//                data: {cid: id},
//                dataType: 'json',
//                success: function (data) {
//                    console.log('作业信息', data);
//                    addstumodel.set({
//
//                    });
//                },
//                error: function (o, e) {
//                    console.log(e);
//                }
//            });
            addstumodel.set({
                studentlist: [{name: 'aaaa'}],
                op: 'add-student',
                $wrap: $('#add-student-wrap')
            });
        },
        // 教师查看单个学生该课程的所有作业
        checkStuWork: function () {
            var that = this;
            var worklistmodel = new TypeModel;
            var worklistview = new WorkListView({
                model: worklistmodel
            });
            this.model.attributes.$studentlistwrap.parent().parent().replaceClass('hw-content-wrap-3', 'hw-content-wrap-2')
//            worklistmodel.sync('read', worklistview, {
//                url: servicepath + '',
//                data: null,
//                dataType: 'json',
//                success: function (data) {
//                    console.log('该学生的课程作业', data);
//                    worklistmodel.set({
//                    });
//                },
//                error: function (o, e) {
//                    console.log(e);
//                }
//            });
            worklistmodel.set({
                worklist: [{
                    title: '计算机组成原理第一次作业',
                    deadline: '2014nian1'
                }],
                userType: sessionStorage.userType,
                $worklistwrap: that.model.attributes.$studentlistwrap.parent().next().children('.student-list-wrap')
            });
        },
        alterStuWork: function (e) {
            console.log('批改');
            var hwid = $(e.currentTarget).attr('data-id');
            window.open('http://localhost:8080/mvnhk/homework/openword?hwId=' + hwid);
        }
    });

    //作业视图类
    var WorkListView = Backbone.View.extend({
        tagName: 'div',
        className: 'work-list',
        tmpl_id: 'work-list',
        events: {
            'click .add-work': 'addWork', // 教师添加作业
            'click .student-list-btn': 'showStudentList', // 教师查看该作业提交情况
            'click .hand-in-work': 'handInWork' // 学生交作业
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-work');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$worklistwrap.html(this.el);
        },
        addWork: function () {
            var that = this,
                addworkmodel = new TypeModel,
                addworkview = new AddWorkView({
                model: addworkmodel
            });
            addworkmodel.set({
                op: 'add-work',
                cid: that.model.attributes.cid,
                $wrap: $('#add-work-wrap')
            });
            require.async('calendar'); // 加载日期选择模块
        },
        showStudentList: function (e) {
            console.log('查看学生的作业列表');
            var that = this;
            this.model.attributes.$worklistwrap.parent().parent().replaceClass('hw-content-wrap-3', 'hw-content-wrap-2')
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
                        view_type: 'hwmanage',
                        $studentlistwrap: that.model.attributes.$worklistwrap.parent().next().children('.student-list-wrap')
                    });
                }
            });
        },
        handInWork: function (e) {
            console.log('交作业');
            var hwInfoId = $(e.currentTarget).attr('data-hwInfoId');
            var handinmodel = new TypeModel;
            var handinview = new HandInView({
                model: handinmodel
            });
            handinmodel.sync('read', handinview, {
                url: servicepath + 'homework/homeworkInfoDetail',
                data: {hwInfoId: hwInfoId},
                dataType: 'json',
                success: function (data) {
                    console.log('作业详细信息', data);
                    handinmodel.set({
                        detaillist: data,
                        op: 'hand-in',
                        $wrap: $('#hand-in-wrap')
                    });
                },
                error: function (o, e) {
                    console.log(e);
                }
            });
        }
    });

    // 课程视图类
    var CourseView = Backbone.View.extend({
        tagName: 'div',
        className: 'course-list',
        tmpl_id: 'course-list',
        events: {
            'click .work-list-btn': 'showWorkList', // 查看该课程的作业列表
            'click .stumanage-list-btn': 'showStudentList' // 查看该课程所有学生
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
                    workmodel.set({
                        worklist: data,
                        cid: id, // 授课关系id
                        userType: sessionStorage.userType,
                        $worklistwrap: that.model.attributes.$courselist.next().children('.work-list-wrap')
                    });
                },
                error: function (o, e) {
                    console.log(e);
                }
            });
        },
        showStudentList: function (e) {
            console.log('查看该课程的所有学生');
            var that = this;
            this.model.attributes.$courselist.parent().replaceClass('hw-content-wrap-2', 'hw-content-wrap-1');
            var id = $(e.currentTarget).attr('data-id');
            var stulistmodel = new TypeModel;
            var stulistview = new StudentListView({
                model: stulistmodel
            });
//            stulistmodel.sync('read', stulistview, {
//                url: servicepath + '',
//                data: {cid: id},
//                dataType: 'json',
//                success: function (data) {
//                    console.log('作业信息', data);
//                    stulistmodel.set({
//                        userType: sessionStorage.userType,
//                        $worklist: that.model.attributes.$courselist.next()
//                    });
//                },
//                error: function (o, e) {
//                    console.log(e);
//                }
//            });
            stulistmodel.set({
                view_type: 'stumanage',
                studentlist: [{
                    title: '计算机组成原理',
                    studentName: 'chehhh',
                    studentNo: '223333323',
                    submitDate: '2014nian1'
                }],
                $studentlistwrap: that.model.attributes.$courselist.next().children('.work-list-wrap')
            });
        }
    });

    // 信息模版
    var HwInfoView = Backbone.View.extend({
        tagName: 'div',
        className: 'hw-content-wrap hw-content-wrap-k hw-content-wrap-1',
        tmpl_id: 'hw-info',
        events: {
            'click .return-course-btn': 'slideHwContentWrap', // 返回课程列表
            'click .return-work-btn': 'slideHwContentWrap', // 返回作业列表
            'click .choice-sure-btn': 'termCourse' // 搜索按钮
        },
        initialize: function () {
            this.render(); // 初始化作业信息基本视图
            this.getCourseData(2011, 1);
        },
        render: function () {
            console.log('render-hwinfo');
            $(this.el).html(tmpl(this.tmpl_id, {view_type: this.view_type}));
            $('#content').html(this.el);
        },
        slideHwContentWrap: function (e) {
            console.log('返回成功');
            var back = parseInt($(e.currentTarget).attr('data-back')),
                cur = parseInt($(e.currentTarget).attr('data-cur'));
            this.$el.replaceClass('hw-content-wrap-' + back.toString(), 'hw-content-wrap-' + cur.toString());
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
                        view_type: that.view_type,
                        $courselist: that.$el.children('.course-list')
                    });
                },
                error: function (o, e) {
                    console.log(e);
                }
            });
        }
    });

    // 作业信息视图
    var WorkInfoView = HwInfoView.extend({
        view_type: 'hwmanage'
    });

    // 学生信息视图
    var StuInfoView = HwInfoView.extend({
        view_type: 'stumanage'
    });

    // 动态提示信息视图
    var TipInfoView = Backbone.View.extend({
        tagName: 'div',
        className: 'info-b',
        tmpl_id: 'info-tip-html',
        events: {
            'click #info-btn': 'showTip', // 显示信息提示框
            'click #info-tip>ul>li': 'showInfoTip' // 单击提示条时加载相应信息
        },
        initialize: function () {
            var that = this;
            this.listenTo(this.model, "change", this.render);
            $('body').on('click', function () {
                that.hideTip(that);
            });
        },
        render: function () {
            console.log('render-tip');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$info_b.html(this.el);
        },
        showTip: function (e) {
            e.stopPropagation();
            this.$el.find('#info-tip').show(200);
        },
        hideTip: function (obj) {
            obj.$el.find('#info-tip').hide(200);
        },
        showInfoTip: function (e) {
            e.stopPropagation();
            this.model.attributes.unfoldLeftMenu($(e.currentTarget).attr('data-type'));
        }
    });

    // 作业动态视图
    var HwDynamicView = Backbone.View.extend({
        tagName: 'div',
        className: 'hw-dynamic',
        events: {
            'click .d-newestwork-unfold': 'newestworkUnfold',
            'click .d-newestwork-fold': 'newestworkFold',
            'click .d-unhand-unfold': 'unhandUnfold',
            'click .d-unhand-fold': 'unhandFold',
            'click .d-feedback-unfold': 'feedbackUnfold',
            'click .d-feedback-fold': 'feedbackFold'
        },
        tmpl_id: 'hw-dynamic-html',
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            var ele = tmpl(this.tmpl_id);
            $(this.el).html(ele);
            $('#content').html(this.el);
            this.preFold(this.model.attributes.tip_type);
        },
        togfold: function ($b, n, fold) {
            $b.siblings('button').show();
            $b.hide();
            fold == true ? $b.parent().next().css('height', '0px') : $b.parent().next().css('height', '113px');
        },
        preFold: function (tip_type) {
            this.$el.find('.d-' + tip_type + '-unfold').click();
        },
        newestworkUnfold: function (e) {
            var that = this,
                newestmodel = new TypeModel,
                newestview = new WorkListView({
                    model: newestmodel
                });
//            newestmodel.sync('read', newestview, {
//
//            });
            newestmodel.set({
                worklist: [{id: 1, title: '计算这个卡是高科技', deadline: '333333444'}],
                $worklistwrap: that.$el.find('.d-newestwork-list'),
                userType: sessionStorage.userType
            });
            this.togfold($(e.currentTarget), 1, false);
        },
        newestworkFold: function (e) {
            this.togfold($(e.currentTarget), 1, true);
        },
        unhandUnfold: function () {

        },
        unhandFold: function () {

        },
        feedbackUnfold: function () {

        },
        feedbackFold: function () {

        }
    });

    // 课程邮箱设置视图
    var CsMailView = Backbone.View.extend({
        tagName: 'div',
        className: 'cs-mail-wrap',
        tmpl_id: 'cs-mail-html',
        events: {
            'click .cs-mail-change': 'changeMail',
            'click .cs-mail-clear': 'clear',
            'click .cs-mail-sure': 'submitMail'
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-csmail');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap.html(this.el);
        },
        changeMail: function (e) {
            var $cur = $(e.currentTarget);
            $cur.parent().addClass('t-cs-mail-open');
            $cur.next().show();
            $cur.hide();
        },
        clear: function (e) {
            var $cur = $(e.currentTarget);
            $(e.currentTarget).parent().removeClass('t-cs-mail-open');
            $cur.prev().show();
            $cur.hide();
        },
        submitMail: function (e) {
            var $cur = $(e.currentTarget);
            var mail = $cur.prev().prev().val(),
                ac = $cur.prev().val();
            console.log(mail, ac);
        }
    });

    // 应用总视图
    var AppView = Backbone.View.extend({ // 滑动视图，应用程序主视图类
        el: $('#main'),
        events: {
            'click #nav-main>li>ul>li': 'showStateData', // 顶栏菜单
            'click #left-nav>.l-menu': 'togSlide', // 左侧菜单栏选项事件
            'click #left-nav>ul>li': 'showBarInfo', // 点击左侧菜单栏显示对应信息
            'click #exit': 'exitApp' // 退出系统
        },
        $old_el: null,
        $old_bar: null,
        $tip_btn: null,
        $content: null,
        type: null, // 视图类型
        bar: null, // 视图子类型
        tip_type: null, // 提示信息类型
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
            this.$content = $('#content');
            console.log('初始化webapp');
            this.getTipData(); // 获取提示数据
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
        // 获取页面title
        setSiteTitle: function (type) {
            switch (type) {
                case 'man': return '作业网-个人中心';
                case 'csmanage': return '作业网-课程管理';
                case 'hwmanage': return '作业网-作业管理';
                case 'stumanage': return '作业网-学生管理';
                default : return '作业网';
            }
        },
        closeType: function ($type) {
            var nli = $type.children().length;
            $type.removeClass('t-open' + nli);
            $type.prev().find('span.t-rotate').removeClass('t-rotate-open');
            return $type;
        },
        openType: function ($type) {
            var nli = $type.children().length;
            $type.addClass('t-open' + nli);
            $type.prev().find('span.t-rotate').addClass('t-rotate-open');
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
            var $ele = $(e.currentTarget);
            this.type = $ele.parent().attr('data-type');
            this.bar = $ele.attr('data-bar');
            appNavigate('main/' + this.type + '/' + this.bar, this.setSiteTitle(this.type), {trigger: false});
            this.closeType(this.$old_el);
            this.activeBar(this.$old_bar, false);
            this.showState(this.type, this.bar);
        },
        togSlide: function (e) { // 滑动切换
            var $temp_el = $(e.currentTarget),
                $ul = $temp_el.next(); // 获取ul元素
            this.type = $temp_el.attr('data-type'); // 获取用户点击的菜单项type
            console.log($ul.css('height'))
            if (this.$old_el[0] === $ul[0]) {
                if ($ul.css('height') == '0px') {
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
        showBarInfo: function (e) {
            var that = this,
                $curli = $(e.currentTarget);
            this.bar = $curli.attr('data-bar');
            var datatype = this.type + '/' + this.bar;
            appNavigate('main/' + this.type + '/' + this.bar, this.setSiteTitle(this.type), {trigger: false});
            this.activeBar(this.$old_bar, false);
            this.activeBar($curli, true);
            this.$old_bar = $curli;
            // 获取数据病渲染UI
            switch (datatype){
                case  'man/info':
                    that.getInfoData();
                    break;
                case  'man/setting':
                    that.getSettingData();
                    break;
                case 'csmanage/csmail':
                    that.getCsMailData();
                    break;
                case  'hwmanage/hwinfo':
                    that.getHwInfoData();
                    break;
                case 'hwmanage/hwdynamic':
                    that.getHwDynamic();
                    break;
                case  'stumanage/stuinfo':
                    this.GetStuInfoData();
                    break;
                case 'stumanage/':
                    console.log(this.type+this.bar);
                    break;
                default:
                    console.log('没有找到相关类型');
            }
        },
        getTipData: function () {
            var that = this;
            var tipmodel = new TypeModel;
            var tipview = new TipInfoView({
                model: tipmodel
            });
//            tipmodel.sync('read', tipview, {
//                url: servicepath + 'user/info',
//                data: null,
//                dataType: 'json',
//                success: function (data) {
//                    console.log('提示数据！', data);
//                    tipmodel.set({
//                        userType: sessionStorage.userType
//                    });
//                },
//                error: function (o, e) {
//                    console.log(e);
//                }
//            });
            tipmodel.set({
                userType: sessionStorage.userType,
                $info_b: that.$el.find('#info-b'),
                unfoldLeftMenu: function (tip_type) {
                    that.tip_type = tip_type;
                    that.type = 'hwmanage';
                    that.bar = 'hwdynamic';
                    appNavigate('main/hwmanage/hwdynamic', that.setSiteTitle(that.type), {trigger: false});
                    that.closeType(that.$old_el);
                    that.activeBar(that.$old_bar, false);
//                    that.openType(that.$el.find('#left-nav>.l-menu[data-type="' + that.type + '"]'));
                    that.showState(that.type, that.bar);
                }
            });
        },
        getInfoData: function () {
            var that = this;
//            that.models.infomodel ? that.models.infomodel.render() : that.models.infomodel = new TypeModel();
            that.models.infomodel = that.models.infomodel || new TypeModel();
            that.views.infoview = new TypeView({
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
                    that.models.infomodel.set({
                        userType: sessionStorage.userType,
                        data: data,
                        random: Math.random()
                    });
                },
                error: function (o, e) {
                    console.log(e);
                }
            });
        },
        getSettingData: function () {
            var that = this;
//            that.models.settingmodel ? that.models.settingmodel.render() : that.models.settingmodel = new TypeModel();
            that.models.settingmodel = that.models.settingmodel || new TypeModel();
            that.views.settingview = new SettingView({
                model: that.models.settingmodel
            });

//            that.models.settingmodel.sync('read', that.views.settingview, {
//                url: servicepath + '',
//                data: null,
//                dataType: 'json',
//                success: function (data) {
//                    console.log('设置中心！', data);
//                    that.models.settingmodel.set({
//                        userType: sessionStorage.userType
//                    });
//                },
//                error: function (o, e) {
//                    console.log(e);
//                }
//            });
            console.log('setting');
            that.models.settingmodel.set({
                userType: sessionStorage.userType,
                $content: that.$content,
                random: Math.random()
            });

        },
        getHwInfoData: function () { // 获取课程信息
            this.views.workinfoview = new WorkInfoView;
        },
        getHwDynamic: function () {
            var hwdmodel = new TypeModel;
            new HwDynamicView({
                model: hwdmodel
            });
            hwdmodel.set({
                tip_type: this.tip_type
            });
        },
        getCsMailData: function () {
            var that = this;
            this.models.csmailmodel = new TypeModel;
            this.views.csmailview = new CsMailView({
                model: this.models.csmailmodel
            });
//            this.models.csmailmodel.sync('read', this.views.csmailview, {
//                url: servicepath + '',
//                data: null,
//                dataType: 'json',
//                success: function (data) {
//                    console.log('课程邮箱', data);
//                    that.models.csmailmodel.set({
//                        userType: sessionStorage.userType,
//                        data: data,
//                        random: Math.random()
//                    });
//                },
//                error: function (o, e) {
//                    console.log(e);
//                }
//            });
            this.models.csmailmodel.set({
                $wrap: that.$content
            });
        },
        GetStuInfoData: function () {
            this.views.stuinfoview = new StuInfoView;
        },
        exitApp: function () {
            $.ajax({
                url: servicepath + 'login/logout',
                type: 'get',
                data: null,
                dataType: 'json',
                timeOut: 10000,
                success: function (data) {
                    console.log('退出', data);
                    appNavigate('login', '登陆作业网', {trigger: true});
                },
                error: function (xhr, error, obj) {
                    console.error(error);
                }
            });
        }
    });

    // 对外提供接口
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
