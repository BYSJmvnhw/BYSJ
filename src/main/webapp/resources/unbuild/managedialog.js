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
                case 'UpdateCourseDialogBody':
                    return <UpdateCourseDialogBody
                        url_detial={this.props.url_detial}
                        url={this.props.url}
                        courseId={this.props.courseId}
                        updateCourseTr={this.props.updateCourseTr}
                        onClose={this.closeDialog}
                    />;
                case 'GiveCourseManageBody':
                    return <GiveCourseManageBody
                        url={this.props.url}
                        courseId={this.props.courseId}
                        onClose={this.closeDialog}
                    />;
                case  'TakeOpStudentDialogBody':
                    return <TakeOpStudentDialogBody
                        url={this.props.url}
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

    // 授课管理组件
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
                    <li className="dialog-take-stu">
                        <div>
                            <p>{teacher.name}</p>
                            <p>{teacher.teacherNo}</p>
                        </div>
                        <div className="dialog-take-stu-detail">
                            <p>{teacher.campusName}校区</p>
                            <p>{teacher.collegeName}</p>
                            <p>{teacher.majorName}</p>
                            <p>{teacher.teacherNo}</p>
                            <p>{teacher.name}</p>
                            <p>{teacher.sex}</p>
                        </div>
                    </li>
                );
            });
            return (
                <div className="dialog-body">
                    <div className="add-stu-search box-style" ref="termTeacherList">
                        <SelectTermYear classNAme="add-stu-college"/>
                        <SelectTerm classNAme="add-stu-college"/>
                        <div className="add-stu-search-btn">
                            <button onClick={this.termTeacherList}>查看该学期教师列表</button>
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
                    <SearcheTeacher />
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
        render: function () {
            var display = {display: 'none'},
                teacherNode = this.state.teacherData.map(function (teacher,index) {
                return (
                    <li className="dialog-take-stu search-result-btn">
                        <div>
                            <p>陈键钊</p>
                            <p>20112100182</p>
                        </div>
                        <div className="dialog-take-stu-detail">
                            <p>石牌校区</p>
                            <p>计算机学院2011级</p>
                            <p>网络工程6班</p>
                            <p>20112100182</p>
                            <p>陈键钊</p>
                            <p>男</p>
                        </div>
                    </li>
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
                        <ul className="flex-style">
                        {teacherNode}
                        </ul>
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
                        <li className="dialog-take-stu">
                            <div>
                                <p>{teacher.name}</p>
                                <p>{teacher.teacherNo}</p>
                            </div>
                            <div className="dialog-take-stu-detail">
                                <p>{teacher.campusName}校区</p>
                                <p>{teacher.collegeName}</p>
                                <p>{teacher.majorName}</p>
                                <p>{teacher.teacherNo}</p>
                                <p>{teacher.name}</p>
                                <p>{teacher.sex}</p>
                            </div>
                        </li>
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
                    <SearcheStudent />
                </div>
                );
        }
    });

    // 搜索学生组件
    var SearcheStudent = React.createClass({
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
                        <li className="dialog-take-stu search-result-btn">
                            <div>
                                <p>陈键钊</p>
                                <p>20112100182</p>
                            </div>
                            <div className="dialog-take-stu-detail">
                                <p>石牌校区</p>
                                <p>计算机学院2011级</p>
                                <p>网络工程6班</p>
                                <p>20112100182</p>
                                <p>陈键钊</p>
                                <p>男</p>
                            </div>
                        </li>
                        );
                });
            return (
                <div className="add-stu-op" style={display}>
                    <div className="add-stu-search box-style" ref="searcheData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <StudentNoName className="course-no" />
                        <div className="add-stu-search-btn">
                            <button onClick={this.searcheStudent}>搜索学生</button>
                        </div>
                    </div>
                    <div className="add-stu-search-ul">
                        <ul className="flex-style">
                        {studentNode}
                        </ul>
                    </div>
                </div>
            );
        }
    });



    module.exports = {
        Dialog: Dialog
    }

});

