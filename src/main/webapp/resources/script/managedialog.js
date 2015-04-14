/**
 * Created by zqc on 15-4-13.
 */

define(function (require, exports, module) {

    var React = require('React');
    var $ = require('jquery');
    var cellComponent = require('cellcomponent');

    var serverpath = 'http://localhost:8080/mvnhk/',
        CollegeList = cellComponent.CollegeList,
        MajorList = cellComponent.MajorList,
        SelectCampus = cellComponent.SelectCampus,
        SelectCollege = cellComponent.SelectCollege,
        SelectMajor = cellComponent.SelectMajor,
        SelectTermYear = cellComponent.SelectTermYear,
        SelectTerm = cellComponent.SelectTerm,
        CourseNo = cellComponent.CourseNo,
        InputText = cellComponent.InputText,
        SelectSex = cellComponent.SelectSex,
        CourseName = cellComponent.CourseName,
        CourseNoName = cellComponent.CourseNoName,
        TeacherNoName = cellComponent.TeacherNoName,
        StudentNoName = cellComponent.StudentNoName,
        StudentGrade = cellComponent.StudentGrade;

    // 弹框组件
    var Dialog = React.createClass({displayName: "Dialog",
        getInitialState: function () {
            return {display: ''};
        },
        closeDialog: function () {
//            $(this.refs.dialogDiv.getDOMNode()).hide();
            this.setState({display: 'none'});
        },
        componentWillReceiveProps: function () {
            this.setState({display: 'block'});
        },
        getDialogBody: function (body_type) {
            switch (body_type) {
                case 'AddCourseDialogBody':
                    return React.createElement(AddCourseDialogBody, {
                        url: this.props.url, 
                        refreshCourseData: this.props.refreshCourseData, 
                        onClose: this.closeDialog}
                    );
                case 'AddTeacherDialogBody':
                    return React.createElement(AddTeacherDialogBody, {
                        url: this.props.url, 
                        refreshTeacherData: this.props.refreshTeacherData, 
                        onClose: this.closeDialog}
                    );
                case 'AddStudentDialogBody':
                    return React.createElement(AddStudentDialogBody, {
                        url: this.props.url, 
                        refreshStudentData: this.props.refreshStudentData, 
                        onClose: this.closeDialog}
                    );
                case 'DeleteCourseDialogBody':
                    return React.createElement(DeleteCourseDialogBody, {
                        url: this.props.url, 
                        courseId: this.props.courseId, 
                        removeCourseTr: this.props.removeCourseTr, 
                        onClose: this.closeDialog}
                    );
                case 'DeleteTeacherDialogBody':
                    return React.createElement(DeleteTeacherDialogBody, {
                        url: this.props.url, 
                        teacherId: this.props.teacherId, 
                        removeTeacherTr: this.props.removeTeacherTr, 
                        onClose: this.closeDialog}
                    );
                case 'DeleteStudentDialogBody':
                    return React.createElement(DeleteStudentDialogBody, {
                    url: this.props.url, 
                    studentId: this.props.studentId, 
                    removeStudentTr: this.props.removeStudentTr, 
                    onClose: this.closeDialog}
                    );
                case 'UpdateCourseDialogBody':
                    return React.createElement(UpdateCourseDialogBody, {
                        url_detial: this.props.url_detial, 
                        url: this.props.url, 
                        courseId: this.props.courseId, 
                        updateCourseTr: this.props.updateCourseTr, 
                        onClose: this.closeDialog}
                    );
                case 'GiveCourseManageBody':
                    return React.createElement(GiveCourseManageBody, {
                        url: this.props.url, 
                        courseId: this.props.courseId, 
                        onClose: this.closeDialog}
                    );
                case  'TakeOpStudentDialogBody':
                    return React.createElement(TakeOpStudentDialogBody, {
                        url: this.props.url, 
                        onClose: this.closeDialog}
                    );
                case 'StudentManageTakeCourseDialog':
                    return React.createElement(StudentManageTakeCourseDialog, {
                        url: this.props.url, 
                        url_add: this.props.url_add, 
                        url_delete: this.props.url_delete, 
                        url_search: this.props.url_search, 
                        studentId: this.props.studentId, 
                        onClose: this.closeDialog}
                    );
                default : return 'none-dialog';
            }
        },
        render: function () {
            var body = this.getDialogBody(this.props.body),
                display = {display: this.state.display};
            return (
                React.createElement("div", {className: "dialog-shade", ref: "dialogDiv", style: display}, 
                    React.createElement("div", {className: this.props.contentClassName + " dialog-content"}, 
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

    var DeleteDialogBody = React.createClass({displayName: "DeleteDialogBody",
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body"}, 
                    React.createElement("div", {className: "delete-tip"}, 
                        React.createElement("p", null, "确定删除吗？删除后不可修复！")
                    ), 
                    React.createElement("div", {className: "dialog-btn delete-btn"}, 
                        React.createElement("button", {className: "delete-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "delete-btn-sure", onClick: this.props.delete}, "删除")
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
                    this.props.removeCourseTr(); // 删除课程trDOM
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (React.createElement(DeleteDialogBody, {delete: this.deleteCourse, onClose: this.props.onClose}));
        }
    });

    // 教师管理 删除教师提示组件
    var DeleteTeacherDialogBody = React.createClass({displayName: "DeleteTeacherDialogBody",
        deleteTeacher: function () {
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {tid: this.props.teacherId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除教师', data);
                    this.props.onClose();
                    this.props.removeTeacherTr(); // 删除课程trDOM
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (React.createElement(DeleteDialogBody, {delete: this.deleteTeacher, onClose: this.props.onClose}));
        }
    });

    // 学生管理 删除学生提示组件
    var DeleteStudentDialogBody = React.createClass({displayName: "DeleteStudentDialogBody",
        deleteStudent: function () {
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {sId: this.props.studentId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除学生成功', data);
                    this.props.onClose();
                    this.props.removeStudentTr(); // 删除课程trDOM
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (React.createElement(DeleteDialogBody, {delete: this.deleteStudent, onClose: this.props.onClose}));
        }
    });

    // 增加课程组件
    var AddCourseDialogBody = React.createClass({displayName: "AddCourseDialogBody",
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
                    majorId: courseDatas[2].value,
                    courseNo: courseDatas[3].value,
                    courseName: courseDatas[4].value
                },
                dataType: 'json',
                success: function(data) {
                    console.log('添加课程', data);
                    // 添加成功后搜索该课程，呈现给用户
                    this.props.refreshCourseData(courseDatas[0].value, courseDatas[1].value, courseDatas[3].value, ''); // 添加成功后刷新课程列表
                    // 关闭弹框
                    this.props.onClose();
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
                    React.createElement(SelectCampus, {className: "add-cs-campus", setSelectCampus: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "add-cs-college", campusId: this.state.campusId, setSelectCollege: this.setSelectCollege}), 
                    React.createElement(SelectMajor, {className: "add-cs-college", collegeId: this.state.collegeId}), 
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

    // 增加教师组件
    var AddTeacherDialogBody = React.createClass({displayName: "AddTeacherDialogBody",
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
        addTeacher: function () {
            var TeacherDatas = $(this.refs.dialogBody.getDOMNode()).find('input, select');
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {
                    jsonObject: JSON.stringify({
                        campusId: TeacherDatas[0].value,
                        collegeId: TeacherDatas[1].value,
                        teacherNo: TeacherDatas[2].value,
                        trueName: TeacherDatas[3].value,
                        sex: TeacherDatas[4].value,
                        mobile: TeacherDatas[5].value,
                        email: TeacherDatas[6].value
                    })
                },
                dataType: 'json',
                success: function(data) {
                    console.log('添加教师成功', data);
                    // 添加成功后搜索该课程，呈现给用户
                    this.props.refreshTeacherData(TeacherDatas[0].value, TeacherDatas[1].value, TeacherDatas[2].value, ''); // 添加成功后刷新课程列表
                    // 关闭弹框
                    this.props.onClose();
                    TeacherDatas.val('');
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement(SelectCampus, {className: "add-cs-campus", setSelectCampus: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "add-cs-college", campusId: this.state.campusId, setSelectCollege: this.setSelectCollege}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "教师号", placeholderText: "输入教师号"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "教师名", placeholderText: "输入教师名"}), 
                    React.createElement(SelectSex, {className: "add-cs-college"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "手机号", placeholderText: "输入手机号"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "邮箱", placeholderText: "输入教师邮箱"}), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.addTeacher}, "添加")
                    )
                )
            );
        }
    });

    // 增加学生组件
    var AddStudentDialogBody = React.createClass({displayName: "AddStudentDialogBody",
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
        addStudent: function () {
            var studentDatas = $(this.refs.dialogBody.getDOMNode()).find('input, select');
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {
                    jsonObject: JSON.stringify({
                        campusId: studentDatas[0].value,
                        collegeId: studentDatas[1].value,
                        majorId: studentDatas[2].value,
                        studentNo: studentDatas[3].value,
                        name: studentDatas[4].value,
                        sex: studentDatas[5].value,
                        grade: studentDatas[6].value,
                        cla: studentDatas[7].value,
                        email: studentDatas[8].value
                    })
                },
                dataType: 'json',
                success: function(data) {
                    console.log('添加教师成功', data);
                    // 添加成功后搜索该课程，呈现给用户
                    this.props.refreshStudentData(studentDatas[0].value, studentDatas[1].value, '', studentDatas[3].value, ''); // 添加成功后刷新课程列表
                    // 关闭弹框
                    this.props.onClose();
                    studentDatas.val('');
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement(SelectCampus, {className: "add-cs-campus", setSelectCampus: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "add-cs-college", campusId: this.state.campusId, setSelectCollege: this.setSelectCollege}), 
                    React.createElement(SelectMajor, {className: "add-cs-college", collegeId: this.state.collegeId}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "学号", placeholderText: "输入学号"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "学生名", placeholderText: "输入学生名"}), 
                    React.createElement(SelectSex, {className: "add-cs-college"}), 
                    React.createElement(StudentGrade, {className: "add-cs-coursename"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "班级", placeholderText: "输入班级"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "邮箱", placeholderText: "输入学生邮箱"}), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.addStudent}, "添加")
                    )
                )
            );
        }
    });

    // 更新课程组件
    var UpdateCourseDialogBody = React.createClass({displayName: "UpdateCourseDialogBody",
        getInitialState: function () {
            return {
                campusId: '',
                collegeId: '',
                courseId: '',
                courseNo: '',
                courseName: ''
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
        getCourseData: function (courseId) {
            $.ajax({
                url: this.props.url_detial,
                data: {courseId: courseId},
                dataType: 'json',
                success: function(data) {
                    console.log('获取课程详细信息', data);
                    this.setState({
                        campusId: data.campusId,
                        collegeId: data.collegeId,
                        courseNo: data.courseNo,
                        courseName: data.courseName
                    });
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        updateCourse: function () {
            var courseDatas = $(this.refs.dialogBody.getDOMNode()).find('input, select');
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {
                    campusId: courseDatas[0].value,
                    collegeId: courseDatas[1].value,
                    majorId: courseDatas[2].value,
                    courseId: this.state.courseId,
                    courseName: courseDatas[4].value
                },
                dataType: 'json',
                success: function(data) {
                    console.log('更新课程', data);
                    this.props.onClose();
                    this.props.updateCourseTr();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({courseId: nextProps.courseId});
            this.getCourseData(nextProps.courseId);
//            console.log('componentWillReceiveProps');
        },
        componentWillMount: function () {
            this.setState({courseId: this.props.courseId});
            this.getCourseData(this.props.courseId);
//            console.log('componentWillMount')
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement(SelectCampus, {className: "add-cs-campus", setSelectCampus: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "add-cs-college", campusId: this.state.campusId, setSelectCollege: this.setSelectCollege}), 
                    React.createElement(SelectMajor, {className: "add-cs-college", collegeId: this.state.collegeId}), 
                    React.createElement(CourseNo, {className: "add-cs-courseno", readonly: "readonly", value: this.state.courseNo}), 
                    React.createElement(CourseName, {className: "add-cs-coursename", value: this.state.courseName}), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.updateCourse}, "修改")
                    )
                )
            );
        }
    });

    // 授课管理组件
    var GiveCourseManageBody = React.createClass({displayName: "GiveCourseManageBody",
        getInitialState: function () {
            return {
                teacherList: [],
                courseId: 1,
                startYear: 2011,
                schoolTerm: 1
            }
        },
        loadTermTeacherData: function (courseId, startYear, schoolTerm) {
            $.ajax({
                url: this.props.url,
                data: {courseId: courseId, startYear: startYear, schoolTerm: schoolTerm},
                dataType: 'json',
                success: function(data) {
                    console.log('添加教师', data);
                    this.setState({teacherList: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        termTeacherList: function () {
            var select = $(this.refs.termTeacherList.getDOMNode()).find('select');
            this.loadTermTeacherData(this.state.courseId, select[0].value, select[1].value);
        },
        searcheTeacher: function () {
            var searcheData = $(this.refs.termTeacherList.getDOMNode()).find('select');

        },
        fold: function (e) {
            $(e.target).hide();
            $(e.target).parent().next().hide(500);
        },
        unfold: function (e) {
            $(e.target).prev().show();
            $(e.target).parent().next().show(500);
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({courseId: nextProps.courseId});
            this.loadTermTeacherData(nextProps.courseId, this.state.startYear, this.state.schoolTerm);
        },
        componentWillMount: function () {
            this.setState({courseId: this.props.courseId});
            this.loadTermTeacherData(this.props.courseId, this.state.startYear, this.state.schoolTerm);
        },
        render: function () {
            var display = {display: 'none'},
                teacherNode = this.state.teacherList.map(function (teacher, index) {
                return (
                    React.createElement("li", {className: "dialog-take-stu"}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, teacher.name), 
                            React.createElement("p", null, teacher.teacherNo)
                        ), 
                        React.createElement("div", {className: "dialog-take-stu-detail"}, 
                            React.createElement("p", null, teacher.campusName, "校区"), 
                            React.createElement("p", null, teacher.collegeName), 
                            React.createElement("p", null, teacher.majorName), 
                            React.createElement("p", null, teacher.teacherNo), 
                            React.createElement("p", null, teacher.name), 
                            React.createElement("p", null, teacher.sex)
                        )
                    )
                );
            });
            return (
                React.createElement("div", {className: "dialog-body"}, 
                    React.createElement("div", {className: "add-stu-search box-style", ref: "termTeacherList"}, 
                        React.createElement(SelectTermYear, {classNAme: "add-stu-college"}), 
                        React.createElement(SelectTerm, {classNAme: "add-stu-college"}), 
                        React.createElement("div", {className: "add-stu-search-btn"}, 
                            React.createElement("button", {onClick: this.termTeacherList}, "查看该学期教师列表")
                        )
                    ), 
                    React.createElement("div", {className: "dialog-take-ul"}, 
                        React.createElement("ul", {className: "flex-style"}, 
                        teacherNode
                        )
                    ), 
                    React.createElement("div", {className: "dialog-btn add-stu-btn"}, 
                        React.createElement("span", {onClick: this.fold, style: display}, "收起"), 
                        React.createElement("button", {className: "add-stu-btn-add", onClick: this.unfold}, "添加教师")
                    ), 
                    React.createElement(SearcheTeacher, null)
                )
            );
        }
    });

    // 搜索教师组件
    var SearcheTeacher = React.createClass({displayName: "SearcheTeacher",
        getInitialState: function () {
            return {teacherData: [], campusId: 1};
        },
        setSelectCampus: function (e) {
            this.setState({campusId: e.target.value});
        },
        render: function () {
            var display = {display: 'none'},
                teacherNode = this.state.teacherData.map(function (teacher,index) {
                return (
                    React.createElement("li", {className: "dialog-take-stu search-result-btn"}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, "陈键钊"), 
                            React.createElement("p", null, "20112100182")
                        ), 
                        React.createElement("div", {className: "dialog-take-stu-detail"}, 
                            React.createElement("p", null, "石牌校区"), 
                            React.createElement("p", null, "计算机学院2011级"), 
                            React.createElement("p", null, "网络工程6班"), 
                            React.createElement("p", null, "20112100182"), 
                            React.createElement("p", null, "陈键钊"), 
                            React.createElement("p", null, "男")
                        )
                    )
                );
            });
            return (
                React.createElement("div", {className: "add-stu-op", style: display}, 
                    React.createElement("div", {className: "add-stu-search box-style", ref: "searcheData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(TeacherNoName, {className: "course-no"}), 
                        React.createElement("div", {className: "add-stu-search-btn"}, 
                            React.createElement("button", {onClick: this.searcheTeacher}, "搜索教师")
                        )
                    ), 
                    React.createElement("div", {className: "add-stu-search-ul"}, 
                        React.createElement("ul", {className: "flex-style"}, 
                        teacherNode
                        )
                    )
                )
            );
        }
    });

    // 选课管理->增删学生
    var TakeOpStudentDialogBody = React.createClass({displayName: "TakeOpStudentDialogBody",
        getInitialState: function () {
            return {
                studentList: [],
                courseId: 1,
                startYear: 2011,
                schoolTerm: 1
            }
        },
        fold: function (e) {
            $(e.target).hide();
            $(e.target).parent().next().hide(500);
        },
        unfold: function (e) {
            $(e.target).prev().show();
            $(e.target).parent().next().show(500);
        },
//        componentWillReceiveProps: function (nextProps) {
//            this.setState({courseId: nextProps.courseId});
//            this.loadTermTeacherData(nextProps.courseId, this.state.startYear, this.state.schoolTerm);
//        },
//        componentWillMount: function () {
//            this.setState({courseId: this.props.courseId});
//            this.loadTermTeacherData(this.props.courseId, this.state.startYear, this.state.schoolTerm);
//        },
        render: function () {
            var display = {display: 'none'},
                studentNode = this.state.studentList.map(function (teacher, index) {
                    return (
                        React.createElement("li", {className: "dialog-take-stu"}, 
                            React.createElement("div", null, 
                                React.createElement("p", null, teacher.name), 
                                React.createElement("p", null, teacher.teacherNo)
                            ), 
                            React.createElement("div", {className: "dialog-take-stu-detail"}, 
                                React.createElement("p", null, teacher.campusName, "校区"), 
                                React.createElement("p", null, teacher.collegeName), 
                                React.createElement("p", null, teacher.majorName), 
                                React.createElement("p", null, teacher.teacherNo), 
                                React.createElement("p", null, teacher.name), 
                                React.createElement("p", null, teacher.sex)
                            )
                        )
                        );
                });
            return (
                React.createElement("div", {className: "dialog-body"}, 
                    React.createElement("div", {className: "dialog-take-ul"}, 
                        React.createElement("ul", {className: "flex-style"}, 
                        studentNode
                        )
                    ), 
                    React.createElement("div", {className: "dialog-btn add-stu-btn"}, 
                        React.createElement("span", {onClick: this.fold, style: display}, "收起"), 
                        React.createElement("button", {className: "add-stu-btn-add", onClick: this.unfold}, "添加学生")
                    ), 
                    React.createElement(SearcheStudent, null)
                )
                );
        }
    });

    // 学生管理->学生选课
    var StudentManageTakeCourseDialog = React.createClass({displayName: "StudentManageTakeCourseDialog",
        getInitialState: function () {
            return {
                courseList: [],
                studentId: '',
                startYear: 2011,
                schoolTerm: 1
            }
        },
        loadTermCourseData: function (studentId, startYear, schoolTerm) {
            $.ajax({
                url: this.props.url,
                data: {studentId: studentId, startYear: startYear, schoolTerm: schoolTerm},
                dataType: 'json',
                success: function(data) {
                    console.log('学期课程列表', data);
                    this.setState({courseList: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        termCourseList: function () {
            var select = $(this.refs.termCourseList.getDOMNode()).find('select');
            this.loadTermCourseData(this.state.studentId, select[0].value, select[1].value);
        },
        deleteCourse: function (e) {
            $(e.currentTarget).find('.dialog-sure-delete').addClass('t-dialog-sure-delete-show');
        },
        sureDeleteCourse: function (e) {
            console.log('删除课程');
            var $cur = $(e.target), csId = $cur.attr('data-csid');
            $.ajax({
                type: 'post',
                url: this.props.url_delete,
                data: {csId: csId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除成功', data);
//                    $cur.parent().parent().parent().remove();  // 删除节点
                    this.termCourseList();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        onClear: function (e) {
            console.log('取消删除');
            e.stopPropagation();
            $(e.currentTarget).parent().parent().removeClass('t-dialog-sure-delete-show');
        },
        fold: function (e) {
            $(e.target).hide();
            $(e.target).parent().next().hide(500);
        },
        unfold: function (e) {
            $(e.target).prev().show();
            $(e.target).parent().next().show(500);
        },
        setSelectTerm: function (e) {this.setState({schoolTerm: e.target.value})},
        setSelectTermYear: function (e) {this.setState({startYear: e.target.value})},
        componentWillReceiveProps: function (nextProps) {
            this.setState({studentId: nextProps.studentId});
            this.loadTermCourseData(nextProps.studentId, this.state.startYear, this.state.schoolTerm);
        },
        componentWillMount: function () {
            this.setState({studentId: this.props.studentId});
            this.loadTermCourseData(this.props.studentId, this.state.startYear, this.state.schoolTerm);
        },
        render: function () {
            var that=this, display = {display: 'none'}, courseNode = [];
            this.state.courseList.forEach(function (course, index) {
                courseNode.push(
                    React.createElement("li", {className: "dialog-take-stu", onClick: that.deleteCourse}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, course.majorName), 
                            React.createElement("p", null, course.courseName)
                        ), 
                        React.createElement("div", {className: "dialog-sure-delete t-dialog-sure-delete"}, 
                            React.createElement("div", {className: "dialog-sure-btn"}, 
                                React.createElement("span", {onClick: that.sureDeleteCourse, "data-csid": course.csId}, "确认删除"), 
                                React.createElement("span", {onClick: that.onClear}, "取消")
                            )
                        )
                    )
                );
                courseNode.push(
                    React.createElement("div", {className: "dialog-take-stu-detail"}, 
                        React.createElement("p", null, course.campusName, "校区", course.collegeName), 
                        React.createElement("p", null, course.majorName), 
                        React.createElement("p", null, course.courseName)
                    )
                );
            });
            return (
                React.createElement("div", {className: "dialog-body"}, 
                    React.createElement("div", {className: "add-stu-search box-style", ref: "termCourseList"}, 
                        React.createElement(SelectTermYear, {classNAme: "add-stu-college", setSelectTermYear: this.setSelectTermYear}), 
                        React.createElement(SelectTerm, {classNAme: "add-stu-college", setSelectTerm: this.setSelectTerm}), 
                        React.createElement("div", {className: "add-stu-search-btn"}, 
                            React.createElement("button", {onClick: this.termCourseList}, "查看学生该学期课程列表")
                        )
                    ), 
                    React.createElement("div", {className: "dialog-take-ul"}, 
                        React.createElement("ul", {className: "flex-style"}, 
                        courseNode
                        )
                    ), 
                    React.createElement("div", {className: "dialog-btn add-stu-btn"}, 
                        React.createElement("span", {onClick: this.fold, style: display}, "收起"), 
                        React.createElement("button", {className: "add-stu-btn-add", onClick: this.unfold}, "添加课程")
                    ), 
                    React.createElement(SearcheCourse, {
                        startYear: this.state.startYear, 
                        schoolTerm: this.state.schoolTerm, 
                        url_search: this.props.url_search, 
                        url_add: this.props.url_add, 
                        studentId: this.state.studentId, 
                        refreshCourseData: this.loadTermCourseData}
                    )
                )
            );
        }
    });

    // 搜索课程组件
    var SearcheCourse = React.createClass({displayName: "SearcheCourse",
        getInitialState: function () {
            return {courseData: [], campusId: 1};
        },
        setSelectCampus: function (e) {
            this.setState({campusId: e.target.value});
        },
        loadCourseData: function (campusId, collegeId, startYear, schoolTerm, courseName) {
            $.ajax({
                url: this.props.url_search,
                data: {
                    campusId: campusId,
                    collegeId: collegeId,
                    startYear: startYear,
                    schoolTerm: schoolTerm,
                    courseName: courseName
                },
                dataType: 'json',
                success: function(data) {
                    console.log('课程搜索结果', data);
                    this.setState({courseData: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        searchCourse: function () {
            var searcheData = $(this.refs.searcheData.getDOMNode()).find('input, select');
            this.loadCourseData(
                searcheData[0].value,
                searcheData[1].value,
                this.props.startYear,
                this.props.schoolTerm,
                searcheData[2].value
            );
        },
        toggleSelectCourse: function (e) {
            var $cur = $(e.currentTarget);
            if($cur.hasClass('has-select')){
                $cur.removeClass('has-select');
            }
            else{
                $cur.addClass('has-select');
            }
        },
        addcourses: function () {
            var i, selectLi = $(this.refs.selectLi.getDOMNode()).find('li.has-select'), l = selectLi.length, ctId = [];
            for(i = 0; i < l; i ++){
                ctId.push(selectLi[i].getAttribute('data-ctid'));
            }
            $.ajax({
                type: 'post',
                url: this.props.url_add,
                data: {sId: this.props.studentId, ctId: ctId},
                dataType: 'json',
                success: function(data) {
                    console.log('添加课程', data);
                    // 刷新学生课程列表
                    this.props.refreshCourseData(this.props.studentId, this.props.startYear, this.props.schoolTerm);
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({courseData: []}); // 切换学期时清空上一次的搜索结果
        },
        render: function () {
            var that=this, display = {display: 'none'}, courseNode = [];
            this.state.courseData.forEach(function (course, index) {
                courseNode.push(
                    React.createElement("li", {className: "dialog-take-stu search-result-btn", "data-ctid": course.ctId, onClick: that.toggleSelectCourse}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, course.majorName), 
                            React.createElement("p", null, course.courseName), 
                            React.createElement("p", null, course.teacherName)
                        )
                    )
                );
                courseNode.push(
                    React.createElement("div", {className: "dialog-take-stu-detail"}, 
                        React.createElement("p", null, course.campusName, "校区", course.collegeName), 
                        React.createElement("p", null, course.majorName), 
                        React.createElement("p", null, course.courseName), 
                        React.createElement("p", null, course.startYear + '~' + (parseInt(course.startYear)+1) + '学年第' + course.schoolTerm + '学期'), 
                        React.createElement("p", null, course.teacherName)
                    )
                );
            });
            return (
                React.createElement("div", {className: "add-stu-op", style: display}, 
                    React.createElement("div", {className: "add-stu-search flex-style", ref: "searcheData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(InputText, {className: "course-no", labelName: "课程名", placeholderText: "请输入课程名"}), 
                        React.createElement("div", {className: "add-stu-search-btn"}, 
                            React.createElement("button", {onClick: this.searchCourse}, "搜索课程")
                        )
                    ), 
                    React.createElement("div", {className: "add-stu-search-ul"}, 
                        React.createElement("ul", {className: "flex-style", ref: "selectLi"}, 
                        courseNode
                        )
                    ), 
                    React.createElement("div", {className: "dialog-btn delete-btn"}, 
                        React.createElement("button", {className: "delete-btn-clear", onClick: this.addcourses}, "添加课程")
                    )
                )
                );
        }
    });

    // 搜索学生组件
    var SearcheStudent = React.createClass({displayName: "SearcheStudent",
        getInitialState: function () {
            return {studentData: [], campusId: 1};
        },
        setSelectCampus: function (e) {
            this.setState({campusId: e.target.value});
        },
        searcheStudent: function () {

        },
        render: function () {
            var display = {display: 'none'},
                studentNode = this.state.studentData.map(function (teacher,index) {
                    return (
                        React.createElement("li", {className: "dialog-take-stu search-result-btn"}, 
                            React.createElement("div", null, 
                                React.createElement("p", null, "陈键钊"), 
                                React.createElement("p", null, "20112100182")
                            ), 
                            React.createElement("div", {className: "dialog-take-stu-detail"}, 
                                React.createElement("p", null, "石牌校区"), 
                                React.createElement("p", null, "计算机学院2011级"), 
                                React.createElement("p", null, "网络工程6班"), 
                                React.createElement("p", null, "20112100182"), 
                                React.createElement("p", null, "陈键钊"), 
                                React.createElement("p", null, "男")
                            )
                        )
                        );
                });
            return (
                React.createElement("div", {className: "add-stu-op", style: display}, 
                    React.createElement("div", {className: "add-stu-search box-style", ref: "searcheData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(StudentNoName, {className: "course-no"}), 
                        React.createElement("div", {className: "add-stu-search-btn"}, 
                            React.createElement("button", {onClick: this.searcheStudent}, "搜索学生")
                        )
                    ), 
                    React.createElement("div", {className: "add-stu-search-ul"}, 
                        React.createElement("ul", {className: "flex-style"}, 
                        studentNode
                        )
                    )
                )
            );
        }
    });



    module.exports = {
        Dialog: Dialog
    }

});

