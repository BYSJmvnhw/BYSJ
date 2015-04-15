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
    var Dialog = React.createClass({
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
                    return <AddCourseDialogBody
                        url={this.props.url}
                        refreshCourseData={this.props.refreshCourseData}
                        onClose={this.closeDialog}
                    />;
                case 'AddTeacherDialogBody':
                    return <AddTeacherDialogBody
                        url={this.props.url}
                        refreshTeacherData={this.props.refreshTeacherData}
                        onClose={this.closeDialog}
                    />;
                case 'AddStudentDialogBody':
                    return <AddStudentDialogBody
                        url={this.props.url}
                        refreshStudentData={this.props.refreshStudentData}
                        onClose={this.closeDialog}
                    />;
                case 'DeleteCourseDialogBody':
                    return <DeleteCourseDialogBody
                        url={this.props.url}
                        courseId={this.props.courseId}
                        removeCourseTr={this.props.removeCourseTr}
                        onClose={this.closeDialog}
                    />;
                case 'DeleteTeacherDialogBody':
                    return <DeleteTeacherDialogBody
                        url={this.props.url}
                        teacherId={this.props.teacherId}
                        removeTeacherTr={this.props.removeTeacherTr}
                        onClose={this.closeDialog}
                    />;
                case 'DeleteStudentDialogBody':
                    return <DeleteStudentDialogBody
                    url={this.props.url}
                    studentId={this.props.studentId}
                    removeStudentTr={this.props.removeStudentTr}
                    onClose={this.closeDialog}
                    />;
                case 'UpdateCourseDialogBody':
                    return <UpdateCourseDialogBody
                        url_detail={this.props.url_detail}
                        url={this.props.url}
                        courseId={this.props.courseId}
                        updateCourseTr={this.props.updateCourseTr}
                        onClose={this.closeDialog}
                    />;
                case 'UpdateStudentDialogBody':
                    return <UpdateStudentDialogBody
                        url_detail={this.props.url_detail}
                        url={this.props.url}
                        studentId={this.props.studentId}
                        updateStudentTr={this.props.updateStudentTr}
                        onClose={this.closeDialog}
                    />;
                case 'UpdateTeacherDialogBody':
                    return <UpdateTeacherDialogBody
                        url_detail={this.props.url_detail}
                        url={this.props.url}
                        teacherId={this.props.teacherId}
                        updateTeacherTr={this.props.updateTeacherTr}
                        onClose={this.closeDialog}
                    />;
                case 'UpdateUserDialogBody':
                    return <UpdateUserDialogBody
                        url={this.props.url}
                        userId={this.props.userId}
                        onClose={this.closeDialog}
                    />;
                case 'GiveCourseManageBody':
                    return <GiveCourseManageBody
                        url={this.props.url}
                        url_add={this.props.url_add}
                        url_search={this.props.url_search}
                        courseId={this.props.courseId}
                        onClose={this.closeDialog}
                    />;
                case  'TakeOpStudentDialogBody':
                    return <TakeOpStudentDialogBody
                        url={this.props.url}
                        url_add={this.props.url_add}
                        url_delete={this.props.url_delete}
                        url_search={this.props.url_search}
                        ctId={this.props.ctId}
                        onClose={this.closeDialog}
                    />;
                case 'StudentManageTakeCourseDialog':
                    return <StudentManageTakeCourseDialog
                        url={this.props.url}
                        url_add={this.props.url_add}
                        url_delete={this.props.url_delete}
                        url_search={this.props.url_search}
                        studentId={this.props.studentId}
                        onClose={this.closeDialog}
                    />;
                default : return 'none-dialog';
            }
        },
        render: function () {
            var body = this.getDialogBody(this.props.body),
                display = {display: this.state.display};
            return (
                <div className="dialog-shade" ref="dialogDiv" style={display}>
                    <div className={this.props.contentClassName + " dialog-content"}>
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

    var DeleteDialogBody = React.createClass({
        render: function () {
            return (
                <div className="dialog-body">
                    <div className="delete-tip">
                        <p>确定删除吗？删除后不可修复！</p>
                    </div>
                    <div className="dialog-btn delete-btn">
                        <button className="delete-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="delete-btn-sure" onClick={this.props.delete}>删除</button>
                    </div>
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
                    this.props.removeCourseTr(); // 删除课程trDOM
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        render: function () {
            return (<DeleteDialogBody delete={this.deleteCourse} onClose={this.props.onClose}/>);
        }
    });

    // 教师管理 删除教师提示组件
    var DeleteTeacherDialogBody = React.createClass({
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
            return (<DeleteDialogBody delete={this.deleteTeacher} onClose={this.props.onClose}/>);
        }
    });

    // 学生管理 删除学生提示组件
    var DeleteStudentDialogBody = React.createClass({
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
            return (<DeleteDialogBody delete={this.deleteStudent} onClose={this.props.onClose}/>);
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

    // 增加教师组件
    var AddTeacherDialogBody = React.createClass({
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
                <div className="dialog-body" ref="dialogBody">
                    <SelectCampus className="add-cs-campus" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="add-cs-college" campusId={this.state.campusId} setSelectCollege={this.setSelectCollege} />
                    <InputText className="add-cs-coursename" labelName='教师号' placeholderText='输入教师号' />
                    <InputText className="add-cs-coursename" labelName='教师名' placeholderText='输入教师名' />
                    <SelectSex className="add-cs-college" />
                    <InputText className="add-cs-coursename" labelName='手机号' placeholderText='输入手机号' />
                    <InputText className="add-cs-coursename" labelName='邮箱' placeholderText='输入教师邮箱' />
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.addTeacher}>添加</button>
                    </div>
                </div>
            );
        }
    });

    // 增加学生组件
    var AddStudentDialogBody = React.createClass({
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
                <div className="dialog-body" ref="dialogBody">
                    <SelectCampus className="add-cs-campus" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="add-cs-college" campusId={this.state.campusId} setSelectCollege={this.setSelectCollege} />
                    <SelectMajor className="add-cs-college" collegeId={this.state.collegeId} />
                    <InputText className="add-cs-coursename" labelName='学号' placeholderText='输入学号' />
                    <InputText className="add-cs-coursename" labelName='学生名' placeholderText='输入学生名' />
                    <SelectSex className="add-cs-college" />
                    <StudentGrade className="add-cs-coursename" />
                    <InputText className="add-cs-coursename" labelName='班级' placeholderText='输入班级' />
                    <InputText className="add-cs-coursename" labelName='邮箱' placeholderText='输入学生邮箱' />
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.addStudent}>添加</button>
                    </div>
                </div>
            );
        }
    });

    // 更新课程组件
    var UpdateCourseDialogBody = React.createClass({
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
                <div className="dialog-body" ref="dialogBody">
                    <SelectCampus className="add-cs-campus" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="add-cs-college" campusId={this.state.campusId} setSelectCollege={this.setSelectCollege} />
                    <SelectMajor className="add-cs-college" collegeId={this.state.collegeId} />
                    <CourseNo className="add-cs-courseno" readonly='readonly'value={this.state.courseNo}/>
                    <CourseName className="add-cs-coursename" value={this.state.courseName}/>
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.updateCourse}>修改</button>
                    </div>
                </div>
            );
        }
    });

    // 更新学生信息组件
    var UpdateStudentDialogBody = React.createClass({
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
                <div className="dialog-body" ref="dialogBody">
                    <SelectCampus className="add-cs-campus" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="add-cs-college" campusId={this.state.studentData.campusId} setSelectCollege={this.setSelectCollege} />
                    <SelectMajor className="add-cs-college" collegeId={this.state.studentData.collegeId} />
                    <InputText className="add-cs-coursename" labelName='学号' placeholderText='输入学号' value={this.state.studentData.studentNo}/>
                    <InputText className="add-cs-coursename" labelName='学生名' placeholderText='输入学生名' value={this.state.studentData.studentName}/>
                    <SelectSex className="add-cs-college" />
                    <StudentGrade className="add-cs-coursename" />
                    <InputText className="add-cs-coursename" labelName='班级' placeholderText='输入班级' value={this.state.studentData.cla} />
                    <InputText className="add-cs-coursename" labelName='邮箱' placeholderText='输入学生邮箱' value={this.state.studentData.email} />
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.updateStudent}>修改</button>
                    </div>
                </div>
                );
        }
    });

    // 更新教师信息组件
    var UpdateTeacherDialogBody = React.createClass({
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
                    teacherNo: TeacherDatas[2].value,
                    trueName: TeacherDatas[3].value,
                    sex: TeacherDatas[4].value,
                    mobile: TeacherDatas[5].value,
                    email: TeacherDatas[6].value
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
                <div className="dialog-body" ref="dialogBody">
                    <SelectCampus className="add-cs-campus" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="add-cs-college" campusId={this.state.teacherData.campusId} setSelectCollege={this.setSelectCollege} />
                    <InputText className="add-cs-coursename" labelName='教师号' placeholderText='输入教师号' value={this.state.teacherData.teacherNo}/>
                    <InputText className="add-cs-coursename" labelName='教师名' placeholderText='输入教师名' value={this.state.teacherData.trueName}/>
                    <SelectSex className="add-cs-college" />
                    <InputText className="add-cs-coursename" labelName='手机号' placeholderText='输入手机号' value={this.state.teacherData.mobile}/>
                    <InputText className="add-cs-coursename" labelName='邮箱' placeholderText='输入教师邮箱' value={this.state.teacherData.email}/>
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.updateTeacher}>修改</button>
                    </div>
                </div>
                );
        }
    });

    // 更新用户密码
    var UpdateUserDialogBody = React.createClass({
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
                <div className="dialog-body" ref="dialogBody">
                    <InputText className="add-cs-coursename" type='password' labelName='管理员密码' placeholderText='输入当前管理员面膜' />
                    <InputText className="add-cs-coursename" type='password' labelName='新密码' placeholderText='输入用户的新密码' />
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.updateUser}>修改</button>
                    </div>
                </div>
            );
        }
    });

    // 课程管理->授课管理组件
    var GiveCourseManageBody = React.createClass({
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
            var display = {display: 'none'}, teacherNode = [];
            this.state.teacherList.map(function (teacher, index) {
                teacherNode.push(
                    <li className="dialog-take-stu">
                        <div>
                            <p>{teacher.name}</p>
                            <p>{teacher.teacherNo}</p>
                        </div>
                    </li>
                );
                teacherNode.push(
                    <div className="dialog-take-stu-detail">
                        <p>{teacher.campusName}校区</p>
                        <p>{teacher.collegeName}</p>
                        <p>{teacher.majorName}</p>
                        <p>{teacher.teacherNo}</p>
                        <p>{teacher.name}</p>
                        <p>{teacher.sex}</p>
                    </div>
                );
            });
            return (
                <div className="dialog-body">
                    <div className="add-stu-search box-style" ref="termTeacherList">
                        <SelectTermYear classNAme="add-stu-college"/>
                        <SelectTerm classNAme="add-stu-college"/>
                        <div className="add-stu-search-btn">
                            <button onClick={this.termTeacherList}>授课教师列表</button>
                        </div>
                    </div>
                    <div className="dialog-take-ul">
                        <ul className="flex-style">
                        {teacherNode}
                        </ul>
                    </div>
                    <div className="dialog-btn add-stu-btn">
                        <span onClick={this.fold} style={display}>收起</span>
                        <button className="add-stu-btn-add" onClick={this.unfold}>添加教师</button>
                    </div>
                    <SearcheTeacher
                        courseId={this.state.courseId}
                        startYear={this.state.startYear}
                        schoolTerm={this.state.schoolTerm}
                        url_add={this.props.url_add}
                        url_search={this.props.url_search}
                        refreshTeacherData={this.termTeacherList}
                    />
                </div>
            );
        }
    });

    // 搜索教师组件
    var SearcheTeacher = React.createClass({
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
                    <li className="dialog-take-stu search-result-btn" data-teacherid={teacher.teacherId} onClick={that.toggleSelectCourse}>
                        <div>
                            <p>{teacher.name}</p>
                            <p>{teacher.teacherNo}</p>
                        </div>
                    </li>
                );
                teacherNode.push(
                    <div className="dialog-take-stu-detail">
                        <p>{teacher.campusName}校区{teacher.collegeName}</p>
                        <p>{teacher.name}</p>
                        <p>{teacher.sex}</p>
                        <p>{teacher.teacherNo}</p>
                        <p>{teacher.email}</p>
                    </div>
                );
            });
            return (
                <div className="add-stu-op" style={display}>
                    <div className="add-stu-search box-style" ref="searcheData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <TeacherNoName className="course-no" />
                        <div className="add-stu-search-btn">
                            <button onClick={this.searcheTeacher}>搜索教师</button>
                        </div>
                    </div>
                    <div className="add-stu-search-ul">
                        <ul className="flex-style" ref='selectLi'>
                        {teacherNode}
                        </ul>
                    </div>
                    <div className='dialog-btn delete-btn'>
                        <button className="delete-btn-clear" onClick={this.addTeachers}>添加教师</button>
                    </div>
                </div>
            );
        }
    });

    // 选课管理->增删学生
    var TakeOpStudentDialogBody = React.createClass({
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
                    <li className="dialog-take-stu" onClick={that.deleteStudent}>
                        <div>
                            <p>{student.studentName}</p>
                            <p>{student.studentNo}</p>
                        </div>
                        <div className="dialog-sure-delete t-dialog-sure-delete">
                            <div className="dialog-sure-btn">
                                <span onClick={that.sureDeleteStudent} data-index={index} data-csid={student.csId} >确认删除</span>
                                <span onClick={that.onClear}>取消</span>
                            </div>
                        </div>
                    </li>
                );
                studentNode.push(
                    <div className="dialog-take-stu-detail">
                        <p>{student.campusName}校区{student.collegeName}</p>
                        <p>{student.majorName + student.grade + '级' + student.cla + '班'}</p>
                        <p>{student.studentName}</p>
                        <p>{student.studentNo}</p>
                        <p>{student.sex}</p>
                    </div>
                );
            });
            return (
                <div className="dialog-body">
                    <div className="dialog-take-ul">
                        <ul className="flex-style">
                        {studentNode}
                        </ul>
                    </div>
                    <div className="dialog-btn add-stu-btn">
                        <span onClick={this.fold} style={display}>收起</span>
                        <button className="add-stu-btn-add" onClick={this.unfold}>添加学生</button>
                    </div>
                    <SearcheStudent
                        ctId={this.props.ctId}
                        url_search={this.props.url_search}
                        url_add={this.props.url_add}
                        refreshStudentData={this.courseStudentList}
                    />
                </div>
            );
        }
    });

    // 搜索学生组件
    var SearcheStudent = React.createClass({
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
                    <li className="dialog-take-stu search-result-btn" data-sid={student.id} onClick={that.toggleSelectStudent}>
                        <div>
                            <p>{student.name}</p>
                            <p>{student.studentNo}</p>
                        </div>
                    </li>
                );
                studentNode.push(
                    <div className="dialog-take-stu-detail">
                        <p>{student.hwCampus.name + '校区' + student.hwCollege.collegeName + student.grade + '级'}</p>
                        <p>{student.hwMajor.name + student.class_ + '班'}</p>
                        <p>{student.name}</p>
                        <p>{student.studentNo}</p>
                        <p>{student.sex}</p>
                        <p>{student.email}</p>
                    </div>
                );
            });
            return (
                <div className="add-stu-op" style={this.state.display}>
                    <div className="add-stu-search box-style" ref="searchData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <StudentNoName className="course-no" />
                        <div className="add-stu-search-btn">
                            <button onClick={this.searchStudent}>搜索学生</button>
                        </div>
                    </div>
                    <div className="add-stu-search-ul">
                        <ul className="flex-style" ref="selectLi">
                        {studentNode}
                        </ul>
                    </div>
                    <div className='dialog-btn delete-btn'>
                        <button className="delete-btn-clear" onClick={this.addStudents}>添加学生</button>
                    </div>
                </div>
                );
        }
    });

    // 学生管理->学生选课
    var StudentManageTakeCourseDialog = React.createClass({
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
                    <li className="dialog-take-stu" onClick={that.deleteCourse}>
                        <div>
                            <p>{course.majorName}</p>
                            <p>{course.courseName}</p>
                        </div>
                        <div className="dialog-sure-delete t-dialog-sure-delete">
                            <div className="dialog-sure-btn">
                                <span onClick={that.sureDeleteCourse} data-index={index} data-csid={course.csId} >确认删除</span>
                                <span onClick={that.onClear}>取消</span>
                            </div>
                        </div>
                    </li>
                );
                courseNode.push(
                    <div className="dialog-take-stu-detail">
                        <p>{course.campusName}校区{course.collegeName}</p>
                        <p>{course.majorName}</p>
                        <p>{course.courseName}</p>
                    </div>
                );
            });
            return (
                <div className="dialog-body">
                    <div className="add-stu-search box-style" ref="termCourseList">
                        <SelectTermYear classNAme="add-stu-college" setSelectTermYear={this.setSelectTermYear}/>
                        <SelectTerm classNAme="add-stu-college" setSelectTerm={this.setSelectTerm}/>
                        <div className="add-stu-search-btn">
                            <button onClick={this.termCourseList}>查看学生该学期课程列表</button>
                        </div>
                    </div>
                    <div className="dialog-take-ul">
                        <ul className="flex-style">
                        {courseNode}
                        </ul>
                    </div>
                    <div className="dialog-btn add-stu-btn">
                        <span onClick={this.fold} style={display}>收起</span>
                        <button className="add-stu-btn-add" onClick={this.unfold}>添加课程</button>
                    </div>
                    <SearcheCourse
                        startYear={this.state.startYear}
                        schoolTerm={this.state.schoolTerm}
                        url_search={this.props.url_search}
                        url_add={this.props.url_add}
                        studentId={this.props.studentId}
                        refreshCourseData={this.loadTermCourseData}
                    />
                </div>
            );
        }
    });

    // 搜索课程组件
    var SearcheCourse = React.createClass({
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
                    <li className="dialog-take-stu search-result-btn" data-ctid={course.ctId} onClick={that.toggleSelectCourse}>
                        <div>
                            <p>{course.majorName}</p>
                            <p>{course.courseName}</p>
                            <p>{course.teacherName}</p>
                        </div>
                    </li>
                );
                courseNode.push(
                    <div className="dialog-take-stu-detail">
                        <p>{course.campusName}校区{course.collegeName}</p>
                        <p>{course.majorName}</p>
                        <p>{course.courseName}</p>
                        <p>{course.startYear + '~' + (parseInt(course.startYear)+1) + '学年第' + course.schoolTerm + '学期'}</p>
                        <p>{course.teacherName}</p>
                    </div>
                );
            });
            return (
                <div className="add-stu-op" style={display}>
                    <div className="add-stu-search flex-style" ref="searcheData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <InputText className="course-no" labelName='课程名' placeholderText='请输入课程名' />
                        <div className="add-stu-search-btn">
                            <button onClick={this.searchCourse}>搜索课程</button>
                        </div>
                    </div>
                    <div className="add-stu-search-ul">
                        <ul className="flex-style" ref="selectLi">
                        {courseNode}
                        </ul>
                    </div>
                    <div className='dialog-btn delete-btn'>
                        <button className="delete-btn-clear" onClick={this.addcourses}>添加课程</button>
                    </div>
                </div>
                );
        }
    });

    // 教师管理->教师选课
    var teacherManageGiveCourseDialog = React.createClass({
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
                    <li className="dialog-take-stu" onClick={that.deleteCourse}>
                        <div>
                            <p>{course.majorName}</p>
                            <p>{course.courseName}</p>
                        </div>
                        <div className="dialog-sure-delete t-dialog-sure-delete">
                            <div className="dialog-sure-btn">
                                <span onClick={that.sureDeleteCourse} data-index={index} data-csid={course.csId} >确认删除</span>
                                <span onClick={that.onClear}>取消</span>
                            </div>
                        </div>
                    </li>
                );
                courseNode.push(
                    <div className="dialog-take-stu-detail">
                        <p>{course.campusName}校区{course.collegeName}</p>
                        <p>{course.majorName}</p>
                        <p>{course.courseName}</p>
                    </div>
                );
            });
            return (
                <div className="dialog-body">
                    <div className="add-stu-search box-style" ref="termCourseList">
                        <SelectTermYear classNAme="add-stu-college" setSelectTermYear={this.setSelectTermYear}/>
                        <SelectTerm classNAme="add-stu-college" setSelectTerm={this.setSelectTerm}/>
                        <div className="add-stu-search-btn">
                            <button onClick={this.termCourseList}>查看学生该学期课程列表</button>
                        </div>
                    </div>
                    <div className="dialog-take-ul">
                        <ul className="flex-style">
                        {courseNode}
                        </ul>
                    </div>
                    <div className="dialog-btn add-stu-btn">
                        <span onClick={this.fold} style={display}>收起</span>
                        <button className="add-stu-btn-add" onClick={this.unfold}>添加课程</button>
                    </div>
                    <SearcheCourse
                    startYear={this.state.startYear}
                    schoolTerm={this.state.schoolTerm}
                    url_search={this.props.url_search}
                    url_add={this.props.url_add}
                    studentId={this.props.studentId}
                    refreshCourseData={this.loadTermCourseData}
                    />
                </div>
                );
        }
    });

    // 教师管理->教师选课
    var TeacherManageGiveCourseDialog = React.createClass({
        render: function () {
            return (<div>擦</div>);
        }
    });




    module.exports = {
        Dialog: Dialog
    }

});

