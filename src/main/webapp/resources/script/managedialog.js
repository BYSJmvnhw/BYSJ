/**
 * Created by zqc on 15-4-13.
 */

define(function (require, exports, module) {

    var React = require('React');
    var $ = require('jquery');
    var cellComponent = require('cellcomponent');

    var serverpath = 'http://localhost:8080/mvnhk/',
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
                        url_detail: this.props.url_detail, 
                        url: this.props.url, 
                        courseId: this.props.courseId, 
                        updateCourseTr: this.props.updateCourseTr, 
                        onClose: this.closeDialog}
                    );
                case 'UpdateStudentDialogBody':
                    return React.createElement(UpdateStudentDialogBody, {
                        url_detail: this.props.url_detail, 
                        url: this.props.url, 
                        studentId: this.props.studentId, 
                        updateStudentTr: this.props.updateStudentTr, 
                        onClose: this.closeDialog}
                    );
                case 'UpdateTeacherDialogBody':
                    return React.createElement(UpdateTeacherDialogBody, {
                        url_detail: this.props.url_detail, 
                        url: this.props.url, 
                        teacherId: this.props.teacherId, 
                        updateTeacherTr: this.props.updateTeacherTr, 
                        onClose: this.closeDialog}
                    );
                case 'UpdateUserDialogBody':
                    return React.createElement(UpdateUserDialogBody, {
                        url: this.props.url, 
                        userId: this.props.userId, 
                        onClose: this.closeDialog}
                    );
                case 'GiveCourseManageBody':
                    return React.createElement(GiveCourseManageBody, {
                        url: this.props.url, 
                        url_add: this.props.url_add, 
                        url_search: this.props.url_search, 
                        url_delete: this.props.url_delete, 
                        courseId: this.props.courseId, 
                        onClose: this.closeDialog}
                    );
                case  'TakeOpStudentDialogBody':
                    return React.createElement(TakeOpStudentDialogBody, {
                        url: this.props.url, 
                        url_add: this.props.url_add, 
                        url_delete: this.props.url_delete, 
                        url_search: this.props.url_search, 
                        ctId: this.props.ctId, 
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
                case 'TeacherManageGiveCourseDialog':
                    return React.createElement(TeacherManageGiveCourseDialog, {
                        url: this.props.url, 
                        url_add: this.props.url_add, 
                        url_delete: this.props.url_delete, 
                        url_search: this.props.url_search, 
                        teacherId: this.props.teacherId, 
                        onClose: this.closeDialog}
                    );
                case 'UpdateThreadDialogBody':
                    return React.createElement(UpdateThreadDialogBody, {
                        url: this.props.url, 
                        threadId: this.props.threadId, 
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
                        majorId: TeacherDatas[2].value,
                        teacherNo: TeacherDatas[3].value,
                        trueName: TeacherDatas[4].value,
                        sex: TeacherDatas[5].value,
                        mobile: TeacherDatas[6].value,
                        email: TeacherDatas[7].value
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
                    React.createElement(SelectMajor, {className: "add-cs-college", collegeId: this.state.collegeId}), 
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
                url: this.props.url_detail,
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

    // 更新学生信息组件
    var UpdateStudentDialogBody = React.createClass({displayName: "UpdateStudentDialogBody",
        getInitialState: function () {
            return {studentData: {}};
        },
        setSelectCampus: function (e) {
            var student = this.state.studentData;
            student.campusId=e.target.value;
            this.setState({studentData: student});
        },
        setSelectCollege: function (e) {
            var student = this.state.studentData;
            student.collegeId=e.target.value;
            this.setState({studentData: student});
        },
        updateStudentData: function (studentId) {
            var studentDatas = $(this.refs.dialogBody.getDOMNode()).find('input, select'),
                jsonObject = {
                    id: studentId,
                    campusId: studentDatas[0].value,
                    collegeId: studentDatas[1].value,
                    majorId: studentDatas[2].value,
                    studentNo: studentDatas[3].value,
                    name: studentDatas[4].value,
                    sex: studentDatas[5].value,
                    grade: studentDatas[6].value,
                    cla: studentDatas[7].value,
                    email: studentDatas[8].value
                };
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {jsonObject: JSON.stringify(jsonObject)},
                dataType: 'json',
                success: function(data) {
                    console.log('修改学生信息', data);
                    // 添加成功后搜索该课程，呈现给用户
                    this.props.updateStudentTr();
                    // 关闭弹框
                    this.props.onClose();
                    studentDatas.val('');
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        updateStudent: function () {
            this.updateStudentData(this.props.studentId);
        },
        getStudentData: function (studentId) {
            $.ajax({
                url: this.props.url_detail,
                data: {sId: studentId},
                dataType: 'json',
                success: function(data) {
                    console.log('获取学生信息', data);
                    this.setState({studentData: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentWillMount: function () {
            this.getStudentData(this.props.studentId);
        },
        componentWillReceiveProps: function (nextProps) {
            this.getStudentData(nextProps.studentId);
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement(SelectCampus, {className: "add-cs-campus", setSelectCampus: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "add-cs-college", campusId: this.state.studentData.campusId, setSelectCollege: this.setSelectCollege}), 
                    React.createElement(SelectMajor, {className: "add-cs-college", collegeId: this.state.studentData.collegeId}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "学号", placeholderText: "输入学号", value: this.state.studentData.studentNo}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "学生名", placeholderText: "输入学生名", value: this.state.studentData.studentName}), 
                    React.createElement(SelectSex, {className: "add-cs-college"}), 
                    React.createElement(StudentGrade, {className: "add-cs-coursename"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "班级", placeholderText: "输入班级", value: this.state.studentData.cla}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "邮箱", placeholderText: "输入学生邮箱", value: this.state.studentData.email}), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.updateStudent}, "修改")
                    )
                )
                );
        }
    });

    // 更新教师信息组件
    var UpdateTeacherDialogBody = React.createClass({displayName: "UpdateTeacherDialogBody",
        getInitialState: function () {
            return {teacherData: {}};
        },
        setSelectCampus: function (e) {
            var teacher = this.state.teacherData;
            teacher.campusId=e.target.value;
            this.setState({teacherData: teacher});
        },
        setSelectCollege: function (e) {
            var teacher = this.state.teacherData;
            teacher.collegeId=e.target.value;
            this.setState({teacherData: teacher});
        },
        updateTeacher: function () {
            var TeacherDatas = $(this.refs.dialogBody.getDOMNode()).find('input, select'),
                jsonObject={
                    teacherId: this.state.teacherData.teacherId,
                    userId: this.state.teacherData.userId,
                    campusId: TeacherDatas[0].value,
                    collegeId: TeacherDatas[1].value,
                    majorId: TeacherDatas[2].value,
                    teacherNo: TeacherDatas[3].value,
                    trueName: TeacherDatas[4].value,
                    sex: TeacherDatas[5].value,
                    mobile: TeacherDatas[6].value,
                    email: TeacherDatas[7].value
                };
            this.updateTeacherData(jsonObject);
        },
        updateTeacherData: function (jsonObject) {
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {jsonObject: JSON.stringify(jsonObject)},
                dataType: 'json',
                success: function(data) {
                    console.log('修改教师成功', data);
                    this.props.updateTeacherTr(jsonObject);
                    // 关闭弹框
                    this.props.onClose();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        getTeacherData: function (teacherId) {
            $.ajax({
                url: this.props.url_detail,
                data: {tid: teacherId},
                dataType: 'json',
                success: function(data) {
                    console.log('获取教师信息', data);
                    this.setState({teacherData: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentWillMount: function () {
            this.getTeacherData(this.props.teacherId);
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({teacherId: nextProps.teacherId});
            this.getTeacherData(nextProps.teacherId);
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement(SelectCampus, {className: "add-cs-campus", setSelectCampus: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "add-cs-college", campusId: this.state.teacherData.campusId, setSelectCollege: this.setSelectCollege}), 
                    React.createElement(SelectMajor, {className: "add-cs-college", collegeId: this.state.teacherData.collegeId}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "教师号", placeholderText: "输入教师号", value: this.state.teacherData.teacherNo}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "教师名", placeholderText: "输入教师名", value: this.state.teacherData.trueName}), 
                    React.createElement(SelectSex, {className: "add-cs-college"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "手机号", placeholderText: "输入手机号", value: this.state.teacherData.mobile}), 
                    React.createElement(InputText, {className: "add-cs-coursename", labelName: "邮箱", placeholderText: "输入教师邮箱", value: this.state.teacherData.email}), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.updateTeacher}, "修改")
                    )
                )
                );
        }
    });

    // 更新用户密码
    var UpdateUserDialogBody = React.createClass({displayName: "UpdateUserDialogBody",
        updateUserData: function (userId, managerPassword, newPassword) {
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {userId: userId, managerPassword: managerPassword, newPassword: newPassword},
                dataType: 'json',
                success: function(data) {
                    console.log('更新账户密码', data);
                    // 关闭弹框
                    this.props.onClose();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        updateUser: function (e) {
            var data = $(this.refs.dialogBody.getDOMNode()).find('input');
            this.updateUserData(this.props.userId, data[0].value, data[1].value);
            data.val('');
        },
        render: function () {
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement(InputText, {className: "add-cs-coursename", type: "password", labelName: "管理员密码", placeholderText: "输入当前管理员面膜"}), 
                    React.createElement(InputText, {className: "add-cs-coursename", type: "password", labelName: "新密码", placeholderText: "输入用户的新密码"}), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.updateUser}, "修改")
                    )
                )
            );
        }
    });

    // 线程信息管理
    var UpdateThreadDialogBody = React.createClass({displayName: "UpdateThreadDialogBody",
        updateThreadData: function (threadId, hour) {
            $.ajax({
                type: 'post',
                url: this.props.url,
                data: {id: threadId, hour: hour},
                dataType: 'json',
                success: function(data) {
                    console.log('更新线程信息', data);
                    // 关闭弹框
                    this.props.onClose();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        updateThread: function (e) {
            var data = $(this.refs.dialogBody.getDOMNode()).find('select');
            this.updateThreadData(this.props.threadId, data.value);
            data.val('');
        },
        render: function () {
            var option = [], i;
            for(i = 0; i < 24; i ++)
                option[i] = React.createElement("option", {value: i + 1}, "每天", i + 1, "时");
            return (
                React.createElement("div", {className: "dialog-body", ref: "dialogBody"}, 
                    React.createElement("div", {className: "campus-id"}, 
                        React.createElement("label", null, "启动时间/h"), 
                        React.createElement("select", null, 
                        option
                        )
                    ), 
                    React.createElement("div", {className: "dialog-btn add-cs-btn"}, 
                        React.createElement("button", {className: "add-cs-btn-clear", onClick: this.props.onClose}, "取消"), 
                        React.createElement("button", {className: "add-cs-btn-sure", onClick: this.updateThread}, "修改")
                    )
                )
                );
        }
    });

    // 课程管理->授课管理组件
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
                    console.log('授课教师列表', data);
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
        deleteTeacher: function (e) {
            $(e.currentTarget).find('.dialog-sure-delete').addClass('t-dialog-sure-delete-show');
        },
        sureDeleteTeacher: function (e) {
            console.log('删除教师');
            var $cur = $(e.target), ctId = $cur.attr('data-ctid'), index = parseInt($cur.attr('data-index'));
            $.ajax({
                type: 'post',
                url: this.props.url_delete,
                data: {ctId: ctId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除成功', data);
                    var teacherList = this.state.teacherList;
                    teacherList.splice(index, 1);
                    this.setState({studentList: teacherList});
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
        componentWillReceiveProps: function (nextProps) {
            this.setState({courseId: nextProps.courseId});
            this.loadTermTeacherData(nextProps.courseId, this.state.startYear, this.state.schoolTerm);
        },
        componentWillMount: function () {
            this.setState({courseId: this.props.courseId});
            this.loadTermTeacherData(this.props.courseId, this.state.startYear, this.state.schoolTerm);
        },
        render: function () {
            var that = this, display = {display: 'none'}, teacherNode = [];
            this.state.teacherList.forEach(function (teacher, index) {
                teacherNode.push(
                    React.createElement("li", {className: "dialog-take-stu", onClick: that.deleteTeacher}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, teacher.name), 
                            React.createElement("p", null, teacher.teacherNo)
                        ), 
                        React.createElement("div", {className: "dialog-sure-delete t-dialog-sure-delete"}, 
                            React.createElement("div", {className: "dialog-sure-btn"}, 
                                React.createElement("span", {onClick: that.sureDeleteTeacher, "data-index": index, "data-ctid": teacher.ctId}, "确认删除"), 
                                React.createElement("span", {onClick: that.onClear}, "取消")
                            )
                        )
                    )
                );
                teacherNode.push(
                    React.createElement("div", {className: "dialog-take-stu-detail"}, 
                        React.createElement("p", null, teacher.campusName, "校区"), 
                        React.createElement("p", null, teacher.collegeName), 
                        React.createElement("p", null, teacher.majorName), 
                        React.createElement("p", null, teacher.teacherNo), 
                        React.createElement("p", null, teacher.name), 
                        React.createElement("p", null, teacher.sex)
                    )
                );
            });
            return (
                React.createElement("div", {className: "dialog-body"}, 
                    React.createElement("div", {className: "add-stu-search box-style", ref: "termTeacherList"}, 
                        React.createElement(SelectTermYear, {classNAme: "add-stu-college"}), 
                        React.createElement(SelectTerm, {classNAme: "add-stu-college"}), 
                        React.createElement("div", {className: "add-stu-search-btn"}, 
                            React.createElement("button", {onClick: this.termTeacherList}, "授课教师列表")
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
                    React.createElement(SearcheTeacher, {
                        courseId: this.state.courseId, 
                        startYear: this.state.startYear, 
                        schoolTerm: this.state.schoolTerm, 
                        url_add: this.props.url_add, 
                        url_search: this.props.url_search, 
                        refreshTeacherData: this.termTeacherList}
                    )
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
        loadTeacherData: function (campusId, collegeId, teacherNo, teacherName) {
            $.ajax({
                url: this.props.url_search,
                data: {
                    campusId: campusId,
                    collegeId: collegeId,
                    startYear: this.props.startYear,
                    schoolTerm: this.props.schoolTerm,
                    teacherNo: teacherNo,
                    name: teacherName
                },
                dataType: 'json',
                success: function(data) {
                    console.log('搜索教师', data);
                    this.setState({teacherData: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        searcheTeacher: function () {
            var searcheData = $(this.refs.searcheData.getDOMNode()).find('input, select');
            this.loadTeacherData(
                searcheData[0].value,
                searcheData[1].value,
                parseInt(searcheData[2].value) || '',
                searcheData[2].value.replace(/\d+/g, '')
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
        addTeachers: function () {
            var i, selectLi = $(this.refs.selectLi.getDOMNode()).find('li.has-select'), l = selectLi.length, teacherId = [];
            for(i = 0; i < l; i ++){
                teacherId.push(selectLi[i].getAttribute('data-teacherid'));
            }
            $.ajax({
                type: 'post',
                url: this.props.url_add,
                data: {
                    courseId: this.props.courseId,
                    teacherId: teacherId,
                    startYear: this.props.startYear,
                    schoolTerm: this.props.schoolTerm
                },
                dataType: 'json',
                success: function(data) {
                    console.log('添加课程', data);
                    // 刷新课程授课教师列表
                    this.props.refreshTeacherData();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({teacherData: []}); // 切换学期时清空上一次的搜索结果
        },
        render: function () {
            var that=this, display = {display: 'none'}, teacherNode = [];
            this.state.teacherData.map(function (teacher, index) {
               teacherNode.push(
                    React.createElement("li", {className: "dialog-take-stu search-result-btn", "data-teacherid": teacher.teacherId, onClick: that.toggleSelectCourse}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, teacher.name), 
                            React.createElement("p", null, teacher.teacherNo)
                        )
                    )
                );
                teacherNode.push(
                    React.createElement("div", {className: "dialog-take-stu-detail"}, 
                        React.createElement("p", null, teacher.campusName, "校区", teacher.collegeName), 
                        React.createElement("p", null, teacher.name), 
                        React.createElement("p", null, teacher.sex), 
                        React.createElement("p", null, teacher.teacherNo), 
                        React.createElement("p", null, teacher.email)
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
                        React.createElement("ul", {className: "flex-style", ref: "selectLi"}, 
                        teacherNode
                        )
                    ), 
                    React.createElement("div", {className: "dialog-btn delete-btn"}, 
                        React.createElement("button", {className: "delete-btn-clear", onClick: this.addTeachers}, "添加教师")
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
                ctId: ''
            }
        },
        loadCourseStudentData: function (ctId) {
            $.ajax({
                url: this.props.url,
                data: {ctId: ctId},
                dataType: 'json',
                success: function(data) {
                    console.log('课程学生列表', data);
                    this.setState({studentList: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        courseStudentList: function () {
            this.loadCourseStudentData(this.props.ctId);
        },
        deleteStudent: function (e) {
            $(e.currentTarget).find('.dialog-sure-delete').addClass('t-dialog-sure-delete-show');
        },
        sureDeleteStudent: function (e) {
            console.log('删除课程');
            var $cur = $(e.target), csId = $cur.attr('data-csid'), index = parseInt($cur.attr('data-index'));
            $.ajax({
                type: 'post',
                url: this.props.url_delete,
                data: {csId: csId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除成功', data);
                    var studentList = this.state.studentList;
                    studentList.splice(index, 1);
                    this.setState({studentList: studentList});
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
        componentWillReceiveProps: function (nextProps) {
            this.setState({ctId: nextProps.ctId});
            this.loadCourseStudentData(nextProps.ctId);
        },
        componentWillMount: function () {
            this.setState({ctId: this.props.ctId});
            this.loadCourseStudentData(this.props.ctId);
        },
        render: function () {
            var that=this, display = {display: 'none'}, studentNode = [];
            this.state.studentList.forEach(function (student, index) {
               studentNode.push(
                    React.createElement("li", {className: "dialog-take-stu", onClick: that.deleteStudent}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, student.studentName), 
                            React.createElement("p", null, student.studentNo)
                        ), 
                        React.createElement("div", {className: "dialog-sure-delete t-dialog-sure-delete"}, 
                            React.createElement("div", {className: "dialog-sure-btn"}, 
                                React.createElement("span", {onClick: that.sureDeleteStudent, "data-index": index, "data-csid": student.csId}, "确认删除"), 
                                React.createElement("span", {onClick: that.onClear}, "取消")
                            )
                        )
                    )
                );
                studentNode.push(
                    React.createElement("div", {className: "dialog-take-stu-detail"}, 
                        React.createElement("p", null, student.campusName, "校区", student.collegeName), 
                        React.createElement("p", null, student.majorName + student.grade + '级' + student.cla + '班'), 
                        React.createElement("p", null, student.studentName), 
                        React.createElement("p", null, student.studentNo), 
                        React.createElement("p", null, student.sex)
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
                    React.createElement(SearcheStudent, {
                        ctId: this.props.ctId, 
                        url_search: this.props.url_search, 
                        url_add: this.props.url_add, 
                        refreshStudentData: this.courseStudentList}
                    )
                )
            );
        }
    });

    // 搜索学生组件
    var SearcheStudent = React.createClass({displayName: "SearcheStudent",
        getInitialState: function () {
            return {studentData: [], campusId: 1, display: {display: ''}};
        },
        setSelectCampus: function (e) {
            this.setState({campusId: e.target.value});
        },
        searchStudentData: function (campusId, collegeId, studentNo, studentName) {
            $.ajax({
                url: this.props.url_search,
                data: {campusId: campusId, collegeId: collegeId, studentNo: studentNo, name: studentName},
                dataType: 'json',
                success: function(data) {
                    console.log('学生列表', data);
                    this.setState({studentData: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        searchStudent: function () {
            var searchData = $(this.refs.searchData.getDOMNode()).find('input, select');
            this.searchStudentData(
                searchData[0].value,
                searchData[1].value,
                parseInt(searchData[2].value) || '',
                searchData[2].value.replace(/\d+/g, '')
            );
        },
        toggleSelectStudent: function (e) {
            var $cur = $(e.currentTarget);
            if($cur.hasClass('has-select')){
                $cur.removeClass('has-select');
            }
            else{
                $cur.addClass('has-select');
            }
        },
        addStudents: function () {
            var i, selectLi = $(this.refs.selectLi.getDOMNode()).find('li.has-select'), l = selectLi.length, sId = [];
            for(i = 0; i < l; i ++){
                sId.push(selectLi[i].getAttribute('data-sid'));
            }
            $.ajax({
                type: 'post',
                url: this.props.url_add,
                data: {ctId: this.props.ctId, sId: sId},
                dataType: 'json',
                success: function(data) {
                    console.log('添加课程', data);
                    // 刷新学生课程列表
                    this.props.refreshStudentData();
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({studentData: [], display: {display: 'none'}}); // 切换学期时清空上一次的搜索结果
        },
        render: function () {
            var that=this, studentNode = [];
            this.state.studentData.forEach(function (student, index) {
                studentNode.push(
                    React.createElement("li", {className: "dialog-take-stu search-result-btn", "data-sid": student.id, onClick: that.toggleSelectStudent}, 
                        React.createElement("div", null, 
                            React.createElement("p", null, student.name), 
                            React.createElement("p", null, student.studentNo)
                        )
                    )
                );
                studentNode.push(
                    React.createElement("div", {className: "dialog-take-stu-detail"}, 
                        React.createElement("p", null, student.hwCampus.name + '校区' + student.hwCollege.collegeName + student.grade + '级'), 
                        React.createElement("p", null, student.hwMajor.name + student.class_ + '班'), 
                        React.createElement("p", null, student.name), 
                        React.createElement("p", null, student.studentNo), 
                        React.createElement("p", null, student.sex), 
                        React.createElement("p", null, student.email)
                    )
                );
            });
            return (
                React.createElement("div", {className: "add-stu-op", style: this.state.display}, 
                    React.createElement("div", {className: "add-stu-search box-style", ref: "searchData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(StudentNoName, {className: "course-no"}), 
                        React.createElement("div", {className: "add-stu-search-btn"}, 
                            React.createElement("button", {onClick: this.searchStudent}, "搜索学生")
                        )
                    ), 
                    React.createElement("div", {className: "add-stu-search-ul"}, 
                        React.createElement("ul", {className: "flex-style", ref: "selectLi"}, 
                        studentNode
                        )
                    ), 
                    React.createElement("div", {className: "dialog-btn delete-btn"}, 
                        React.createElement("button", {className: "delete-btn-clear", onClick: this.addStudents}, "添加学生")
                    )
                )
                );
        }
    });

    // 学生管理->学生选课
    var StudentManageTakeCourseDialog = React.createClass({displayName: "StudentManageTakeCourseDialog",
        getInitialState: function () {
            return {
                courseList: [],
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
            this.loadTermCourseData(this.props.studentId, select[0].value, select[1].value);
        },
        deleteCourse: function (e) {
            $(e.currentTarget).find('.dialog-sure-delete').addClass('t-dialog-sure-delete-show');
        },
        sureDeleteCourse: function (e) {
            console.log('删除课程');
            var $cur = $(e.target), csId = $cur.attr('data-csid'), index = parseInt($cur.attr('data-index'));
            $.ajax({
                type: 'post',
                url: this.props.url_delete,
                data: {csId: csId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除成功', data);
                    var courseList = this.state.courseList;
                    courseList.splice(index, 1);
                    this.setState({courseList: courseList});
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
            this.loadTermCourseData(nextProps.studentId, this.state.startYear, this.state.schoolTerm);
        },
        componentWillMount: function () {
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
                                React.createElement("span", {onClick: that.sureDeleteCourse, "data-index": index, "data-csid": course.csId}, "确认删除"), 
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
                        studentId: this.props.studentId, 
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
        studentManageAddCourses: function () {
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
        teacherManageAddCourses: function () {
            var i, selectLi = $(this.refs.selectLi.getDOMNode()).find('li.has-select'), l = selectLi.length, cids = [];
            for(i = 0; i < l; i ++){
                cids.push(selectLi[i].getAttribute('data-courseid'));
            }
            $.ajax({
                type: 'post',
                url: this.props.url_add,
                data: {tid: this.props.teacherId, cids: cids, startYear: this.props.startYear, schoolTerm: this.props.schoolTerm},
                dataType: 'json',
                success: function(data) {
                    console.log('添加课程', data);
                    // 刷新教师课程列表
                    this.props.refreshCourseData(this.props.teacherId, this.props.startYear, this.props.schoolTerm);
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
            var that=this, display = {display: 'none'}, courseNode = [],
                onClick = this.props.type == 'teacher' ? this.teacherManageAddCourses : this.studentManageAddCourses;
            this.state.courseData.forEach(function (course, index) {
                courseNode.push(
                    React.createElement("li", {className: "dialog-take-stu search-result-btn", "data-ctid": course.ctId, "data-courseid": course.courseId, onClick: that.toggleSelectCourse}, 
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
                        React.createElement("button", {className: "delete-btn-clear", onClick: onClick}, "添加课程")
                    )
                )
                );
        }
    });

    // 教师管理->教师选课
    var TeacherManageGiveCourseDialog = React.createClass({displayName: "TeacherManageGiveCourseDialog",
        getInitialState: function () {
            return {
                courseList: [],
                startYear: 2011,
                schoolTerm: 1
            }
        },
        loadTermCourseData: function (teacherId, startYear, schoolTerm) {
            $.ajax({
                url: this.props.url,
                data: {tid: teacherId, startYear: startYear, schoolTerm: schoolTerm},
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
            this.loadTermCourseData(this.props.teacherId, select[0].value, select[1].value);
        },
        deleteCourse: function (e) {
            $(e.currentTarget).find('.dialog-sure-delete').addClass('t-dialog-sure-delete-show');
        },
        sureDeleteCourse: function (e) {
            console.log('删除课程');
            var $cur = $(e.target), ctId = $cur.attr('data-ctid'), index = parseInt($cur.attr('data-index'));
            $.ajax({
                type: 'post',
                url: this.props.url_delete,
                data: {ctId: ctId},
                dataType: 'json',
                success: function(data) {
                    console.log('删除成功', data);
                    var courseList = this.state.courseList;
                    courseList.splice(index, 1);
                    this.setState({courseList: courseList});
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
            this.loadTermCourseData(nextProps.teacherId, this.state.startYear, this.state.schoolTerm);
        },
        componentWillMount: function () {
            this.loadTermCourseData(this.props.teacherId, this.state.startYear, this.state.schoolTerm);
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
                                React.createElement("span", {onClick: that.sureDeleteCourse, "data-index": index, "data-ctid": course.ctId}, "确认删除"), 
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
                        teacherId: this.props.teacherId, 
                        refreshCourseData: this.loadTermCourseData, 
                        type: "teacher"}
                    )
                )
                );
        }
    });

    module.exports = {
        Dialog: Dialog
    }

});

