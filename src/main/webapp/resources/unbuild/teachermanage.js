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

    module.exports = {
        TeacherManage: TeacherManage
    }

});

