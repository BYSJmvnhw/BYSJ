/**
 * Created by zqc on 15-4-13.
*/

define(function (require, exports, module) {

    var React = require('React');
    var $ = require('jquery');

    var serverpath = 'http://localhost:8080/mvnhk/';

    // 学院select内容组件
    var CollegeList = React.createClass({displayName: "CollegeList",
        getInitialState: function () {
            return {campus1: [], campus2: [], campus3: []};
        },
        loadCampusData: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function(data) {
                    console.log('校区信息', data);
                    this.setState({campus1: data.campus1, campus2: data.campus2, campus3: data.campus3});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentDidMount: function () {
            this.loadCampusData();
        },
        render: function () {
            var defaultValue = '', campusNode = '';
            if(this.state['campus' + this.props.campusId].length > 0){
                campusNode = this.state['campus' + this.props.campusId].map(function (campus, index) {
                    return (React.createElement("option", {value: campus.collegeId}, campus.collegeName));
                });
                defaultValue = this.state['campus' + this.props.campusId][0].collegeId;
            }
//            this.props.setSelectCollege({target: {value: defaultValue}});
            return (React.createElement("select", {onChange: this.props.setSelectCollege, defaultValue: defaultValue}, campusNode));
        }
    });

    var MajorList = React.createClass({displayName: "MajorList",
        getInitialState: function () {
            return {major: []};
        },
        loadMajorData: function (collegeId) {
            $.ajax({
                url: this.props.url,
                data: {collegeId: collegeId},
                dataType: 'json',
                success: function(data) {
                    console.log('专业信息', data);
                    this.setState({major: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        componentDidMount: function () {
            this.loadMajorData(this.props.collegeId);
        },
        componentWillReceiveProps: function (nextProps) {
            console.log('MajorList', nextProps.collegeId);
            this.loadMajorData(nextProps.collegeId);
        },
        render: function () {
            var defaultValue = '', majorNode = '';
            if(this.state.major.length > 0){
                majorNode = this.state.major.map(function (major) {
                    return (React.createElement("option", {value: major.majorId}, major.majorName));
                });
                defaultValue = this.state.major[0].majorId;
            }
            return (React.createElement("select", {defaultValue: defaultValue}, majorNode));
        }
    });

    // 校区select组件
    var SelectCampus = React.createClass({displayName: "SelectCampus",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "校区"), 
                    React.createElement("select", {onChange: this.props.setSelectCampus}, 
                        React.createElement("option", {value: "1"}, "石牌校区"), 
                        React.createElement("option", {value: "2"}, "大学城校区"), 
                        React.createElement("option", {value: "3"}, "南海校区")
                    )
                )
                );
        }
    });

    // 学院select组件
    var SelectCollege = React.createClass({displayName: "SelectCollege",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "学院"), 
                    React.createElement(CollegeList, {url: serverpath + "student/collegeList", campusId: this.props.campusId, setSelectCollege: this.props.setSelectCollege})
                )
                );
        }
    });

    // 专业select组件
    var SelectMajor = React.createClass({displayName: "SelectMajor",
        getInitialState: function () {
            return {collegeId: this.props.collegeId};
        },
        componentWillReceiveProps: function (nextProps) {
            console.log('SelectMajor', nextProps.collegeId);
            this.setState({collegeId: nextProps.collegeId});
        },
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "专业"), 
                    React.createElement(MajorList, {url: serverpath + "student/majorList", collegeId: this.state.collegeId})
                )
                );
        }
    });

//    // 学年select组件
//    var SelectTermYear = React.createClass({});
//
//    // 学期select组件
//    var SelectTerm = React.createClass({});

    // 课程号input组件
    var CourseNo = React.createClass({displayName: "CourseNo",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "课程号"), 
                    React.createElement("input", {type: "text", placeholder: "输入课程号", onKeyDown: this.props.onKeyDown})
                )
                );
        }
    });

    // 课程名input组件
    var CourseName = React.createClass({displayName: "CourseName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "课程名"), 
                    React.createElement("input", {type: "text", placeholder: "输入课程名称", onKeyDown: this.props.onKeyDown})
                )
                );
        }
    });

    // 课程号/名组件，搜索表单专用
    var CourseNoName = React.createClass({displayName: "CourseNoName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "课程名/号"), 
                    React.createElement("input", {type: "text", placeholder: "输入课程号或课程名", onKeyDown: this.props.onKeyDown})
                )
                );
        }
    });

    // 教师号/名组件，搜索表单专用
    var TeacherNoName = React.createClass({displayName: "TeacherNoName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "教师名/号"), 
                    React.createElement("input", {type: "text", placeholder: "输入教师名或教师号", onKeyDown: this.props.onKeyDown})
                )
                );
        }
    });

    // 学生号/名组件，搜索表单专用
    var StudentNoName = React.createClass({displayName: "StudentNoName",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "学生名/号"), 
                    React.createElement("input", {type: "text", placeholder: "输入学生姓名或学号", onKeyDown: this.props.onKeyDown})
                )
                );
        }
    });

    // 年级
    var StudentGrade = React.createClass({displayName: "StudentGrade",
        render: function () {
            return (
                React.createElement("div", {className: this.props.className}, 
                    React.createElement("label", null, "年级"), 
                    React.createElement("select", {onChange: this.props.onChange}, 
                        React.createElement("option", {value: "2011"}, "2011级"), 
                        React.createElement("option", {value: "2012"}, "2012级"), 
                        React.createElement("option", {value: "2013"}, "2013级"), 
                        React.createElement("option", {value: "2014"}, "2014级")
                    )
                )
                );
        }
    });

    // 检测服务端session是否过期，若过期则跳转到登陆页面
    // @param status 后台session状态
    function checkSession (status) {
        if(status == 'timeout'){
            alert('会话已过期，请重新登录！');
            window.location.href = servicepath + 'web/login';
        }
    }

    module.exports = {
        CollegeList: CollegeList,
        MajorList: MajorList,
        SelectCampus: SelectCampus,
        SelectCollege: SelectCollege,
        SelectMajor: SelectMajor,
        CourseNo: CourseNo,
        CourseName: CourseName,
        CourseNoName: CourseNoName,
        TeacherNoName: TeacherNoName,
        StudentNoName: StudentNoName,
        StudentGrade: StudentGrade,
        checkSession: checkSession
    }

});

