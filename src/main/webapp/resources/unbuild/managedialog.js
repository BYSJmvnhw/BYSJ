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
                default : return 'none-dialog';
            }
        },
        render: function () {
            var body = this.getDialogBody(this.props.body);
            return (
                <div className="dialog-shade" ref="dialogDiv" style={{display: this.state.display}}>
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

