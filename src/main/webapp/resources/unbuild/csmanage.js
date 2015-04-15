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
    var CsManage = React.createClass({
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
                <Dialog title='授课管理'
                    body='GiveCourseManageBody'
                    courseId={courseId}
                    contentClassName='dialog-content-take'
                    url={serverpath + 'course/teacherList'}
                    url_add={serverpath + 'course/addCourseTeaching'}
                    url_search={serverpath + 'manageTeacher/searchTeacher'}
                />,
                dialog_el
            );
        },
        addCourse: function () {
            console.log('新增课程');
            React.render(
                <Dialog title='新增课程'
                    body="AddCourseDialogBody"
                    url={serverpath + "course/addCourse"}
                    refreshCourseData = {this.loadCourseData}
                    display="block"
                />,
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
                <Dialog title='修改课程'
                    body='UpdateCourseDialogBody'
                    url={serverpath + 'course/updateCourse'}
                    url_detail={serverpath + 'course/courseDetail'}
                    updateCourseTr={updateCourseTr}
                    courseId = {courseId}
                />,
            dialog_el);
        },
        deleteCourse: function (e) {
            console.log('删除课程');
            var $courseBTn = $(e.target).parent(),
                courseId = $courseBTn.attr('data-courseId'),
                removeCourseTr = function () {$courseBTn.parent().remove()};
            React.render(
                <Dialog title='删除课程'
                    body="DeleteCourseDialogBody"
                    url={serverpath + "course/deleteCourse"}
                    removeCourseTr={removeCourseTr}
                    courseId={courseId} display="block" />,
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
            this.loadCourseData(
                searchdata[0].value,
                searchdata[1].value,
                parseInt(searchdata[2].value) || '',
                searchdata[2].value.replace(/\d+/g, '')
            );
        },
        keyDownSearchCourse: function (e) {
            (e.keyCode || e.which) == 13 && this.searchCourse();
        },
        render: function () {
            var that = this;
            var courseNode = this.state.data.map(function (course, index) {
                return (
                    <tr className="t-hover">
                        <td>{course.courseNo}</td>
                        <td>{course.courseName}</td>
                        <td>{course.campusName}校区{course.collegeName}</td>
                        <td>{course.majorName}</td>
                        <td className="cs-manage-op"  data-courseid={course.courseId}>
                            <button className="cs-manage-give" onClick={that.giveCourseManage}>授课管理</button>
                            <button className="cs-manage-change" onClick={that.updateCourse}>修改</button>
                            <button className="cs-manage-delete" onClick={that.deleteCourse}>删除</button>
                        </td>
                    </tr>
                    );
            });
            return (
                <div className="cs-manage">
                    <div className="cs-manage-search box-style" ref="searchData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <CourseNoName className="course-no" onKeyDown={this.keyDownSearchCourse}/>
                        <div className="cs-search-btn">
                            <button onClick={this.searchCourse}>搜索课程</button>
                        </div>
                        <div className="cs-addnew">
                            <button onClick={this.addCourse}>新增课程</button>
                        </div>
                    </div>
                    <table className="cs-manage-table">
                        <thead>
                            <tr>
                                <th>课程编号</th>
                                <th>课程名</th>
                                <th>所属校区院系</th>
                                <th>所属专业</th>
                                <th data-courseId="">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseNode}
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
        CsManage : CsManage
    }

});

