/**
 * Created by 郑权才 on 15-4-13.
 */

/**
 * Created by zqc on 2015/4/10.
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
                        React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
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

    module.exports = {
        TakeManage: TakeManage
    }

});

