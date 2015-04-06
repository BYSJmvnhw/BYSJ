/**
 * Created by 郑权才 on 15-4-6.
 */

define(function(require, exports, module) {

    // 引入模块依赖
    var $ = require('jquery-plugin').$; // jq,dom处理模块
    var _ = require('underscore'); // 框架依赖模块
    var Backbone = require('backbone'); // 主框架模块
    var tmpl = require('template'); // js模板引擎模块

    // 使用cmd时需要手动引入$
    Backbone.$ = $;

    var CommonObject = require('webapp-common');

    // ajax请求服务端地址
    var servicepath = CommonObject.servicepath,

        // 检测服务端session是否过期，若过期则跳转到登陆页面
        // @param status 后台session状态
        checkSession = CommonObject.checkSession,

        // 公共模型类
        TypeModel = CommonObject.TypeModel,

        // 公共类视图模板
        TypeView = CommonObject.TypeView,

        // ajax远程数据加载进度条
        LoadTipView = CommonObject.LoadTipView,

        // 设置中心视图，学生，教师兼有
        SettingView = CommonObject.SettingView,

        // 弹出框公共视图类
        DialogView = CommonObject.FDialogView,

        //  作业列表 [父类]
        WorkListView = CommonObject.FWorkListView,

        // 课程列表 [父类]
        CourseListView = CommonObject.FCourseListView,

        // 作业管理、学生管理 [父类]
        HwInfoView = CommonObject.FHwInfoView;

    // 学生上交作业 [视图][弹框]
    var HandInView = DialogView.extend({
        events: {
            'click .work-submit-sure': 'submitWork', // 点击提交按钮
            'click .dailog-clear': 'closeDialog', // 关闭提交窗口
            'change #work-file': 'showFileName' // 展示上传的文件名
        },
        submitWork: function (e) {
            console.log('html5 上传');
            var that= this,
                file = this.$el.find('#work-file')[0].files[0],
                hwinfoId = $(e.currentTarget).attr('data-hwinfoId'),
                formData = new FormData(),
                flieupload = new XMLHttpRequest();
            formData.append('hw', file);
            formData.append('hwinfoId', hwinfoId);
            flieupload.upload.addEventListener("progress", function (evt) {
                var  $p = that.model.attributes.$progesss;
                if (evt.lengthComputable) {
                    that.closeDialog();
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    $p.css('height', percentComplete.toString() + '%');
                    $p.text(percentComplete.toString() + '%');
                }
                if (evt.loaded == evt.total){
                    $p.parent().replaceClass('work-hand-student', 'work-unhand-student');
                    $p.next().text('单击重新提交');
                    $p.remove();
                }
            }, false);
            flieupload.open("POST", servicepath + 'homework/upload');
            flieupload.onreadystatechange = function () {
                if(flieupload.readyState == 4 && flieupload.status == 200){
                    console.log(JSON.parse(flieupload.responseText));
                }
            };
            flieupload.send(formData);
        },
        showFileName: function (e) { // 显示上传文件的名字
            $(e.currentTarget).next().html($(e.currentTarget).val().split('\\').pop());
        }
    });

    // 作业管理->作业信息->课程列表->作业列表 [视图][学生]
    var hwmanageWorkListView = WorkListView.extend({
        tmpl_id: 'hwmanage-work-list-html',
        events: {
            'click .add-work': 'addWork', // 教师添加作业
            'click .student-list-delete-btn': 'deleteWork', // 教师删除作业
            'click .student-list-mark-btn': 'showStudentList', // 教师查看该作业每个学生的提交
            'click .hand-in-work': 'handInWork' // 学生交作业
        },
        handInWork: function (e) {
            console.log('交作业');
            var that = this,
                $progress = $(e.currentTarget).prev(),
                loadtip = new LoadTipView($progress),
                hwInfoId = $(e.currentTarget).attr('data-hwInfoId'),
                handinmodel = new TypeModel,
                handinview = new HandInView({
                    model: handinmodel
                });
            handinmodel.sync('read', handinview, {
                url: servicepath + 'homework/homeworkInfoDetail',
                data: {hwInfoId: hwInfoId},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('作业详细信息', data);
                    handinmodel.set({
                        detaillist: data,
                        op: 'hand-in',
                        $wrap: $('#dialog-wrap'),
                        $progesss: $progress
                    });
                    loadtip = null;
                }
            });
        },
        addWork: function (e) {
            var that = this,
                csname = $(e.currentTarget).attr('data-csname'),
                addworkmodel = new TypeModel,
                addworkview = new AddWorkView({
                    model: addworkmodel
                });
            addworkmodel.set({
                op: 'add-work',
                cid: that.model.attributes.cid,
                csname: csname,
                fetchWorklist: function () {
                    that.model.fetch({
                        url: servicepath + 'homework/homeworkInfoList',
                        data: {cid: that.model.attributes.cid},
                        success: function (m, d) {
                            checkSession(d.status);
                            m.set({worklist: d});
                        }
                    });
                },
                $wrap: $('#dialog-wrap')
            });
            require.async('calendar'); // 加载日期选择模块
        },
        // 教师删除作业
        deleteWork: function (e) {
            console.log('删除作业');
            var that = this,
                $p = $(e.currentTarget).parent(),
                hwInfoId = $p.attr('data-hwinfoid'),
                dialogmodel = new TypeModel(),
                dialogview = new DeleteWorkView({
                    model: dialogmodel
                });
            dialogmodel.set({
                op: 'delete-sure',
                hwInfoId: hwInfoId,
                $workli: $p.parent(),
                $wrap: $('#dialog-wrap')
            });
        },
        // 学生作业列表
        showStudentList: function (e) {
            console.log('查看学生的作业列表');
            var that = this,
                $section2 = this.nextSection(),
                $wrap3 = $section2.next().children('.student-list-wrap'),
                loadtip = new LoadTipView($wrap3),
                hwInfoId = $(e.currentTarget).parent().attr('data-hwinfoid');
            this.studentmodel = this.studentmodel || new TypeModel;
            this.studentview = this.studentview || new HwmanageStudentListView({
                model: this.studentmodel
            });
            that.studentmodel.sync('read', that.studentview, {
                url: servicepath + 'homework/homeworkList',
                data: {hwInfoId: hwInfoId, submited: true},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('学生作业', data);
                    that.studentmodel.set({
                        studentlist: data.data,
                        $wrap3: $wrap3
                    });
                    loadtip = null;
                }
            });
        }
    });

    // 作业管理->作业信息->课程列表 [视图][学生]
    var HwmanageCourseListView = CourseListView.extend({
        tmpl_id: 'hwmanage-course-list-html',
        events: {
            'click .work-list-btn': 'showWorkList' // 查看该课程的作业列表
        },
        showWorkList: function (e) {
            var that = this,
                $section1 = that.nextSection(),
                $wrap2 = $section1.next().children('.work-list-wrap'),
                loadtip = new LoadTipView($wrap2);
            var id = $(e.currentTarget).attr('data-id');
            this.workmodel = this.workmodel || new TypeModel();
            this.workview = this.workview || new hwmanageWorkListView({model: this.workmodel});
            that.workmodel.sync('read', that.workview, {
                url: servicepath + 'homework/homeworkInfoList',
                data: {cid: id},
                dataType: 'json',
                success: function (data) {
                    console.log('作业信息', data);
                    checkSession(data.status);
                    that.workmodel.set({
                        worklist: data,
                        cid: id, // 授课关系id
                        $wrap2: $wrap2
                    });
                    that.workmodel.changedAttributes() && that.workview.render();
                    loadtip = null;
                }
            });
        }
    });

    // 作业管理 [视图][学生]
    var WorkInfoView = HwInfoView.extend({
        view_type: 'hwmanage',
        initialize: function () {
            this.render(); // 初始化作业信息基本视图
            this.coursemodel = new TypeModel;
            this.courseview = new HwmanageCourseListView({model: this.coursemodel});
            this.getCourseData(2011, 1);
        }
    });

    // 主页动态提示信息 [视图]
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

    // 作业管理->作业动态 [视图][学生]
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
            console.log('作业动态');
            var ele = tmpl(this.tmpl_id, {});
            $(this.el).html(ele);
            $('#content').html(this.el);
            this.delegateEvents(this.events);
            this.preFold(this.model.attributes.tip_type); // 打开最新作业选项卡
        },
        // n 为行数
        togfold: function ($b, n, fold) {
            $b.siblings('button').show();
            $b.hide();
            fold == true ? $b.parent().next().css('height', '0') : $b.parent().next().css('height', (113 * n).toString() + 'px');
        },
        preFold: function (tip_type) {
            console.log('打开最新作业');
            console.log(this.$el.find('.d-' + tip_type + '-unfold'));
            this.$el.find('.d-' + tip_type + '-unfold').click();
        },
        workUnfold: function ($cur, url, type) {
            var that = this,
                $wrap2 = that.$el.find('.d-' + type + '-list'),
                loadtip = new LoadTipView($wrap2),
                newestmodel = new TypeModel,
                newestview = new hwmanageWorkListView({
                    model: newestmodel
                });
            newestmodel.sync('read', newestview, {
                url: servicepath + url,
                data: null,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('最新作业', data);
                    newestmodel.set({
                        worklist: data,
                        $wrap2: $wrap2
                    });
                    var fn = data.length / 3, pn = parseInt(fn);
                    that.togfold($cur, fn > pn ? pn + 1 : pn, false);
                    loadtip = null;
                }
            });
        },
        newestworkUnfold: function (e) {
            this.workUnfold($(e.currentTarget), 'message/recentHomework', 'newestwork');
        },
        newestworkFold: function (e) {
            this.togfold($(e.currentTarget), 0, true);
        },
        unhandUnfold: function (e) {
            this.workUnfold($(e.currentTarget), 'message/recentHomework', 'unhand');
        },
        unhandFold: function (e) {
            this.togfold($(e.currentTarget), 0, true);
        },
        feedbackUnfold: function () {

        },
        feedbackFold: function (e) {
            this.togfold($(e.currentTarget), 0, true);
        }
    });

    // 应用总视图
    var AppView = CommonObject.FAppView.extend({ // 滑动视图，应用程序主视图类
        initialize: function () {
            _.bindAll(this, 'render');
            this.$old_el = $('#left-nav .l-menu').first().next();
            this.$content = $('#content');
            console.log('初始化webapp');
            this.getTipData(); // 获取提示数据
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
                case  'hwmanage/hwinfo':
                    that.getHwInfoData();
                    break;
                case 'hwmanage/hwdynamic':
                    that.getHwDynamic();
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
            tipmodel.set({
                $info_b: that.$el.find('#info-b'),
                unfoldLeftMenu: function (tip_type) {
                    that.tip_type = tip_type;
                    that.type = 'hwmanage';
                    that.bar = 'hwdynamic';
                    appNavigate('main/hwmanage/hwdynamic', that.setSiteTitle(that.type), {trigger: false});
                    that.closeType(that.$old_el);
                    that.activeBar(that.$old_bar, false);
                    that.showState(that.type, that.bar);
                }
            });
        },
        getHwInfoData: function () { // 获取课程信息
            if(this.views.workinfoview){
                this.views.workinfoview.initialize();
            }
            else
                this.views.workinfoview = new WorkInfoView;
        },
        getHwDynamic: function () {
            if(this.models.hwdmodel && this.views.hwdview){
                this.views.hwdview.render();
            }
            else {
                this.models.hwdmodel = new TypeModel;
                this.views.hwdview = new HwDynamicView({
                    model: this.models.hwdmodel
                });
                this.models.hwdmodel.set({
                    tip_type: 'newestwork'
                });
            }
        }
    });

    // 对外提供接口
    module.exports = {
        appView: function (type, bar) {
            console.log('%c创建webapp对象', 'font-size:20px');
            if(window.appview){
                appview.constructor(type,bar); // 传入初始参数，改变原有对象
            }
            else{
                window.appview = new AppView(type, bar); // 新建view对象
            }
            // ajax全局请求设置
            $.ajaxSetup({
                ifModified: true,
                timeout: 5000,
                error: function (xhr, error_txt, error_obj) {
                    console.warn('ajax请求出错，错误xhr：' + xhr);
                    console.warn('ajax请求出错，错误信息：' + error_txt);
                    console.warn('ajax请求出错，错误obj：' + error_obj);
                }
            });
        }
    };
});
