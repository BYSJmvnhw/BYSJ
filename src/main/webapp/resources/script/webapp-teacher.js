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

        // 用正则检测输入是否符合预期
        // @param type 检测类型(mail num int null chinese eg)
        // @param value 待检测的值
        checkInput = CommonObject.checkInput,

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

    // 学生管理->添加学生->弹框->学生列表子视图
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
            this.delegateEvents(this.events);
        },
        addStudent: function (e) {
            console.log('添加');
            var $cur = $(e.currentTarget);
            if($cur.hasClass('stu-choiced')){
                $cur.removeClass('stu-choiced'); // 取消打勾样式
            }
            else {
                $cur.addClass('stu-choiced'); // 显示打勾样式
            }
        }
    });

    // 作业管理->作业信息->课程列表->作业列表->新增作业 [视图][弹框][教师]
    var AddWorkView = DialogView.extend({
        events: {
            'click .add-work-sure': 'submitAddWork',
            'click .dailog-clear': 'closeDialog',
            'click #choice-deadline': 'choiceDeadline'
        },
        submitAddWork: function () {
            var $t = this.$el,
                that = this;
            var data = $t.find('input, textarea, select');
            console.log(data, that.model.attributes.cid);
            if(checkInput('empty', data[0].value)){$(data[0]).focus();return;}
            if(checkInput('empty', data[1].value)){$(data[1]).focus();return;}
            if(checkInput('empty', data[2].value)){$(data[2]).focus();return;}
            $.ajax({
                type: 'POST',
                url: servicepath + 'homework/addHomeworkInfo',
                data: {
                    jsonObject: JSON.stringify({
                        title: data[0].value,
                        hwDesc: data[1].value,
                        markType: data[2].value,
                        deadline: Date.parse(new Date(data[3].value)),
                        cid: that.model.attributes.cid
                    })
                },
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('成功新增作业', data);
                    if(data.status == 'success'){
                        that.closeDialog(); // 新增成功后，销毁弹框
                        that.model.attributes.fetchWorklist(); // 刷新作业列表
                    }
                    else
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

    // 学生管理->学生信息->增加学生 [视图][弹框][教师]
    var AddStuView = DialogView.extend({
        events: {
            'click .add-work-sure': 'submitAddWork',
            'click .dailog-clear': 'closeDialog',
            'keydown input[name="add-stu-text"]': 'enterSearchStu',
            'click .add-student-search': 'searchStu',
            'click .add-student-sure': 'addSure',
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
        },
        enterSearchStu: function (e) {
            if((e.keyCode || e.which) == 13){
                this.keyword = $(e.currentTarget).val();
                this.getStudentData(1, 1, this.keyword, 0);
            }
        },
        searchStu: function (e) {
            this.keyword = $(e.currentTarget).prev().val();
            this.getStudentData(1, 1, this.keyword, 0);
        },
        preStu: function () {
            if(this.curpage > 1)
                this.getStudentData(this.keyword, this.curpage - 1);
        },
        nextStu:function () {
            if(this.curpage < this.maxpage)
                this.getStudentData(this.keyword, this.curpage + 1);
        },
        showPage: function () {
            this.$el.find('.add-student-page').show();
        },
        getStudentData: function (campusId, collegeId, keyword, page) {
            var that = this,
                $wrap = that.model.attributes.$wrap.find('.add-stu-list');
            this.stumodel = this.stumodel || new TypeModel;
            this.stuview = this.stuview || new AddStuListView({
                model: this.stumodel
            });
            var loadtip = new LoadTipView($wrap);
            this.stumodel.sync('read', this.stuview, {
                url: servicepath + 'student/searchStudent',
                data: {
                    campusId: campusId,
                    collegeId: collegeId,
                    studentNo: parseInt(keyword) || '',
                    name: keyword.replace(/\d+/g,'')
                },
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('学生列表', data);
                    that.stumodel.set({
                        studentlist: data.data,
                        $wrap: $wrap,
                        rand: Math.random()
                    });
                    that.showPage(); // 显示确认按钮
                    loadtip = null;
                }
            });
        },
        addSure: function (e) {
            var that = this,
                i,
                stulist = {ctId: that.model.attributes.ctId, sId: []},
                select = $(e.currentTarget).parent().prev().find('li.stu-choiced');
            console.log(select);
            for(i = 0; i < select.length; i ++) {
                stulist.sId.push(select[i].getAttribute('data-sId'));
            }
            console.log(stulist);
            $.ajax({
                type: 'post',
                url: servicepath + 'student/appendStudent',
                data: stulist,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('添加append', data);
                    if(data.status == 'success'){
                        alert('添加成功');
                        select.removeClass('stu-choiced'); // 取消选中
                    }
                    else {
                        alert('操作失败');
                    }
                }
            });
        }
    });

    // 作业管理->作业信息->课程列表->作业列表->确认删除作业 [视图][弹框][教师]
    var DeleteWorkView = DialogView.extend({
        events: {
            'click .delete-sure-btn1': 'deleteSure', // 执行删除操作
            'click .dailog-clear': 'closeDialog', // 关闭提交窗口
            'click .delete-sure-btn2': 'closeDialog' // 关闭提交窗口
        },
        deleteSure: function () {
            console.log('删除');
            var that = this;
            $.ajax({
                type: 'post',
                url: servicepath + 'homework/deleteHomeworkInfo',
                data: {hwInfoId: this.model.attributes.hwInfoId},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('学生作业', data);
                    if(data.status == 'success'){
                        // 删除作业列表视图上的作业，动画效果
                        that.model.attributes.$workli.hide(1000, function () {
                            this.remove();
                        });
                    }
                }
            });
            that.closeDialog();
        }
    });

    // 邮箱修改验证
    var AuthcodeView = DialogView.extend({
        events: {
            'click .dailog-clear': 'closeDialog', // 关闭提交窗口
            'click .auth-code-send-btn': 'getAuthcodeAgin', // 重新发送验证码
            'click .auth-code-sure-btn1': 'closeDialog', // 关闭提交窗口
            'click .auth-code-sure-btn2': 'submitAuthcode' // 提交验证码
        },
        render: function () {
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.$wrap.html(this.el);
            this.$el.show();
            this.delegateEvents(this.events);
            this.setWaitTime(); // 验证码倒计时开始
        },
        setWaitTime: function () {
            var count = 60,
                $btn = this.$el.find('.auth-code-send-btn'),
                at = setInterval(function () {
                if(count == 0){
                    clearInterval(at);
                    $btn.addClass('auth-code-sendagin-btn');
                    $btn.text('重发');
                }
                else {
                    $btn.text('重发(' + count -- + ')');
                }
            }, 1000);
        },
        submitAuthcode: function () {
            var that = this,
                code = this.$el.find('input');
            console.log(code.val());
            if(!checkInput('authcode', code.val())){this.$el.find('input').focus();return;}
            this.model.attributes.submitAuthcode(code.val(), function () {
                that.closeDialog();
            });
        },
        getAuthcodeAgin: function (e) {
            var $cur = $(e.currentTarget);
            if($cur.hasClass('auth-code-sendagin-btn')){
                this.model.attributes.getAuthcodeAgin();
                $cur.removeClass('auth-code-sendagin-btn');
                this.setWaitTime(); // 开始计时
            }
        }
    });

    // 学生列表 [父类]
    var StudentListView = Backbone.View.extend({
        tagName: 'div',
        className: 'student-list',
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-stuentwork');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap3.html(this.el);
            this.delegateEvents(this.events); // 视图渲染完后绑定所有事件
        }
    });

    // 学生管理->学生信息->课程列表->学生列表 [视图][教师]
    var StumanageStudentListView = StudentListView.extend({
        tmpl_id: 'stumanage-student-list-html',
        events: {
            'click .add-student': 'addStudentDlg', // 添加学生
            'click .check-btn': 'checkStuWork' // 教师查看该生作业业
        },
        addStudentDlg: function (e) {
            console.log('添加学生');
            var ctId = $(e.currentTarget).attr('data-ctId');
            this.addstumodel = this.addstumodel || new TypeModel;
            this.addstuview = this.addstuview || new AddStuView({
                    model: this.addstumodel
                });
            this.addstumodel.set({
                ctId: ctId,
                op: 'add-student',
                $wrap: $('#dialog-wrap')
            });
            !this.addstumodel.changedAttributes() && this.addstuview.render();
        },
        // 教师查看单个学生该课程的所有作业
        checkStuWork: function (e) {
            var that = this,
                $cur = $(e.currentTarget),
                ctId = $cur.attr('data-ctId'),
                sId = $cur.attr('data-sId'),
                $wrap2 = that.model.attributes.$wrap3.parent().next().children('.student-list-wrap'),
                loadtip = new LoadTipView($wrap2);
            this.worklistmodel = this.worklistmodel || new TypeModel;
            this.worklistview = this.worklistview || new StuManageWorkListView({
                model: this.worklistmodel
            });
            this.model.attributes.$wrap3.parent().parent().replaceClass('hw-content-wrap-3', 'hw-content-wrap-2')

            this.worklistmodel.sync('read', this.worklistview, {
                url: servicepath + 'student/homeworkList',
                data: {ctId: ctId, sId: sId},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('该学生的课程作业', data);
                    that.worklistmodel.set({
                        worklist: data,
                        view_type: 'stumanage',
                        $wrap2: $wrap2
                    });
                    !that.worklistmodel.changedAttributes() && that.worklistview.render();
                    loadtip = null;
                }
            });
        }
    });

    // 作业管理->作业信息->课程列表->课程作业列表->学生列表 [视图][教师]
    var HwmanageStudentListView = StudentListView.extend({
        tmpl_id: 'hwmanage-student-list-html',
        events: {
            'click .alter-btn': 'alterStuWork', // 教师批改该作业
            'click .student-list-classify-unhand': 'showUnhandList', // 查看未提交名单
            'click .student-list-classify-hand': 'showHandList' // 产看已提交名单
        },
        alterStuWork: function (e) {
            console.log('批改');
            var hwid = $(e.currentTarget).attr('data-id');
            window.open('http://localhost:8080/mvnhk/homework/openword?hwId=' + hwid);
        },
        getStudentData: function (hwInfoId, submited) {
            var that = this;
            $.ajax({
                url: servicepath + 'homework/homeworkList',
                data: {hwInfoId: hwInfoId, submited: submited},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('学生作业', data);
                    that.$el.find('ul').html(tmpl(that.tmpl_id + '0', {studentlist: data.data}));
                }
            });
        },
        showUnhandList: function (e) {
            var $cur = $(e.currentTarget),
                hwInfoId = $cur.attr('data-hwInfoId');
            $cur.siblings('button').removeClass('choice-part');
            $cur.addClass('choice-part');
            this.getStudentData(hwInfoId, false);
        },
        showHandList: function (e) {
            var $cur = $(e.currentTarget),
                hwInfoId = $cur.attr('data-hwInfoId');
            $cur.siblings('button').removeClass('choice-part');
            $cur.addClass('choice-part');
            this.getStudentData(hwInfoId, true);
        }
    });

    // 作业管理->作业信息->课程列表->作业列表 [视图][教师][学生]
    var hwManageWorkListView = WorkListView.extend({
        tmpl_id: 'hwmanage-work-list-html',
        events: {
            'click .add-work': 'addWork', // 教师添加作业
            'click .student-list-delete-btn': 'deleteWork', // 教师删除作业
            'click .student-list-mark-btn': 'showStudentList' // 教师查看该作业每个学生的提交
        },
        addWork: function (e) {
            var that = this,
                csname = $(e.currentTarget).attr('data-csname');
            this.addworkmodel = this.addworkmodel || new TypeModel;
            this.addworkview = this.addworkview || new AddWorkView({
                    model: this.addworkmodel
                });
            that.addworkmodel.set({
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
            var $p = $(e.currentTarget).parent(),
                hwInfoId = $p.attr('data-hwinfoid');
            this.dialogmodel = this.dialogmodel || new TypeModel();
            this.dialogview = this.dialogview || new DeleteWorkView({
                    model: this.dialogmodel
                });
            this.dialogmodel.set({
                op: 'delete-sure',
                hwInfoId: hwInfoId,
                $workli: $p.parent()
            });
            !this.dialogmodel.changedAttributes() && this.dialogview.render();
        },
        getStudentData: function (hwInfoId, submited) {
            var that = this,
                $section2 = this.nextSection(),
                $wrap3 = $section2.next().children('.student-list-wrap'),
                loadtip = new LoadTipView($wrap3);
            this.studentmodel = this.studentmodel || new TypeModel;
            this.studentview = this.studentview || new HwmanageStudentListView({
                model: this.studentmodel
            });
            that.studentmodel.sync('read', that.studentview, {
                url: servicepath + 'homework/homeworkList',
                data: {hwInfoId: hwInfoId, submited: submited},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('学生作业', data);
                    that.studentmodel.set({
                        studentlist: data.data,
                        hwInfoId: hwInfoId,
                        $wrap3: $wrap3
                    });
                    !that.studentmodel.changedAttributes() && that.studentview.render();
                    loadtip = null;
                }
            });
        },
        // 学生作业列表
        showStudentList: function (e) {
            console.log('查看学生的作业列表');
            var hwInfoId = $(e.currentTarget).attr('data-hwinfoid');
            this.getStudentData(hwInfoId, true);
        }
    });

    // 学生管理->学生信息->课程列表->学生列表->学生该课程作业列表 [视图][教师]
    var StuManageWorkListView = WorkListView.extend({
        tmpl_id: 'stumanage-work-list-html',
        events: {
            'click .stumanage-mark-work-btn': 'markStudentWork' // 教师查看该作业每个学生的提交
        },
        markStudentWork: function (e) {
            console.log('批改');
            var hwid = $(e.currentTarget).attr('data-hwInfoId');
            window.open('http://localhost:8080/mvnhk/homework/openword?hwId=' + hwid);
        }
    });

    // 作业管理->作业信息->课程列表 [视图][教师]
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
            this.workview = this.workview || new hwManageWorkListView({model: this.workmodel});
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
                    !that.workmodel.changedAttributes() && that.workview.render();
                    loadtip = null;
                }
            });
        }
    });

    // 学生管理->学生信息->课程列表 [视图][教师]
    var StumanageCourseListView = CourseListView.extend({
        tmpl_id: 'stumanage-course-list-html',
        events: {
            'click .stumanage-list-btn': 'showStudentList' // 查看该课程所有学生
        },
        showStudentList: function (e) {
            console.log('查看该课程的所有学生');
            var that = this,
                $section1 = that.nextSection(),
                $wrap3 = $section1.next().children('.work-list-wrap'),
                loadtip = new LoadTipView($wrap3);
            var id = $(e.currentTarget).attr('data-id');
            this.stulistmodel = this.stulistmodel || new TypeModel;
            this.stulistview = this.stulistview || new StumanageStudentListView({
                model: this.stulistmodel
            });
            this.stulistmodel.sync('read', that.stulistview, {
                url: servicepath + 'student/studentList',
                data: {ctId: id},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('学生信息', data);
                    that.stulistmodel.set({
                        view_type: 'stumanage',
                        studentlist: data.data,
                        $wrap3: $wrap3
                    });
                    !that.stulistmodel.changedAttributes() && that.stulistview.render();
                    loadtip = null;
                }
            });
        }
    });

    // 作业管理 [视图][教师]
    var WorkInfoView = HwInfoView.extend({
        view_type: 'hwmanage',
        initialize: function () {
            this.coursemodel = new TypeModel;
            this.courseview = new HwmanageCourseListView({model: this.coursemodel});
            this.render(); // 初始化作业信息基本视图
        }
    });

    // 学生管理 [视图][教师]
    var StuInfoView = HwInfoView.extend({
        view_type: 'stumanage',
        initialize: function () {
            this.coursemodel = new TypeModel;
            this.courseview = new StumanageCourseListView({model: this.coursemodel});
            this.render(); // 初始化作业信息基本视图
        }
    });

    // 课程邮箱设置->课程邮箱列表子视图
    var CsMailListView = Backbone.View.extend({
        tagName: 'ul',
        tmpl_id: 'cs-mail-list-html',
        events: {
            'click .cs-mail-change': 'changeMail',
            'click .cs-mail-clear': 'clear',
            'click .cs-mail-sure': 'submitMail'
        },
        mail_urls: {
            sohu: 'http://mail.sohu.com/',
            sina: 'http://mail.sina.com.cn/',
            qq: 'https://mail.qq.com/cgi-bin/loginpage',
            163: 'http://mail.163.com/'
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            console.log('render-csmail');
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap.html(this.el);
            this.delegateEvents(this.events);
        },
        changeMail: function (e) {
            var $cur = $(e.currentTarget);
            $cur.parent().addClass('t-cs-mail-open');
            $cur.next().show();
            $cur.hide();
        },
        clear: function (e) {
            var $cur = $(e.currentTarget);
            $cur.parent().removeClass('t-cs-mail-open');
            $cur.prev().show();
            $cur.next().children('input').val(); // 清空输入框
            $cur.hide();
        },
        submitMail: function (e) {
            var that = this,
                $cur = $(e.currentTarget),
                mail = $cur.prev().val(),
                ctId = $cur.attr('data-ctId');
            if(!checkInput('mail', mail)){$cur.prev().focus();return;}
            $.ajax({
                type: 'post',
                url: servicepath + 'course/updateEmail',
                data: {ctId: ctId, email: mail},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('更改课程邮箱', data);
                    that.validateMail(data.status, $cur.parent().parent().prev().children(), mail, ctId);
                }
            });
        },
        validateMail: function (status, $el, mail, ctId) {
            if(status == 'success'){
                alert('邮箱更改成功！');
                $el.html(mail);
            }
            else if(status == 'no validated'){
                this.sendAuthcode(mail, ctId);
            }
            else {
                alert('操作失败，请联系管理员。');
            }
        },
        sendAuthcode: function (mail, ctId) {
            var that = this;
            this.authcodemodel =  this.authcodemodel ||new TypeModel;
            this.authcodeview = this.authcodeview|| new AuthcodeView({
                model: this.authcodemodel
            });
            this.authcodemodel.set({
                op: 'auth-code',
                mail: mail,
                mail_url: that.mail_urls[mail.replace(/([a-zA-Z0-9_-])+@(sian|sohu|qq|163)((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, '$2')],
                getAuthcodeAgin: function () {
                    that.sendAuthcode(mail, ctId);
                },
                submitAuthcode: function (auth_code, fun) {
                    console.log(auth_code);
                    $.ajax({
                        type: 'post',
                        url: servicepath + 'course/checkEmail',
                        data: {ctId: ctId, email: mail, checkNumber: auth_code},
                        dataType: 'json',
                        success: function (data) {
                            checkSession(data.status);
                            console.log('更改课程邮箱', data);
                            if(data.status == 'success'){
                                that.$el.html(mail);
                                fun();
                            }
                            else if (data.status == 'verification_code_error'){
                                alert('验证码错误！请重试！');
                            }
                            else {
                                alert("操作失败");
                            }
                        }
                    });
                },
                $wrap: $('#dialog-wrap')
            });
            !this.authcodemodel.changedAttributes() && this.authcodeview.render();
        }
    });

    // 课程邮箱设置视图
    var CsMailView = Backbone.View.extend({
        tagName: 'div',
        className: 'cs-mail-wrap',
        tmpl_id: 'cs-mail-html',
        events: {
            'click .choice-sure-btn': 'choiceTerm'
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            var ele = tmpl(this.tmpl_id, {});
            $(this.el).html(ele);
            this.model.attributes.$wrap.html(this.el);
            this.getCourseData(2011, 1);
        },
        getCourseData: function (year, term) {
            var that = this,
                $wrap = that.$el.children('.cs-mail-list'),
                loadtip = new  LoadTipView($wrap);
            this.csmaillistmodel = new TypeModel;
            this.csmaillistview = new CsMailListView({
                model: this.csmaillistmodel
            });
            this.csmaillistmodel.sync('read', this.csmaillistview, {
                url: servicepath + 'course/email',
                data: {startYear: year, schoolTerm: term},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('课程邮箱设置', data);
                    that.csmaillistmodel.set({
                        courselist: data,
                        $wrap: $wrap,
                        random: Math.random()
                    });
                    loadtip = null;
                }
            });
        },
        choiceTerm: function () {
            var startYear = this.$el.find('.startYear').val(),
                schoolTerm = this.$el.find('.schoolTerm').val();
            this.getCourseData(startYear, schoolTerm);
        }
    });

    // 应用总视图
    var AppView = CommonObject.FAppView.extend({ // 滑动视图，应用程序主视图类
        initialize: function () {
            this.$old_el = $('#left-nav .l-menu').first().next();
            this.$content = $('#content');
            console.log('初始化webapp');
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
                case  'stumanage/stuinfo':
                    this.GetStuInfoData();
                    break;
                default:
                    console.log('没有找到相关类型');
            }
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
        getHwInfoData: function () { // 获取课程信息
            if(this.views.workinfoview)
                this.views.workinfoview.render();
            else
                this.views.workinfoview = new WorkInfoView;
        },
        getCsMailData: function () {
            this.models.mailmodel = this.models.mailmodel || new TypeModel;
            this.views.mailview = this.views.mailview || new CsMailView({model: this.models.mailmodel});
            this.models.mailmodel.set({
                $wrap: this.$content
            });
            !this.models.mailmodel.changedAttributes() && this.views.mailview.render();
        },
        GetStuInfoData: function () {
            if(this.views.stuinfoview)
                this.views.stuinfoview.render();
            else
                this.views.stuinfoview = new StuInfoView;
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
