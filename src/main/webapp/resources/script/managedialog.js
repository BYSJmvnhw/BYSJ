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

    // 选课管理->增加学生
    var TakeAddStudentDialogBody = React.createClass({displayName: "TakeAddStudentDialogBody",
        render: function () {
            return (React.createElement("div", null));
        }
    });

    module.exports = {
        Dialog: Dialog
    }

});

