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
    var TeacherManage = React.createClass({displayName: "TeacherManage",
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
        loadTeacherData: function (campusId, collegeId, teacherNo, Teachername) {
            $.ajax({
                url: this.props.url,
                data: {
                    campusId: campusId,
                    collegeId: collegeId,
                    teacherNo: teacherNo,
                    name: Teachername
                },
                dataType: 'json',
                success: function(data) {
                    console.log('教师管理', data);
                    this.setState({data: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        searchTeacher: function () {
            console.log('搜索教师');
            var searchdata = $(this.refs.searchData.getDOMNode()).find('input, select');
            this.loadTeacherData(
                searchdata[0].value,
                searchdata[1].value,
                parseInt(searchdata[2].value) || '',
                searchdata[2].value.replace(/\d+/g, '')
            );
        },
        keyDownSearchTeacher: function (e) {
            (e.keyCode || e.which) == 13 && this.searchTeacher();
        },
        deleteTeacher: function (e) {
            console.log('删除教师');
            var that = this, $teacherBTn = $(e.target).parent(),
                teacherId = $teacherBTn.attr('data-teacherid'),
                index=$teacherBTn.attr('data-index'),
                removeTeacherTr = function () {
                    var t = that.state.data;
                    t.splice(index, 1);
                    that.setState({data: t});
                };
            React.render(React.createElement(Dialog, {
                title: "删除教师", 
                url: serverpath + 'manageTeacher/deleteTeacher', 
                body: "DeleteTeacherDialogBody", 
                teacherId: teacherId, 
                removeTeacherTr: removeTeacherTr}
            ), dialog_el);
        },
        addTeacher: function () {
            console.log('添加教师');
            React.render(React.createElement(Dialog, {
                title: "添加教师", 
                url: serverpath + 'manageTeacher/addTeacher', 
                body: "AddTeacherDialogBody", 
                refreshTeacherData: this.loadTeacherData}
            ), dialog_el );
        },
        updateTeacher: function (e) {
            console.log('修改教师');
            var that=this, $cur=$(e.target).parent(), teacherId=$cur.attr('data-teacherid'), index=$cur.attr('data-index'),
                updateTeacherTr = function (obj) {
                    var teacherList = that.state.data;
                    teacherList.splice(index, 1, obj); // 更新修改后的数据
                    that.setState({data: teacherList});
                };
            React.render(
                React.createElement(Dialog, {
                    title: "修改教师信息", 
                    url: serverpath + 'manageTeacher/updateTeacher', 
                    url_detail: serverpath + 'manageTeacher/getTeacher', 
                    body: "UpdateTeacherDialogBody", 
                    teacherId: teacherId, 
                    updateTeacherTr: updateTeacherTr}
            ), dialog_el);
        },
        teacherTake: function (e) {
            var teacherId=$(e.target).parent().attr('data-teacherid');
            React.render(
                React.createElement(Dialog, {
                    title: "教师选课", 
                    body: "TeacherManageGiveCourseDialog", 
                    contentClassName: "dialog-content-take", 
                    teacherId: teacherId, 
                    url: serverpath + 'manageTeacher/getCourseByTeacher', 
                    url_search: serverpath + 'course/searchCourse', 
                    url_add: serverpath + 'manageTeacher/addCourseForTeacher', 
                    url_delete: serverpath + 'course/deleteCourseTeaching'}
            ), dialog_el);
        },
        componentWillMount: function () {
            this.loadTeacherData();
        },
        render: function () {
            var that = this;
            var teacherNode = this.state.data.map(function (teacher, index) {
                return (
                    React.createElement("tr", {className: "t-hover"}, 
                        React.createElement("td", null, teacher.teacherNo), 
                        React.createElement("td", null, teacher.name), 
                        React.createElement("td", null, teacher.sex), 
                        React.createElement("td", null, teacher.email), 
                        React.createElement("td", null, teacher.campusName + '校区' + teacher.collegeName), 
                        React.createElement("td", {className: "cs-manage-op", "data-teacherid": teacher.teacherId, "data-index": index}, 
                            React.createElement("button", {className: "cs-manage-give", onClick: that.teacherTake}, "教师选课"), 
                            React.createElement("button", {className: "cs-manage-change", onClick: that.updateTeacher}, "修改"), 
                            React.createElement("button", {className: "cs-manage-delete", onClick: that.deleteTeacher}, "删除")
                        )
                    )
                    );
            });
            return (
                React.createElement("div", {className: "cs-manage"}, 
                    React.createElement("div", {className: "cs-manage-search box-style", ref: "searchData"}, 
                        React.createElement(SelectCampus, {className: "campus-id", setSelectCampus: this.setSelectCampus}), 
                        React.createElement(SelectCollege, {className: "college-id", campusId: this.state.campusId}), 
                        React.createElement(TeacherNoName, {className: "course-no", onKeyDown: this.keyDownSearchTeacher}), 
                        React.createElement("div", {className: "cs-search-btn"}, 
                            React.createElement("button", {onClick: this.searchTeacher}, "搜索教师")
                        ), 
                        React.createElement("div", {className: "cs-addnew"}, 
                            React.createElement("button", {onClick: this.addTeacher}, "新增教师")
                        )
                    ), 
                    React.createElement("table", {className: "cs-manage-table"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "学号"), 
                                React.createElement("th", null, "姓名"), 
                                React.createElement("th", null, "性别"), 
                                React.createElement("th", null, "邮箱"), 
                                React.createElement("th", null, "所属校区院系"), 
                                React.createElement("th", null, "操作")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            teacherNode
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
        TeacherManage: TeacherManage
    }

});

