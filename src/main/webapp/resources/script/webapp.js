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
        changePW: function () {
            var oldpw = this.$el.find('#old-pw').val(),
                newpw = this.$el.find('#new-pw').val(),
                surepw = this.$el.find('#sure-pw').val();
            console.log(oldpw, newpw, surepw);
            if(newpw == surepw){
                $.ajax({
                    type: 'post',
                    url: servicepath + 'user/updatePassword',
                    data: {oldPassword: oldpw, newPassword: newpw},
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
        changeMail: function () {
            var newmail = this.$el.find('#new-mail').val(),
                authcode = this.$el.find('#sure-mail').val();
            console.log(newmail, authcode)
        }
    });

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

    // 弹出框公共视图类
    var DialogView = Backbone.View.extend({
        tagName: 'div',
        className: 'shade-wrap',
        tmpl_id: 'dialog-html',
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            var ele = tmpl(this.tmpl_id, this.model.toJSON());
            $(this.el).html(ele);
            this.model.attributes.$wrap.html(this.el);
            this.delegateEvents(this.events);
        },
        closeDialog: function () {
            this.$el.hide(300);
        }
    });

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
            'click .auth-code-sure-btn1': 'closeDialog', // 关闭提交窗口
            'click .auth-code-sure-btn2': 'submitAuthcode' // 提交验证码
        },
        submitAuthcode: function () {
            var code = this.$el.find('input').val();
            if(this.model.attributes.submitAuthcode(code)){
                this.closeDialog();
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
            var that = this,
                ctId = $(e.currentTarget).attr('data-ctId'),
                addstumodel = new TypeModel,
                addstuview = new AddStuView({
                    model: addstumodel
                });
            addstumodel.set({
                ctId: ctId,
                op: 'add-student',
                $wrap: $('#dialog-wrap')
            });
        },
        // 教师查看单个学生该课程的所有作业
        checkStuWork: function (e) {
            var that = this,
                $cur = $(e.currentTarget),
                ctId = $cur.attr('data-ctId'),
                sId = $cur.attr('data-sId'),
                $wrap2 = that.model.attributes.$wrap3.parent().next().children('.student-list-wrap'),
                loadtip = new LoadTipView($wrap);
            this.worklistmodel = this.worklistmodel || new TypeModel;
            this.worklistview = this.worklistview ||new StuManageWorkListView({
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
                        worklist: data.data,
                        view_type: 'stumanage',
                        userType: localStorage.userType,
                        $wrap2: $wrap2
                    });
                    loadtip = null;
                }
            });
//            worklistmodel.set({
//                worklist: [{
//                    title: '计算机组成原理第一次作业',
//                    deadline: '2014nian1'
//                }],
//                userType: localStorage.userType,
//                $wrap2: that.model.attributes.$wrap3.parent().next().children('.student-list-wrap')
//            });
        }
    });

    // 作业管理->作业信息->课程列表->课程作业列表->学生列表 [视图][教师]
    var HwmanageStudentListView = StudentListView.extend({
        tmpl_id: 'hwmanage-student-list-html',
        events: {
            'click .alter-btn': 'alterStuWork' // 教师批改该作业
        },
        alterStuWork: function (e) {
            console.log('批改');
            var hwid = $(e.currentTarget).attr('data-id');
            window.open('http://localhost:8080/mvnhk/homework/openword?hwId=' + hwid);
        }
    });

    //  作业列表 [父类]
    var WorkListView = Backbone.View.extend({
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

    // 作业管理->作业信息->课程列表->作业列表 [视图][教师][学生]
    var hwManageWorkListView = WorkListView.extend({
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

    // 课程列表 [父类]
    var CourseListView = Backbone.View.extend({
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
                        userType: localStorage.userType,
                        $wrap2: $wrap2
                    });
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
                    loadtip = null;
                }
            });
        }
    });

    // 作业管理、学生管理 [父类]
    var HwInfoView = Backbone.View.extend({
        tagName: 'div',
        className: 'hw-content-wrap hw-content-wrap-k hw-content-wrap-1',
        tmpl_id: 'hw-info',
        events: {
            'click .return-course-btn': 'slideHwContentWrap', // 返回课程列表
            'click .return-work-btn': 'slideHwContentWrap', // 返回作业列表
            'click .choice-sure-btn': 'termCourse' // 搜索按钮
        },
        render: function () {
            console.log('render-hwinfo');
            $(this.el).html(tmpl(this.tmpl_id, {view_type: this.view_type}));
            $('#content').html(this.el);
            this.delegateEvents(this.events);
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
            that.$el.find('.course-list-wrap').html('正在加载');
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
                    loadtip = null;
                }
            });
        }
    });

    // 作业管理 [视图][教师][学生]
    var WorkInfoView = HwInfoView.extend({
        view_type: 'hwmanage',
        initialize: function () {
            this.render(); // 初始化作业信息基本视图
            this.coursemodel = new TypeModel;
            this.courseview = new HwmanageCourseListView({model: this.coursemodel});
            this.getCourseData(2011, 1);
        }
    });

    // 学生管理 [视图][教师]
    var StuInfoView = HwInfoView.extend({
        view_type: 'stumanage',
        initialize: function () {
            this.render(); // 初始化作业信息基本视图
            this.coursemodel = new TypeModel;
            this.courseview = new StumanageCourseListView({model: this.coursemodel});
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
            var ele = tmpl(this.tmpl_id);
            $(this.el).html(ele);
            $('#content').html(this.el);
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
                newestview = new hwManageWorkListView({
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
                        $wrap2: $wrap2,
                        userType: localStorage.userType
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

    // 课程邮箱设置->课程邮箱列表子视图
    var CsMailListView = Backbone.View.extend({
        tagName: 'ul',
        tmpl_id: 'cs-mail-list-html',
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
            $cur.next().children('.cs-mail-input2').hide(); // 隐藏验证码框
            $cur.next().children('.cs-mail-input1').val(); // 清空输入框
            $cur.next().children('.cs-mail-input2').val(''); // 制空验证码框
            $cur.hide();
        },
        submitMail: function (e) {
            var that = this,
                $cur = $(e.currentTarget),
                mail = $cur.prev().val(),
                ctId = $cur.attr('data-ctId');
            $.ajax({
                type: 'post',
                url: servicepath + 'course/updateEmail',
                data: {ctId: ctId, email: mail},
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('更改课程邮箱', data);
                    that.validateMail(data, $cur.parent().parent().prev().children(), mail, ctId);
                }
            });
        },
        validateMail: function (d, $el, mail, ctId) {
            if(d.status == 'success'){
                alert('邮箱更改成功！');
                $el.html(mail);
            }
            else if(d.status == 'no validated'){
                this.authcodemodel =  new TypeModel;
                this.authcodeview = new AuthcodeView({
                    model: this.authcodemodel
                });
                this.authcodemodel.set({
                    op: 'auth-code',
                    mail: mail,
                    mail_url: '',
                    submitAuthcode: function (auth_code) {
                        $.ajax({
                            type: 'post',
                            url: servicepath + 'course/checkEmail',
                            data: {ctId: ctId, email: mail, checkNumber: auth_code},
                            dataType: 'json',
                            success: function (data) {
                                checkSession(data.status);
                                console.log('更改课程邮箱', data);
                                if(data.status == 'success'){
                                    $el.html(mail);
                                    return true;
                                }
                                else {
                                    alert("操作失败");
                                }
                            }
                        });
                    },
                    $wrap: $('#dialog-wrap'),
                    rand: Math.random()
                });
            }
            else {
                alert('操作失败，请联系管理员。');
            }
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
//                checkSession(data.status);
//                    console.log('提示数据！', data);
//                    tipmodel.set({
//                        userType: localStorage.userType
//                    });
//                }
//            });
            tipmodel.set({
                userType: localStorage.userType,
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
                        userType: localStorage.userType,
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
                        userType: localStorage.userType,
                        $content: that.$content
                    });
                    loadtip = null;
                }
            });
        },
        getHwInfoData: function () { // 获取课程信息
            if(this.views.workinfoview){
                this.views.workinfoview.constructor();
                this.views.workinfoview.render();
            }
            else
                this.views.workinfoview = new WorkInfoView;
        },
        getHwDynamic: function () {
            if(this.models.hwdmodel && this.views.hwdview){
                this.views.hwdview.constructor();
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
        },
        getCsMailData: function () {
            if(this.models.mailmodel && this.views.mailview){
                this.views.mailview.constructor();
                this.views.mailview.render();
            }
            else {
                this.models.mailmodel = new TypeModel;
                this.views.mailview = new CsMailView({model: this.models.mailmodel});
                this.models.mailmodel.set({
                    $wrap: this.$content
                });
            }
        },
        GetStuInfoData: function () {
            if(this.views.stuinfoview){
                this.views.stuinfoview.constructor();
                this.views.stuinfoview.render();
            }
            else
                this.views.stuinfoview = new StuInfoView;
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
                }
            });
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
