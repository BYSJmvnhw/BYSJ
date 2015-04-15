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
            React.render(<Dialog
                title='删除教师'
                url={serverpath + 'manageTeacher/deleteTeacher'}
                body='DeleteTeacherDialogBody'
                teacherId={teacherId}
                removeTeacherTr={removeTeacherTr}
            />, dialog_el);
        },
        addTeacher: function () {
            console.log('添加教师');
            React.render(<Dialog
                title='添加教师'
                url={serverpath + 'manageTeacher/addTeacher'}
                body='AddTeacherDialogBody'
                refreshTeacherData={this.loadTeacherData}
            />, dialog_el );
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
                <Dialog
                    title='修改教师信息'
                    url={serverpath + 'manageTeacher/updateTeacher'}
                    url_detail={serverpath + 'manageTeacher/getTeacher'}
                    body='UpdateTeacherDialogBody'
                    teacherId={teacherId}
                    updateTeacherTr={updateTeacherTr}
            />, dialog_el);
        },
        teacherTake: function (e) {
            var teacherId=$(e.target).attr('data-teacherid');
        },
        componentWillMount: function () {
            this.loadTeacherData();
        },
        render: function () {
            var that = this;
            var teacherNode = this.state.data.map(function (teacher, index) {
                return (
                    <tr className="t-hover">
                        <td>{teacher.teacherNo}</td>
                        <td>{teacher.name}</td>
                        <td>{teacher.sex}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.campusName + '校区' + teacher.collegeName}</td>
                        <td className="cs-manage-op" data-teacherid={teacher.teacherId} data-index={index}>
                            <button className="cs-manage-give" onClick={that.teacherTake}>教师选课</button>
                            <button className="cs-manage-change" onClick={that.updateTeacher}>修改</button>
                            <button className="cs-manage-delete" onClick={that.deleteTeacher}>删除</button>
                        </td>
                    </tr>
                    );
            });
            return (
                <div className="cs-manage">
                    <div className="cs-manage-search box-style" ref="searchData">
                        <SelectCampus className="campus-id" setSelectCampus={this.setSelectCampus}/>
                        <SelectCollege className="college-id" campusId={this.state.campusId}/>
                        <TeacherNoName className="course-no" onKeyDown={this.keyDownSearchTeacher}/>
                        <div className="cs-search-btn">
                            <button onClick={this.searchTeacher}>搜索教师</button>
                        </div>
                        <div className="cs-addnew">
                            <button onClick={this.addTeacher}>新增教师</button>
                        </div>
                    </div>
                    <table className="cs-manage-table">
                        <thead>
                            <tr>
                                <th>学号</th>
                                <th>姓名</th>
                                <th>性别</th>
                                <th>邮箱</th>
                                <th>所属校区院系</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherNode}
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
        TeacherManage: TeacherManage
    }

});

