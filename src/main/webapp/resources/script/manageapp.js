/**
 * Created by zqc on 2015/4/10.
 */

define(function (require, exports, module) {

    var React = require('React');
    var _ = require('underscore'); // 框架依赖模块
    var Backbone = require('backbone'); // 主框架模块
    var $ = require('jquery');
    Backbone.$ = $;

    var serverpath = 'http://localhost:8080/mvnhk/',
        dialog_el = document.getElementById('dialog-wrap');

    // 检测服务端session是否过期，若过期则跳转到登陆页面
    // @param status 后台session状态
    function checkSession (status) {
        if(status == 'timeout'){
            alert('会话已过期，请重新登录！');
            window.location.href = servicepath + 'web/login';
        }
    }

    // 学院select内容组件
    var CollegeList = React.createClass({displayName: "CollegeList",
        getInitialState: function () {
            return {campus1: [], campus2: [], campus3: []};
        },
        loadCampusData: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function(data) {
                    console.log('校区信息', data);
                    this.setState({campus1: data.campus1, campus2: data.campus2, campus3: data.campus3});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentDidMount: function () {
            this.loadCampusData();
        },
        render: function () {
            var campusNode = this.state['campus' + this.props.campusId].map(function (campus, index) {
                return (React.createElement("option", {value: campus.collegeId}, campus.collegeName));
            });
            return (React.createElement("select", null, campusNode));
        }
    });

    // 弹框组件
    var Dialog = React.createClass({displayName: "Dialog",
        getInitialState: function () {
            return {display: ''};
        },
        closeDialog: function () {
//            $(this.refs.dialogDiv.getDOMNode()).hide();
            this.setState({display: 'none'});
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({display: nextProps.display});
        },
        getDialogBody: function (body_type) {
            switch (body_type) {
                case 'AddCourseDialogBody':
                    return React.createElement(AddCourseDialogBody, {
                        url: this.props.url, 
                        refreshCourseData: this.props.refreshCourseData, 
                        onClose: this.closeDialog}
                    );
                case 'DeleteCourseDialogBody':
                    return React.createElement(DeleteCourseDialogBody, {
                        url: this.props.url, 
                        courseId: this.props.courseId, 
                        removeCourseTr: this.props.removeCourseTr, 
                        onClose: this.closeDialog}
                    );
                default : return 'none-dialog';
            }
        },
        render: function () {
            var body = this.getDialogBody(this.props.body);
            return (
                React.createElement("div", {className: "dialog-shade", ref: "dialogDiv", style: {display: this.state.display}}, 
                    React.createElement("div", {className: "dialog-content"}, 
                        React.createElement("div", {className: "dialog-title"}, 
                            React.createElement("strong", null, this.props.title), 
                            React.createElement("span", {className: "dialog-clear", onClick: this.closeDialog})
                        ), 
                        body
                    )
                )
            );
        }
    });

    // 校区select组件
    var SelectCampus = React.createClass({displayName: "SelectCampus",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "校区"), 
                    React.createElement("select", {onChange: this.props.onChange}, 
                        React.createElement("option", {value: "1"}, "石牌校区"), 
                        React.createElement("option", {value: "2"}, "大学城校区"), 
                        React.createElement("option", {value: "3"}, "南海校区")
                    )
                )
            );
        }
    });

    // 学院select组件
    var SelectCollege = React.createClass({displayName: "SelectCollege",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "学院"), 
                    React.createElement(CollegeList, {url: serverpath + "student/collegeList", campusId: this.props.campusId})
                )
            );
        }
    });

//    // 学年select组件
//    var SelectTermYear = React.createClass({});
//
//    // 学期select组件
//    var SelectTerm = React.createClass({});

    // 课程号input组件
    var CourseNo = React.createClass({displayName: "CourseNo",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "课程号"), 
                    React.createElement("input", {type: "text", placeholder: "输入课程号", onKeyDown: this.props.onKeyDown})
                )
            );
        }
    });

    // 课程名input组件
    var CourseName = React.createClass({displayName: "CourseName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "课程名"), 
                    React.createElement("input", {type: "text", placeholder: "输入课程名称", onKeyDown: this.props.onKeyDown})
                )
            );
        }
    });

    // 课程号/名组件，搜索表单专用
    var CourseNoName = React.createClass({displayName: "CourseNoName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "课程名/号"), 
                    React.createElement("input", {type: "text", placeholder: "输入课程号或课程名", onKeyDown: this.props.onKeyDown})
                )
            );
        }
    });

    // 教师号/名组件，搜索表单专用
    var TeacherNoName = React.createClass({displayName: "TeacherNoName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "教师名/号"), 
                    React.createElement("input", {type: "text", placeholder: "输入教师名或教师号", onKeyDown: this.props.onKeyDown})
                )
            );
        }
    });

    // 学生号/名组件，搜索表单专用
    var StudentNoName = React.createClass({displayName: "StudentNoName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "学生名/号"), 
                    React.createElement("input", {type: "text", placeholder: "输入学生姓名或学号", onKeyDown: this.props.onKeyDown})
                )
            );
        }
    });

    var StudentGrade = React.createClass({displayName: "StudentGrade",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "年级"), 
                    React.createElement("select", {onChange: this.props.onChange}, 
                        React.createElement("option", {value: "2011"}, "2011级"), 
                        React.createElement("option", {value: "2012"}, "2012级"), 
                        React.createElement("option", {value: "2013"}, "2013级"), 
                        React.createElement("option", {value: "2014"}, "2014级")
                    )
                )
            );
        }
    });

    // 删除课程提示组件
    var DeleteCourseDialogBody = React.createClass({displayName: "DeleteCourseDialogBody",
        deleteCourse: function () {
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {courseId: this.props.courseId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除课程', data);
                    this.props.onClose();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body"}, 
                    React.createElement("div", {className: "delete-tip"}, 
                        React.createElement("p", null, "确定删除吗？删除后不可修复！")
                    ), 
                    React.createElement("div", {className: "dialog-btn delete-btn"}, 
                        React.createElement("button", {className: "delete-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "delete-btn-sure", onClick: this.deleteCourse}, "删除")
                    )
                )
            );
        }
    });

    // 增加课程组件
    var AddCourseDialogBody = React.createClass({displayName: "AddCourseDialogBody",
        getInitialState: function () {
            return {
                campusId: "1"
            };
        },
        setSelectCampus: function (e) {
            this.setState({campusId: e.target.value});
        },
        addCourse: function () {
            console.log('添加课程');
            var courseDatas = $(this.refs.dialogBody.getDOMNode()).find('input, select');
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {
                    campusId: courseDatas[0].value,
                    collegeId: courseDatas[1].value,
                    courseNo: courseDatas[2].value,
                    courseName: courseDatas[3].value
                },
                dataType: 'json',
                success: function(data) {
                    console.log('添加课程', data);
                    this.props.refreshCourseData(); // 添加成功后刷新课程列表
                    courseDatas.value = '';
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement(SelectCampus, {className: "add-cs-campus", onChange: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "add-cs-college", campusId: this.state.campusId}), 
                    React.createElement(CourseNo, {className: "add-cs-courseno"}), 
                    React.createElement(CourseName, {className: "add-cs-coursename"}), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.addCourse}, "添加")
                    )
                )
            );
        }
    });

    // 用户管理组件
    var UserManage = React.createClass({displayName: "UserManage",
//        getInitialState: function () {},
//        loadUserData: function () {},
//        updateUser: function () {},
//        deleteUser: function () {},
//        componentDidMount: function () {},
        render: function () {
            return (
                React.createElement("div", null, "用户管理")
            );
        }
    });

    // 课程管理组件
    var CsManage = React.createClass({displayName: "CsManage",
        getInitialState: function () {
            return {
                data: [],
                campusId: "1"
            };
        },
        addCourse: function () {
            console.log('新增课程');
            React.render(
                React.createElement(Dialog, {title: "新增课程", 
                    body: "AddCourseDialogBody", 
                    url: serverpath + "course/addCourse", 
                    refreshCourseData: this.loadCourseData, 
                    display: "block"}),
                dialog_el);
        },
        deleteCourse: function (e) {
            var $courseBTn = $(e.target).parent(),
                courseId = $courseBTn.attr('data-courseId');
            React.render(
                React.createElement(Dialog, {title: "删除课程", 
                    body: "DeleteCourseDialogBody", 
                    url: serverpath + "course/deleteCourse", 
                    removeCourseTr: function () {$courseBTn.parent().remove()}, 
                    courseId: courseId, display: "block"}),
                dialog_el);
        },
        loadCourseData: function (campusId, collegeId, courseNo, courseName) {
            $.ajax({
                url: this.props.url,
                data: {
                    campusId: campusId,
                    collegeId: collegeId,
                    courseNo: courseNo,
                    courseName: courseName
                },
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    this.setState({data: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentDidMount: function () {
            this.loadCourseData();
        },
        setSelectCampus: function (e) {
            console.log('获得了校区id', e.target.value);
            this.setState({campusId: e.target.value});
        },
        searchCourse: function () {
            var searchdata = $(this.refs.searchData.getDOMNode()).find('input, select');
            this.loadCourseData(searchdata[0].value, searchdata[1].value, searchdata[2].value, searchdata[3].value);
        },
        keyDownSearchCourse: function (e) {
            (e.keyCode || e.which) == 13 && this.searchCourse();
        },
        render: function () {
            var that = this;
            var courseNode = this.state.data.map(function (course, index) {
                return (
                    React.createElement("tr", {className: "t-hover"}, 
                        React.createElement("td", null, course.courseNo), 
                        React.createElement("td", null, course.courseName), 
                        React.createElement("td", null, course.campusName, "校区", course.collegeName), 
                        React.createElement("td", null, course.majorName), 
                        React.createElement("td", {className: "cs-manage-op", "data-courseid": course.courseId}, 
                            React.createElement("button", {className: "cs-manage-give"}, "授课管理"), 
                            React.createElement("button", {className: "cs-manage-change"}, "修改"), 
                            React.createElement("button", {className: "cs-manage-delete", onClick: that.deleteCourse}, "删除")
                        )
                    )
                );
            });
            return (
                React.createElement("div", {className: "cs-manage"}, 
                    React.createElement("div", {className: "cs-manage-search box-style", ref: "searchData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", onChange: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(CourseNo, {className: "course-no", onKeyDown: this.keyDownSearchCourse}), 
                        React.createElement(CourseName, {className: "course-name", onKeyDown: this.keyDownSearchCourse}), 
                        React.createElement("div", {className: "cs-search-btn"}, 
                            React.createElement("button", {onClick: this.searchCourse}, "搜索课程")
                        ), 
                        React.createElement("div", {className: "cs-addnew"}, 
                            React.createElement("button", {onClick: this.addCourse}, "新增课程")
                        )
                    ), 
                    React.createElement("table", {className: "cs-manage-table"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "课程编号"), 
                                React.createElement("th", null, "课程名"), 
                                React.createElement("th", null, "所属校区院系"), 
                                React.createElement("th", null, "所属专业"), 
                                React.createElement("th", {"data-courseId": ""}, "操作")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            courseNode
                        )
                    ), 
                    React.createElement("div", {className: "cs-manage-page"}, 
                        React.createElement("button", {className: "pre-page"}, "上一页"), 
                        React.createElement("button", {className: "next-page"}, "下一页")
                    )
                )
                );
        }
    });

    // 选课管理组件
    var TakeManage = React.createClass({displayName: "TakeManage",
        getInitialState: function () {
            return {
                data: [],
                campusId: "1"
            };
        },
        setSelectCampus: function (e) {
            console.log('获得了校区id', e.target.value);
            this.setState({campusId: e.target.value});
        },
        loadTakeData: function (campusId, collegeId, startYear, schoolTerm, teacherNo, teacherName, courseNo, courseName) {
            $.ajax({
                url: this.props.url,
                data: {
                    campusId: campusId,
                    collegeId: collegeId,
                    startYear: startYear,
                    schoolTerm: schoolTerm,
                    teacherNo: teacherNo,
                    teacherName: teacherName,
                    courseNo: courseNo,
                    courseName: courseName
                },
                dataType: 'json',
                success: function(data) {
                    console.log('选课管理', data);
                    this.setState({data: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        searchTake: function () {
            var searchData = $(this.refs.searchData.getDOMNode()).find('input, select');
            this.loadTakeData(
                searchData[0].value,
                searchData[1].value,
                searchData[2].value,
                searchData[3].value,
                parseInt(searchData[4].value),
                searchData[4].value.replace(/\d/g, ''),
                parseInt(searchData[5].value),
                searchData[5].value.replace(/\d/g, '')
            );
        },
        keyDownSearchTake: function (e) {
            (e.keyCode || e.which) == 13 && this.searchTake();
        },
        addStudent: function () {
            console.log('增加学生');
        },
        deleteStudent: function () {
            console.log('删除学生');
        },
        componentDidMount: function () {
            this.loadTakeData();
        },
        render: function () {
            var that = this;
            var courseNode = this.state.data.map(function (course, index) {
                return (
                    React.createElement("tr", {className: "t-hover"}, 
                        React.createElement("td", null, course.courseNo), 
                        React.createElement("td", null, course.courseName), 
                        React.createElement("td", null, course.campusName, "校区", course.collegeName), 
                        React.createElement("td", null, course.majorName), 
                        React.createElement("td", null, course.teacherNo), 
                        React.createElement("td", null, course.teacherName), 
                        React.createElement("td", {className: "cs-manage-op", "data-courseid": course.courseId}, 
                            React.createElement("button", {className: "cs-manage-give", onClick: that.addStudent}, "添加学生"), 
                            React.createElement("button", {className: "cs-manage-delete", onclick: that.deleteStudent}, "删除学生")
                        )
                    )
                );
            });
            return (
                React.createElement("div", {className: "cs-manage"}, 
                    React.createElement("div", {className: "cs-manage-search box-style", ref: "searchData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", onChange: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(CourseNoName, {className: "course-no", onKeyDown: this.keyDownSearchTake}), 
                        React.createElement(TeacherNoName, {className: "course-name", onKeyDown: this.keyDownSearchTake}), 
                        React.createElement("div", {className: "cs-search-btn"}, 
                            React.createElement("button", {onClick: this.searchTake}, "搜索课程")
                        )
                    ), 
                    React.createElement("table", {className: "cs-manage-table"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "课程号"), 
                                React.createElement("th", null, "课程名"), 
                                React.createElement("th", null, "所属校区院系"), 
                                React.createElement("th", null, "所属专业"), 
                                React.createElement("th", null, "教师号"), 
                                React.createElement("th", null, "教师名"), 
                                React.createElement("th", null, "操作")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            courseNode
                        )
                    ), 
                    React.createElement("div", {className: "cs-manage-page"}, 
                        React.createElement("button", {className: "pre-page"}, "上一页"), 
                        React.createElement("button", {className: "next-page"}, "下一页")
                    )
                )
            );
        }
    });

    // 教师管理组件
    var TeacherManage = React.createClass({displayName: "TeacherManage",
//        getInitialState: function () {},
//        loadUserData: function () {},
//        updateUser: function () {},
//        deleteUser: function () {},
//        componentDidMount: function () {},
        render: function () {
            return (
                React.createElement("div", null, "教师管理")
            );
        }
    });

    // 学生管理组件
    var StudentManage = React.createClass({displayName: "StudentManage",
        getInitialState: function () {
            return {
                data: [],
                campusId: "1"
            };
        },
        setSelectCampus: function (e) {
            console.log('获得了校区id', e.target.value);
            this.setState({campusId: e.target.value});
        },
        loadStudentData: function (campusId, collegeId, grade, studentNo, studentName) {
            $.ajax({
                url: this.props.url,
                data: {
                    campusId: campusId,
                    collegeId: collegeId,
                    grade: grade,
                    studentNo: studentNo,
                    name: studentName
                },
                dataType: 'json',
                success: function(data) {
                    console.log('学生管理', data);
                    this.setState({data: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        searchStudent: function () {
            console.log('搜索学生');
            var searchdata = $(this.refs.searchData.getDOMNode()).find('input, select');
            this.loadStudentData(
                searchdata[0].value,
                searchdata[1].value,
                searchdata[2].value,
                parseInt(searchdata[3].value),
                searchdata[3].value.replace(/\d/g, '')
            );
        },
        studentTake: function () {
            console.log('学生选课');
        },
        deleteStudent: function () {
            console.log('删除学生');
        },
        componentDidMount: function () {
            this.loadStudentData();
        },
        render: function () {
            var that = this;
            var studentNode = this.state.data.map(function (student, index) {
                return (
                    React.createElement("tr", {className: "t-hover"}, 
                        React.createElement("td", null, student.studentNo), 
                        React.createElement("td", null, student.name), 
                        React.createElement("td", null, student.sex), 
                        React.createElement("td", null, student.hwCampus.name + '校区' + student.hwCollege.collegeName + student.grade + '级'), 
                        React.createElement("td", null, student.hwMajor.name + student.class_ + '班'), 
                        React.createElement("td", {className: "cs-manage-op", "data-studentid": student.id}, 
                            React.createElement("button", {className: "cs-manage-give", onClick: that.studentTake}, "学生选课"), 
                            React.createElement("button", {className: "cs-manage-delete", onclick: that.deleteStudent}, "删除学生")
                        )
                    )
                );
            });
            return (
                React.createElement("div", {className: "cs-manage"}, 
                    React.createElement("div", {className: "cs-manage-search box-style", ref: "searchData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", onChange: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(StudentGrade, {classNAme: "college-id"}), 
                        React.createElement(StudentNoName, {className: "course-no", onKeyDown: this.keyDownSearchTake}), 
                        React.createElement("div", {className: "cs-search-btn"}, 
                            React.createElement("button", {onClick: this.searchStudent}, "搜索课程")
                        ), 
                        React.createElement("div", {className: "cs-addnew"}, 
                            React.createElement("button", {onClick: this.addStudent}, "新增学生")
                        )
                    ), 
                    React.createElement("table", {className: "cs-manage-table"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "学号"), 
                                React.createElement("th", null, "姓名"), 
                                React.createElement("th", null, "性别"), 
                                React.createElement("th", null, "校区院系年级"), 
                                React.createElement("th", null, "所属专业/班级"), 
                                React.createElement("th", null, "操作")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            studentNode
                        )
                    ), 
                    React.createElement("div", {className: "cs-manage-page"}, 
                        React.createElement("button", {className: "pre-page"}, "上一页"), 
                        React.createElement("button", {className: "next-page"}, "下一页")
                    )
                )
            );
        }
    });

    var AppView = React.createClass({displayName: "AppView",
        getInitialState: function () { return {curWrap: 't-content-wrap2'}; },
        userManage: function () { this.setState({curWrap: 't-content-wrap1'}); },
        csManage:function () { this.setState({curWrap: 't-content-wrap2'}); },
        takeManage: function () { this.setState({curWrap: 't-content-wrap3'}); },
        teacherManage: function () {this.setState({curWrap: 't-content-wrap4'}); },
        studentrManage: function () { this.setState({curWrap: 't-content-wrap5'}); },
        render: function () {
            return (
                React.createElement("div", null, 
                    React.createElement("header", {className: "box-style"}, 
                        React.createElement("span", {className: "h-logo"}), 
                        React.createElement("p", null, "作业网后台管理系统"), 
                        React.createElement("div", {className: "h-info box-style"}, 
                            React.createElement("p", null, "您好，超级管理员"), 
                            React.createElement("a", {href: "javascript:void(0)", onClick: this.exitApp}, "退出")
                        )
                    ), 
                    React.createElement("section", {className: "main-content"}, 
                        React.createElement("div", {className: "menu-bar", role: "menu"}, 
                            React.createElement("ul", {className: "box-style"}, 
                                React.createElement("li", {className: "t-hover", onClick: this.userManage}, "用户管理"), 
                                React.createElement("li", {className: "active-li t-hover", onClick: this.csManage}, "课程管理"), 
                                React.createElement("li", {className: "t-hover", onClick: this.takeManage}, "选课管理"), 
                                React.createElement("li", {className: "t-hover", onClick: this.teacherManage}, "教师管理"), 
                                React.createElement("li", {className: "t-hover", onClick: this.studentrManage}, "学生管理")
                            )
                        ), 
                        React.createElement("div", {className: "content"}, 
                            React.createElement("div", {className: "content-wrap t-content-wrap box-style " + this.state.curWrap, ref: "contentWrap"}, 
                                React.createElement("section", {id: "content-wrap1"}, 
                                    React.createElement(UserManage, null)
                                ), 
                                React.createElement("section", {id: "content-wrap2"}, 
                                    React.createElement(CsManage, {url: serverpath + "course/searchCourse"})
                                ), 
                                React.createElement("section", {id: "content-wrap3"}, 
                                    React.createElement(TakeManage, {url: serverpath + "course/courseTeachingList"})
                                ), 
                                React.createElement("section", {id: "content-wrap4"}, 
                                    React.createElement(TeacherManage, {url: serverpath})
                                ), 
                                React.createElement("section", {id: "content-wrap5"}, 
                                    React.createElement(StudentManage, {url: serverpath + "student/searchStudent"})
                                )
                            )
                        )
                    )
                )
                );
        },
        exitApp: function () {
            $.ajax({
                url: serverpath + 'login/logout',
                type: 'get',
                data: null,
                dataType: 'json',
                success: function (data) {
                    checkSession(data.status);
                    console.log('退出', data);
                    appNavigate('login', '登陆作业网后台管理系统', {trigger: true});
                }
            });
        }
    });

    module.exports = {
        enterApp: function (type, bar) {
            React.render(React.createElement(AppView, {type: type, bar: bar}), document.getElementById('manage-part'));
        }
    }

});

