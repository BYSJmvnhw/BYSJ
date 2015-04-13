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
                default : return 'none-dialog';
            }
        },
        render: function () {
            var body = this.getDialogBody(this.props.body),
                display = {display: this.state.display};
            return (
                <div className="dialog-shade" ref="dialogDiv" style={display}>
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

    var UpdateCourseDialogBody = React.createClass({
        getInitialState: function () {
            return {
                campusId: "1",
                collegeId: "1",
                courseId: ''
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
                data: {campusId: courseId},
                dataType: 'json',
                success: function(data) {
                    console.log('获取课程详细信息', data);
                    this.setState({
                        campusId: data.campusId,
                        collegeId: data.collegeId
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
                    campusId: this.state.courseId,
                    collegeId: courseDatas[1].value,
                    majorId: courseDatas[2].value,
                    courseId: courseId[3].value,
                    courseName: courseDatas[4].value
                },
                dataType: 'json',
                success: function(data) {
                    console.log('更新课程', data);

                    courseDatas.value = '';
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({courseId: nextProps.courseId});
            this.getCourseData(nextProps.courseId);
        },
        render: function () {
            return (
                <div className="dialog-body" ref="dialogBody">
                    <SelectCampus className="add-cs-campus" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="add-cs-college" campusId={this.state.campusId} setSelectCollege={this.setSelectCollege} />
                    <SelectMajor className="add-cs-college" collegeId={this.state.collegeId} />
                    <CourseNo className="add-cs-courseno" readonly='readonly'/>
                    <CourseName className="add-cs-coursename" />
                    <div className="dialog-btn add-cs-btn">
                        <button className="add-cs-btn-clear" onClick={this.props.onClose}>取消</button>
                        <button className="add-cs-btn-sure" onClick={this.updateCourse}>修改</button>
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

    module.exports = {
        Dialog: Dialog
    }

});

