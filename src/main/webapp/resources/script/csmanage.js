/**
 * Created by 郑权才 on 15-4-13.
 */

define(function (require, exports, module) {

    var React = require('React');
    var manageDialog = require('managedialog');
    var cellComponent = require('cellcomponent');
    var _ = require('underscore'); // 框架依赖模块
    var $ = require('jquery');

    var serverpath = 'http://localhost:8080/mvnhk/',
        dialog_el = document.getElementById('dialog-wrap'),
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
        StudentGrade = cellComponent.StudentGrade,
        Dialog = manageDialog.Dialog;

    // 课程管理组件
    var CsManage = React.createClass({displayName: "CsManage",
        getInitialState: function () {
            return {
                data: [],
                campusId: "1"
            };
        },
        giveCourseManage: function (e) {
            console.log('授课管理');
            var courseId = $(e.target).parent().attr('data-courseId');
            // contentClassName 弹框特征样式类
            React.render(
                React.createElement(Dialog, {title: "授课管理", 
                    body: "GiveCourseManageBody", 
                    courseId: courseId, 
                    contentClassName: "dialog-content-take", 
                    url: serverpath + 'course/teacherList'}
                ),
                dialog_el
            );
        },
        addCourse: function () {
            console.log('新增课程');
            React.render(
                React.createElement(Dialog, {title: "新增课程", 
                    body: "AddCourseDialogBody", 
                    url: serverpath + "course/addCourse", 
                    refreshCourseData: this.loadCourseData, 
                    display: "block"}
                ),
                dialog_el);
        },
        updateCourse: function (e) {
            console.log('修改课程');
            var $courseBTn = $(e.target).parent(),
                courseId = $courseBTn.attr('data-courseId'),
                updateCourseTr = function () {
                    this.searchCourse();
                };
            React.render(
                React.createElement(Dialog, {title: "修改课程", 
                    body: "UpdateCourseDialogBody", 
                    url: serverpath + 'course/updateCourse', 
                    url_detial: serverpath + 'course/courseDetail', 
                    updateCourseTr: updateCourseTr, 
                    courseId: courseId}
                ),
            dialog_el);
        },
        deleteCourse: function (e) {
            console.log('删除课程');
            var $courseBTn = $(e.target).parent(),
                courseId = $courseBTn.attr('data-courseId'),
                removeCourseTr = function () {$courseBTn.parent().remove()};
            React.render(
                React.createElement(Dialog, {title: "删除课程", 
                    body: "DeleteCourseDialogBody", 
                    url: serverpath + "course/deleteCourse", 
                    removeCourseTr: removeCourseTr, 
                    courseId: courseId, display: "block"}),
                dialog_el
            );
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
                            React.createElement("button", {className: "cs-manage-give", onClick: that.giveCourseManage}, "授课管理"), 
                            React.createElement("button", {className: "cs-manage-change", onClick: that.updateCourse}, "修改"), 
                            React.createElement("button", {className: "cs-manage-delete", onClick: that.deleteCourse}, "删除")
                        )
                    )
                    );
            });
            return (
                React.createElement("div", {className: "cs-manage"}, 
                    React.createElement("div", {className: "cs-manage-search box-style", ref: "searchData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
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

    module.exports = {
        CsManage : CsManage
    }

});

