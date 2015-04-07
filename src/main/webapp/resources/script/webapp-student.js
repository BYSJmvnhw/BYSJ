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

        // ajax远程数据加载进度条
        LoadTipView = CommonObject.LoadTipView,

        // 弹出框公共视图类
        DialogView = CommonObject.FDialogView,

        //  作业列表 [父类]
        WorkListView = CommonObject.FWorkListView,

        // 课程列表 [父类]
        CourseListView = CommonObject.FCourseListView,

        // 作业管理、学生管理 [父类]
        HwInfoView = CommonObject.FHwInfoView;

    // 学生上交作业、查看作业详细、查看作业反馈 [视图][弹框]
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
                    $p.next().find('span').text('重新交作业');
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
            'click .hand-in-work-feedback': 'showFeedback',
            'click .hand-in-work-detail': 'showDetail',
            'click .hand-in-work-btn': 'handInWork' // 学生交作业
        },
        hmodel: {},
        hview: {},
        getWorkData: function (type, url, hwInfoId, model_data) {
            var that = this;
            this.hmodel[type] = this.hmodel[type] || new TypeModel;
            this.hview[type] = this.hview[type] || new HandInView({
                model: this.hmodel[type]
            });
            that.hmodel[type].sync('read', that.hview[type], {
                url: servicepath + url,
                data: {hwInfoId: hwInfoId},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('作业信息弹框', data);
                    model_data.workdata = data;
                    that.hmodel[type].set(model_data);
                    !that.hmodel[type].changedAttributes() && that.hview[type].render();
                }
            });
        },
        handInWork: function (e) {
            console.log('交作业');
            var $progress = $(e.currentTarget).parent().prev(),
                hwInfoId = $(e.currentTarget).attr('data-hwInfoId');
            this.getWorkData('handin', 'homework/homeworkInfoDetail', hwInfoId, {
                op: 'hand-in',
                $progesss: $progress
            });
        },
        showFeedback: function (e) {
            console.log('作业反馈');
            var hwInfoId = $(e.currentTarget).attr('data-hwInfoId');
           this.getWorkData('feedback', 'homework/comment', hwInfoId, {
               op: 'work-feedback'
           });
        },
        showDetail: function (e) {
            console.log('作业详细');
            var hwInfoId = $(e.currentTarget).attr('data-hwInfoId');
            this.getWorkData('detail', 'homework/homeworkInfoDetail', hwInfoId, {
                op: 'hand-in',
                detail: true
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
        dmodel: {},
        dview: {},
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
                loadtip = new LoadTipView($wrap2);
            this.dmodel[type] = this.dmodel[type] || new TypeModel;
            this.dview[type] = this.dview[type] || new hwmanageWorkListView({
                model: this.dmodel[type]
            });
            that.dmodel[type].sync('read', that.dview[type], {
                url: servicepath + url,
                data: null,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('动态', data);
                    that.dmodel[type].set({
                        worklist: data,
                        $wrap2: $wrap2
                    });
                    !that.dmodel[type].changedAttributes() && that.dview[type].render();
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
            this.workUnfold($(e.currentTarget), 'message/unSubmited', 'unhand');
        },
        unhandFold: function (e) {
            this.togfold($(e.currentTarget), 0, true);
        },
        feedbackUnfold: function (e) {
            this.workUnfold($(e.currentTarget), 'message/feedback', 'feedback');
        },
        feedbackFold: function (e) {
            this.togfold($(e.currentTarget), 0, true);
        }
    });

    // 应用总视图
    var AppView = CommonObject.FAppView.extend({ // 滑动视图，应用程序主视图类
        tip_type: 'newestwork', // 提示信息类型
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
            this.models.tipmodel = this.models.tipmodel || new TypeModel;
            this.views.tipview = this.views.tipview || new TipInfoView({
                model: this.models.tipmodel
            });
            that.models.tipmodel.sync('read', that.views.tipview, {
                url: servicepath + 'message/message',
                data: null,
                dataType: 'json',
                success: function (data) {
                    console.log('提示信息', data);
                    checkSession(data.status);
                    that.models.tipmodel.set({
                        data: data,
                        $info_b: that.$el.find('.bg'),
                        unfoldLeftMenu: function (tip_type) {
                            that.tip_type = tip_type;
                            console.log(that.tip_type);
                            that.type = 'hwmanage';
                            that.bar = 'hwdynamic';
                            appNavigate('main/hwmanage/hwdynamic', that.setSiteTitle(that.type), {trigger: false});
                            that.closeType(that.$old_el);
                            that.activeBar(that.$old_bar, false);
                            that.showState(that.type, that.bar);
                        }
                    });
                    !that.models.tipmodel.changedAttributes() && that.views.tipview.render();
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
            this.models.hwdmodel = this.models.hwdmodel || new TypeModel;
            this.views.hwdview = this.views.hwdview || new HwDynamicView({
                model: this.models.hwdmodel
            });
            this.models.hwdmodel.set({
                tip_type: this.tip_type
            });
            !this.models.hwdmodel.changedAttributes() && this.views.hwdview.render();
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
