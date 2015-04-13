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
    var CollegeList = React.createClass({
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
            var defaultValue = '', campusNode = '';
            if(this.state['campus' + this.props.campusId].length > 0){
                campusNode = this.state['campus' + this.props.campusId].map(function (campus, index) {
                    return (<option value={campus.collegeId}>{campus.collegeName}</option>);
                });
                defaultValue = this.state['campus' + this.props.campusId][0].collegeId;
            }
//            this.props.setSelectCollege({target: {value: defaultValue}});
            return (<select onChange={this.props.setSelectCollege} defaultValue={defaultValue}>{campusNode}</select>);
        }
    });

    var MajorList = React.createClass({
        getInitialState: function () {
            return {major: []};
        },
        loadMajorData: function (collegeId) {
            $.ajax({
                url: this.props.url,
                data: {collegeId: collegeId},
                dataType: 'json',
                success: function(data) {
                    console.log('专业信息', data);
                    this.setState({major: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentDidMount: function () {
            this.loadMajorData(this.props.collegeId);
        },
        componentWillReceiveProps: function (nextProps) {
            console.log('MajorList', nextProps.collegeId);
            this.loadMajorData(nextProps.collegeId);
        },
        render: function () {
            var defaultValue = '', majorNode = '';
            if(this.state.major.length > 0){
                majorNode = this.state.major.map(function (major) {
                    return (<option value={major.majorId}>{major.majorName}</option>);
                });
                defaultValue = this.state.major[0].majorId;
            }
            return (<select defaultValue={defaultValue}>{majorNode}</select>);
        }
    });

    // 弹框组件
    var Dialog = React.createClass({
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
                    return <AddCourseDialogBody
                        url={this.props.url}
                        refreshCourseData={this.props.refreshCourseData}
                        onClose={this.closeDialog}
                    />;
                case 'DeleteCourseDialogBody':
                    return <DeleteCourseDialogBody
                        url={this.props.url}
                        courseId={this.props.courseId}
                        removeCourseTr={this.props.removeCourseTr}
                        onClose={this.closeDialog}
                    />;
                default : return 'none-dialog';
            }
        },
        render: function () {
            var body = this.getDialogBody(this.props.body);
            return (
                <div className="dialog-shade" ref="dialogDiv" style={{display: this.state.display}}>
                    <div className="dialog-content">
                        <div className="dialog-title">
                            <strong>{this.props.title}</strong>
                            <span className="dialog-clear" onClick={this.closeDialog}></span>
                        </div>
                        {body}
                    </div>
                </div>
            );
        }
    });

    // 校区select组件
    var SelectCampus = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>校区</label>
                    <select onChange={this.props.setSelectCampus}>
                        <option value="1">石牌校区</option>
                        <option value="2">大学城校区</option>
                        <option value="3">南海校区</option>
                    </select>
                </div>
            );
        }
    });

    // 学院select组件
    var SelectCollege = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>学院</label>
                    <CollegeList url={serverpath + "student/collegeList"} campusId={this.props.campusId} setSelectCollege={this.props.setSelectCollege}/>
                </div>
            );
        }
    });

    // 专业select组件
    var SelectMajor = React.createClass({
        getInitialState: function () {
            return {collegeId: this.props.collegeId};
        },
        componentWillReceiveProps: function (nextProps) {
            console.log('SelectMajor', nextProps.collegeId);
            this.setState({collegeId: nextProps.collegeId});
        },
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>专业</label>
                    <MajorList url={serverpath + "student/majorList"} collegeId={this.state.collegeId} />
                </div>
            );
        }
    });

//    // 学年select组件
//    var SelectTermYear = React.createClass({});
//
//    // 学期select组件
//    var SelectTerm = React.createClass({});

    // 课程号input组件
    var CourseNo = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>课程号</label>
                    <input type="text" placeholder="输入课程号" onKeyDown={this.props.onKeyDown}/>
                </div>
            );
        }
    });

    // 课程名input组件
    var CourseName = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>课程名</label>
                    <input type="text" placeholder="输入课程名称"  onKeyDown={this.props.onKeyDown}/>
                </div>
            );
        }
    });

    // 课程号/名组件，搜索表单专用
    var CourseNoName = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>课程名/号</label>
                    <input type="text" placeholder="输入课程号或课程名"  onKeyDown={this.props.onKeyDown}/>
                </div>
            );
        }
    });

    // 教师号/名组件，搜索表单专用
    var TeacherNoName = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>教师名/号</label>
                    <input type="text" placeholder="输入教师名或教师号"  onKeyDown={this.props.onKeyDown}/>
                </div>
            );
        }
    });

    // 学生号/名组件，搜索表单专用
    var StudentNoName = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>学生名/号</label>
                    <input type="text" placeholder="输入学生姓名或学号"  onKeyDown={this.props.onKeyDown}/>
                </div>
            );
        }
    });

    // 年级
    var StudentGrade = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>年级</label>
                    <select onChange={this.props.onChange}>
                        <option value="2011">2011级</option>
                        <option value="2012">2012级</option>
                        <option value="2013">2013级</option>
                        <option value="2014">2014级</option>
                    </select>
                </div>
            );
        }
    });

    // 删除课程提示组件
    var DeleteCourseDialogBody = React.createClass({
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
                <div className="dialog-body">
                    <div className="delete-tip">
                        <p>确定删除吗？删除后不可修复！</p>
                    </div>
                    <div className="dialog-btn delete-btn">
                        <button className="delete-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="delete-btn-sure" onClick={this.deleteCourse}>删除</button>
                    </div>
                </div>
            );
        }
    });

    // 增加课程组件
    var AddCourseDialogBody = React.createClass({
        getInitialState: function () {
            return {
                campusId: "1",
                collegeId: "1"
            };
        },
        setSelectCampus: function (e) {
            console.log('setSelectCampus', e.target.value);
            this.setState({campusId: e.target.value});
        },
        setSelectCollege: function (e) {
            console.log('setSelectCollege', e.target.value);
            this.setState({collegeId: e.target.value});
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
                    majorId: courseDatas[1].value,
                    courseNo: courseDatas[3].value,
                    courseName: courseDatas[4].value
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
                <div className="dialog-body" ref="dialogBody">
                    <SelectCampus className="add-cs-campus" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="add-cs-college" campusId={this.state.campusId} setSelectCollege={this.setSelectCollege} />
                    <SelectMajor className="add-cs-college" collegeId={this.state.collegeId} />
                    <CourseNo className="add-cs-courseno" />
                    <CourseName className="add-cs-coursename" />
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.addCourse}>添加</button>
                    </div>
                </div>
            );
        }
    });

    // 选课管理->增加学生
    var TakeAddStudentDialogBody = React.createClass({
        render: function () {
            return (<div></div>);
        }
    });

    // 用户管理组件
    var UserManage = React.createClass({
//        getInitialState: function () {},
//        loadUserData: function () {},
//        updateUser: function () {},
//        deleteUser: function () {},
//        componentDidMount: function () {},
        render: function () {
            return (
                <div>用户管理</div>
            );
        }
    });

    // 课程管理组件
    var CsManage = React.createClass({
        getInitialState: function () {
            return {
                data: [],
                campusId: "1"
            };
        },
        addCourse: function () {
            console.log('新增课程');
            React.render(
                <Dialog title='新增课程'
                    body="AddCourseDialogBody"
                    url={serverpath + "course/addCourse"}
                    refreshCourseData = {this.loadCourseData}
                    display="block" />,
                dialog_el);
        },
        deleteCourse: function (e) {
            var $courseBTn = $(e.target).parent(),
                courseId = $courseBTn.attr('data-courseId');
            React.render(
                <Dialog title='删除课程'
                    body="DeleteCourseDialogBody"
                    url={serverpath + "course/deleteCourse"}
                    removeCourseTr={function () {$courseBTn.parent().remove()}}
                    courseId={courseId} display="block" />,
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
                    <tr className="t-hover">
                        <td>{course.courseNo}</td>
                        <td>{course.courseName}</td>
                        <td>{course.campusName}校区{course.collegeName}</td>
                        <td>{course.majorName}</td>
                        <td className="cs-manage-op"  data-courseid={course.courseId}>
                            <button className="cs-manage-give">授课管理</button>
                            <button className="cs-manage-change">修改</button>
                            <button className="cs-manage-delete" onClick={that.deleteCourse}>删除</button>
                        </td>
                    </tr>
                );
            });
            return (
                <div className="cs-manage">
                    <div className="cs-manage-search box-style" ref="searchData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <CourseNo className="course-no" onKeyDown={this.keyDownSearchCourse}/>
                        <CourseName className="course-name" onKeyDown={this.keyDownSearchCourse}/>
                        <div className="cs-search-btn">
                            <button onClick={this.searchCourse}>搜索课程</button>
                        </div>
                        <div className="cs-addnew">
                            <button onClick={this.addCourse}>新增课程</button>
                        </div>
                    </div>
                    <table className="cs-manage-table">
                        <thead>
                            <tr>
                                <th>课程编号</th>
                                <th>课程名</th>
                                <th>所属校区院系</th>
                                <th>所属专业</th>
                                <th data-courseId="">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseNode}
                        </tbody>
                    </table>
                    <div className="cs-manage-page">
                        <button className="pre-page">上一页</button>
                        <button className="next-page">下一页</button>
                    </div>
                </div>
                );
        }
    });

    // 选课管理组件
    var TakeManage = React.createClass({
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
                parseInt(searchData[4].value) || '',
                searchData[4].value.replace(/\d+/g, ''),
                parseInt(searchData[5].value) || '',
                searchData[5].value.replace(/\d+/g, '')
            );
        },
        keyDownSearchTake: function (e) {
            (e.keyCode || e.which) == 13 && this.searchTake();
        },
        addStudent: function () {
            console.log('增加学生');
//            $.ajax({
//                type: 'post',
//                url: this.props.url,
//                data: {ctId: '', sId: ''},
//                dataType: 'json',
//                success: function(data) {
//                    console.log('选课管理', data);
//                    this.setState({data: data.data});
//                }.bind(this),
//                error: function(xhr, status, err) {
//                    console.error(this.props.url, status, err.toString());
//                }.bind(this)
//            });
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
                    <tr className="t-hover">
                        <td>{course.courseNo}</td>
                        <td>{course.courseName}</td>
                        <td>{course.campusName}校区{course.collegeName}</td>
                        <td>{course.majorName}</td>
                        <td>{course.teacherNo}</td>
                        <td>{course.teacherName}</td>
                        <td className="cs-manage-op"  data-courseid={course.courseId}>
                            <button className="cs-manage-give" onClick={that.addStudent}>添加学生</button>
                            <button className="cs-manage-delete" onclick={that.deleteStudent}>删除学生</button>
                        </td>
                    </tr>
                );
            });
            return (
                <div className="cs-manage">
                    <div className="cs-manage-search box-style" ref="searchData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <CourseNoName className="course-no" onKeyDown={this.keyDownSearchTake}/>
                        <TeacherNoName className="course-name" onKeyDown={this.keyDownSearchTake}/>
                        <div className="cs-search-btn">
                            <button onClick={this.searchTake}>搜索课程</button>
                        </div>
                    </div>
                    <table className="cs-manage-table">
                        <thead>
                            <tr>
                                <th>课程号</th>
                                <th>课程名</th>
                                <th>所属校区院系</th>
                                <th>所属专业</th>
                                <th>教师号</th>
                                <th>教师名</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseNode}
                        </tbody>
                    </table>
                    <div className="cs-manage-page">
                        <button className="pre-page">上一页</button>
                        <button className="next-page">下一页</button>
                    </div>
                </div>
            );
        }
    });

    // 教师管理组件
    var TeacherManage = React.createClass({
//        getInitialState: function () {},
//        loadUserData: function () {},
//        updateUser: function () {},
//        deleteUser: function () {},
//        componentDidMount: function () {},
        render: function () {
            return (
                <div>教师管理</div>
            );
        }
    });

    // 学生管理组件
    var StudentManage = React.createClass({
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
                parseInt(searchdata[3].value) || '',
                searchdata[3].value.replace(/\d+/g, '')
            );
        },
        keyDownSearchStudent: function (e) {
            (e.keyCode || e.which) == 13 && this.searchStudent();
        },
        studentTake: function () {
            console.log('学生选课');
        },
        deleteStudent: function () {
            console.log('删除学生');
        },
        addStudent: function () {
            console.log('添加学生');
        },
        componentDidMount: function () {
            this.loadStudentData();
        },
        render: function () {
            var that = this;
            var studentNode = this.state.data.map(function (student, index) {
                return (
                    <tr className="t-hover">
                        <td>{student.studentNo}</td>
                        <td>{student.name}</td>
                        <td>{student.sex}</td>
                        <td>{student.hwCampus.name + '校区' + student.hwCollege.collegeName + student.grade + '级'}</td>
                        <td>{student.hwMajor.name + student.class_ + '班'}</td>
                        <td className="cs-manage-op"  data-studentid={student.id}>
                            <button className="cs-manage-give" onClick={that.studentTake}>学生选课</button>
                            <button className="cs-manage-delete" onClick={that.deleteStudent}>删除学生</button>
                        </td>
                    </tr>
                );
            });
            return (
                <div className="cs-manage">
                    <div className="cs-manage-search box-style" ref="searchData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <StudentGrade classNAme="college-id" />
                        <StudentNoName className="course-no" onKeyDown={this.keyDownSearchStudent}/>
                        <div className="cs-search-btn">
                            <button onClick={this.searchStudent}>搜索学生</button>
                        </div>
                        <div className="cs-addnew">
                            <button onClick={this.addStudent}>新增学生</button>
                        </div>
                    </div>
                    <table className="cs-manage-table">
                        <thead>
                            <tr>
                                <th>学号</th>
                                <th>姓名</th>
                                <th>性别</th>
                                <th>校区院系年级</th>
                                <th>所属专业/班级</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentNode}
                        </tbody>
                    </table>
                    <div className="cs-manage-page">
                        <button className="pre-page">上一页</button>
                        <button className="next-page">下一页</button>
                    </div>
                </div>
            );
        }
    });

    var AppView = React.createClass({
        getInitialState: function () { return {curWrap: 't-content-wrap2'}; },
        userManage: function () { this.setState({curWrap: 't-content-wrap1'}); },
        csManage:function () { this.setState({curWrap: 't-content-wrap2'}); },
        takeManage: function () { this.setState({curWrap: 't-content-wrap3'}); },
        teacherManage: function () {this.setState({curWrap: 't-content-wrap4'}); },
        studentrManage: function () { this.setState({curWrap: 't-content-wrap5'}); },
        render: function () {
            return (
                <div>
                    <header className="box-style">
                        <span className="h-logo"></span>
                        <p>作业网后台管理系统</p>
                        <div className="h-info box-style">
                            <p>您好，超级管理员</p>
                            <a href="javascript:void(0)" onClick={this.exitApp}>退出</a>
                        </div>
                    </header>
                    <section className="main-content">
                        <div className="menu-bar" role="menu">
                            <ul className="box-style">
                                <li className="t-hover" onClick={this.userManage}>用户管理</li>
                                <li className="active-li t-hover" onClick={this.csManage}>课程管理</li>
                                <li className="t-hover" onClick={this.takeManage}>选课管理</li>
                                <li className="t-hover" onClick={this.teacherManage}>教师管理</li>
                                <li className="t-hover" onClick={this.studentrManage}>学生管理</li>
                            </ul>
                        </div>
                        <div className="content">
                            <div className={"content-wrap t-content-wrap box-style " + this.state.curWrap} ref="contentWrap">
                                <section id="content-wrap1">
                                    <UserManage />
                                </section>
                                <section id="content-wrap2">
                                    <CsManage url={serverpath + "course/searchCourse"} />
                                </section>
                                <section id="content-wrap3">
                                    <TakeManage url={serverpath + "course/courseTeachingList"} />
                                </section>
                                <section id="content-wrap4">
                                    <TeacherManage url={serverpath}/>
                                </section>
                                <section id="content-wrap5">
                                    <StudentManage url={serverpath + "student/searchStudent"}/>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>
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
            React.render(<AppView type={type} bar={bar}/>, document.getElementById('manage-part'));
        }
    }

});

