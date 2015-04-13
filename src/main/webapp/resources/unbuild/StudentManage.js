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
    var StudentManage = React.createClass({
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
    studentTake: function () {
        console.log('学生选课');
    },
    deleteStudent: function () {
        console.log('删除学生');
    },
    addStudent: function () {
        console.log('添加学生');
    },
    componentDidMount: function () {
        this.loadStudentData();
    },
    render: function () {
        var that = this;
        var studentNode = this.state.data.map(function (student, index) {
            return (
                <tr className="t-hover">
                    <td>{student.studentNo}</td>
                    <td>{student.name}</td>
                    <td>{student.sex}</td>
                    <td>{student.hwCampus.name + '校区' + student.hwCollege.collegeName + student.grade + '级'}</td>
                    <td>{student.hwMajor.name + student.class_ + '班'}</td>
                    <td className="cs-manage-op"  data-studentid={student.id}>
                        <button className="cs-manage-give" onClick={that.studentTake}>学生选课</button>
                        <button className="cs-manage-delete" onClick={that.deleteStudent}>删除学生</button>
                    </td>
                </tr>
                );
        });
        return (
            <div className="cs-manage">
                <div className="cs-manage-search box-style" ref="searchData">
                    <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                    <SelectCollege className="college-id" campusId={this.state.campusId}/>
                    <StudentGrade classNAme="college-id" />
                    <StudentNoName className="course-no" onKeyDown={this.keyDownSearchStudent}/>
                    <div className="cs-search-btn">
                        <button onClick={this.searchStudent}>搜索学生</button>
                    </div>
                    <div className="cs-addnew">
                        <button onClick={this.addStudent}>新增学生</button>
                    </div>
                </div>
                <table className="cs-manage-table">
                    <thead>
                        <tr>
                            <th>学号</th>
                            <th>姓名</th>
                            <th>性别</th>
                            <th>校区院系年级</th>
                            <th>所属专业/班级</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                            {studentNode}
                    </tbody>
                </table>
                <div className="cs-manage-page">
                    <button className="pre-page">上一页</button>
                    <button className="next-page">下一页</button>
                </div>
            </div>
            );
    }
});

    module.exports = {
        StudentManage: StudentManage
    }

});