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
            parseInt(searchdata[3].value) || '',
            searchdata[3].value.replace(/\d+/g, '')
        );
    },
    keyDownSearchStudent: function (e) {
        (e.keyCode || e.which) == 13 && this.searchStudent();
    },
    studentTake: function (e) {
        console.log('学生选课');
        var studentId = $(e.target).parent().attr('data-studentid');
        React.render(
            React.createElement(Dialog, {
                title: "学生选课", 
                contentClassName: "dialog-content-take", 
                body: "StudentManageTakeCourseDialog", 
                url: serverpath + 'student/courseList', 
                url_add: serverpath + 'student/addCourseSelecting', 
                url_delete: serverpath + 'course/deleteCourseSelecting', 
                url_search: serverpath + 'student/searchCourseTeaching', 
                studentId: studentId}
        ), dialog_el);
    },
    updateStudent: function (e) {
        var index = parseInt($(e.target).attr('data-index')),
            updateStudentTr = function (newStudentData) {
                var studentList = this.state.data;
                studentList.splice(index, 1, newStudentData); // 更新学生信息
                this.setState({data: studentList});
            };
        React.render(React.createElement(Dialog, {
            title: "修改学生信息", 
            body: "UpdateStudentDialogBody", 
            url: serverpath + 'student/updateStudent', 
            url_detail: serverpath + 'student/updateStudent', 
            updateStudentTr: updateStudentTr}
        ), dialog_el);
    },
    deleteStudent: function (e) {
        console.log('删除学生');
        var $studentBTn = $(e.target).parent(),
            studentId = $studentBTn.attr('data-studentid'),
            removeStudentTr = function () {$studentBTn.parent().remove()};
        React.render(
            React.createElement(Dialog, {
                title: "删除学生", 
                url: serverpath + 'student/deleteStudent', 
                body: "DeleteStudentDialogBody", 
                studentId: studentId, 
                removeStudentTr: removeStudentTr}
        ), dialog_el);
    },
    addStudent: function () {
        console.log('添加学生');
        React.render(
            React.createElement(Dialog, {
                title: "添加学生", 
                url: serverpath + 'student/addStudent', 
                body: "AddStudentDialogBody", 
                refreshStudentData: this.loadStudentData}
        ), dialog_el);
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
                    React.createElement("td", {className: "cs-manage-op", "data-studentid": student.id, "data-index": index}, 
                        React.createElement("button", {className: "cs-manage-give", onClick: that.studentTake}, "选课"), 
                        React.createElement("button", {className: "cs-manage-change", onClick: that.updateStudent}, "修改"), 
                        React.createElement("button", {className: "cs-manage-delete", onClick: that.deleteStudent}, "删除")
                    )
                )
            );
        });
        return (
            React.createElement("div", {className: "cs-manage"}, 
                React.createElement("div", {className: "cs-manage-search box-style", ref: "searchData"}, 
                    React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
                    React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                    React.createElement(StudentGrade, {classNAme: "college-id"}), 
                    React.createElement(StudentNoName, {className: "course-no", onKeyDown: this.keyDownSearchStudent}), 
                    React.createElement("div", {className: "cs-search-btn"}, 
                        React.createElement("button", {onClick: this.searchStudent}, "搜索学生")
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

    module.exports = {
        StudentManage: StudentManage
    }

});