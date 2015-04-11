/**
 * Created by 郑权才 on 15-4-6.
 */

/**
 * Created by zqc on 2015/3/9.
 */

define(function(require, exports, module) {

    // 引入模块依赖
    var $ = require('jquery-plugin').$; // jq,dom处理模块
    var _ = require('underscore'); // 框架依赖模块
    var Backbone = require('backbone'); // 主框架模块
    var tmpl = require('template'); // js模板引擎模块

    // 使用cmd时需要手动引入$
    Backbone.$ = $;

    // ajax请求服务端地址
    var servicepath = 'http://localhost:8080/mvnhk/';

    // 检测服务端session是否过期，若过期则跳转到登陆页面
    // @param status 后台session状态
    function checkSession (status) {
        if(status == 'timeout'){
            alert('会话已过期，请重新登录！');
            window.location.href = servicepath + 'web/login';
        }
    }

    // 用正则检测输入是否符合预期
    // @param type 检测类型(mail num int null chinese eg)
    // @param value 待检测的值
    function checkInput (type, value) {
        var reg = {
//            mail: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
            mail: /^([a-zA-Z0-9_-])+@(sina|sohu|qq|163)((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
            chinese: /^[\u4e00-\u9fa5]+$/,
            authcode: /^[0-9]{13,13}$/,
            pw: /^([0-9]|[A-z]|\W){3,}$/, // 密码输入框，至少8位
            empty: /^$/
        };
        return reg[type] ? reg[type].test(value) : console.warn('不存在的类型');
    }

    // 公共模型类
    var TypeModel = Backbone.Model.extend({
        defaults: {
            userType: localStorage.userType // 模型默认变量
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

    // ajax远程数据加载进度条
    var LoadTipView = Backbone.View.extend({
        tagName: 'div',
        className: 'loadtip-wrap',
        events: {},
        constructor: function ($wrap) {
            Backbone.View.apply(this, arguments);
            this.$wrap = $wrap;
            this.render();
        },
        render: function () {
            console.log('render 加载进度显示');
            var ele = $('#loadtip-html').html();
            $(this.el).html(ele);
            this.$wrap.html(this.el);
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
            this.delegateEvents(this.events);
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
        changePW: function (e) {
            var pw = $(e.currentTarget).parent().find('input');
            if(checkInput('empty', pw[0].value)){pw[0].focus();return;}
            if(!checkInput('pw', pw[1].value)){pw[1].focus();return;}
            if(pw[1].value == pw[2].value){
                $.ajax({
                    type: 'post',
                    url: servicepath + 'user/updatePassword',
                    data: {oldPassword: pw[1].value, newPassword: pw[2].value},
                    dataType: 'json',
                    success: function (data) {
                        checkSession(data.status);
                        console.log('修改密码', data);
                        if(data.status == 'success'){
                            alert('修改成功，请重新登录！');
                            window.location.href = servicepath + 'web/login'; // 跳转到登录页面
                        }
                        else if (data.status == 'error-oldPassword'){
                            alert('旧密码不正确！');
                        }
                        else{
                            alert('操作失败！');
                        }
                    }
                });
            }
            else {
                alert('两次密码输入不一致！');
            }
        },
        changeMail: function (e) {
            var val = $(e.currentTarget).parent().find('input');
            if(!checkInput('mail', val[0].value)){val[0].focus();return;}
            if(!checkInput('authcode', val[1].value)){val[1].focus();return;}
        }
    });

    // 弹出框 [父类]
    var FDialogView = Backbone.View.extend({
        tagName: 'div',
        className: 'shade-wrap',
        tmpl_id: 'dialog-html',
        initialize: function () {
            this.$wrap = $('#dialog-wrap');
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.$wrap.html(this.el);
            this.$el.show();
            this.delegateEvents(this.events);
        },
        closeDialog: function () {
            this.$el.hide(300);
        }
    });

    //  作业列表 [父类]
    var FWorkListView = Backbone.View.extend({
        tagName: 'ul',
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-work');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap2.html(this.el);
            this.delegateEvents(this.events); // 视图渲染完后绑定所有事件
        },
        nextSection: function () {
            var $section2 = this.model.attributes.$wrap2.parent();
            $section2.parent().replaceClass('hw-content-wrap-3', 'hw-content-wrap-2');
            return $section2;
        }
    });

    // 课程列表 [父类]
    var FCourseListView = Backbone.View.extend({
        tagName: 'div',
        className: 'course-list',
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-course');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap1.html(this.el);
            this.delegateEvents(this.events);
        },
        nextSection: function () {
            var $section1 = this.model.attributes.$wrap1.parent();
            $section1.parent().replaceClass('hw-content-wrap-2', 'hw-content-wrap-1');
            return $section1;
        }
    });

    // 作业管理、学生管理 [父类]
    var FHwInfoView = Backbone.View.extend({
        tagName: 'div',
        className: 'hw-content-wrap hw-content-wrap-k hw-content-wrap-1',
        tmpl_id: 'hw-info',
        events: {
            'click .return-course-btn': 'slideHwContentWrap', // 返回课程列表
            'click .return-work-btn': 'slideHwContentWrap', // 返回作业列表
            'click .choice-sure-btn': 'termCourse' // 搜索按钮
        },
        cur: 1,
        render: function () {
            console.log('render-hwinfo');
            $(this.el).html(tmpl(this.tmpl_id, {view_type: this.view_type}));
            $('#content').html(this.el);
            this.delegateEvents(this.events);
            console.log(this.cur);
            this.el.className = this.el.className.replace(/[\d]$/, '1');
            this.getCourseData(2011, 1);
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
            var that = this,
                $wrap1 = that.$el.find('.course-list-wrap'),
                loadtip = new LoadTipView($wrap1);
            that.coursemodel.sync('read', this.courseview, {
                url: servicepath + 'homework/courseList',
                data: {startYear: year, schoolTerm: term},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('课程信息', data);
                    that.coursemodel.set({
                        courselist: data.data,
                        $wrap1: $wrap1
                    });
                    !that.coursemodel.changedAttributes() && that.courseview.render();
                    loadtip = null;
                }
            });
        }
    });

    // 应用总视图
    var FAppView = Backbone.View.extend({ // 滑动视图，应用程序主视图类
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
        models: {},
        views: {},
        constructor: function (type, bar) {
            Backbone.View.apply(this, arguments);
            this.type = type;
            this.bar = bar;
            this.render();
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
        getInfoData: function () {
            var that = this;
            that.models.infomodel = new TypeModel();
            that.views.infoview = new TypeView({
                model: that.models.infomodel,
                tmpl_id: 'man-info',
                $content: that.$content
            });
            var loadtip = new LoadTipView(this.$content);
            that.models.infomodel.sync('read', that.views.infoview, {
                url: servicepath + 'user/info',
                data: null,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('个人数据加载成功！', data);
                    that.models.infomodel.set({
                        data: data
                    });
                    loadtip = null; // 解除引用
                }
            });
        },
        getSettingData: function () {
            var that = this;
            that.models.settingmodel = new TypeModel;
            that.views.settingview = new SettingView({
                model: that.models.settingmodel
            });
            var loadtip = new LoadTipView(this.$content);
            that.models.settingmodel.sync('read', that.views.settingview, {
                url: servicepath + 'user/email',
                data: null,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('设置中心！', data);
                    that.models.settingmodel.set({
                        data: data,
                        $content: that.$content
                    });
                    loadtip = null;
                }
            });
        },
        exitApp: function () {
            $.ajax({
                url: servicepath + 'login/logout',
                type: 'get',
                data: null,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('退出', data);
                    appNavigate('login', '登陆作业网', {trigger: true});
                    appview = null;
                }
            });
        }
    });

    // 对外提供接口
    module.exports = {
        servicepath: servicepath,
        checkSession: checkSession,
        checkInput: checkInput,
        FAppView: FAppView,
        FHwInfoView: FHwInfoView,
        FCourseListView: FCourseListView,
        FWorkListView: FWorkListView,
        FDialogView: FDialogView,
        SettingView: SettingView,
        LoadTipView: LoadTipView,
        TypeView: TypeView,
        TypeModel: TypeModel
    };
});

