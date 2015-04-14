/**
 * Created by zqc on 15-4-13.
*/

define(function (require, exports, module) {

    var React = require('React');
    var $ = require('jquery');

    var serverpath = 'http://localhost:8080/mvnhk/';

    // 学院select内容组件
    var CollegeList = React.createClass({
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
            if(this.state['campus' + this.props.campusId] && this.state['campus' + this.props.campusId].length > 0){
                campusNode = this.state['campus' + this.props.campusId].map(function (campus, index) {
                    return (<option value={campus.collegeId}>{campus.collegeName}</option>);
                });
                defaultValue = this.state['campus' + this.props.campusId][0].collegeId;
            }
//            this.props.setSelectCollege({target: {value: defaultValue}});
            return (<select onChange={this.props.setSelectCollege} defaultValue={defaultValue}>{campusNode}</select>);
        }
    });

    // 专业select内容组件
    var MajorList = React.createClass({
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
            if(this.state.major.length && this.state.major.length > 0){
                majorNode = this.state.major.map(function (major) {
                    return (<option value={major.majorId}>{major.majorName}</option>);
                });
                defaultValue = this.state.major[0].majorId;
            }
            return (<select defaultValue={defaultValue}>{majorNode}</select>);
        }
    });

    // 校区select组件
    var SelectCampus = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>校区</label>
                    <select onChange={this.props.setSelectCampus}>
                        <option value="1">石牌校区</option>
                        <option value="2">大学城校区</option>
                        <option value="3">南海校区</option>
                    </select>
                </div>
                );
        }
    });

    // 学院select组件
    var SelectCollege = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>学院</label>
                    <CollegeList url={serverpath + "student/collegeList"} campusId={this.props.campusId} setSelectCollege={this.props.setSelectCollege}/>
                </div>
                );
        }
    });

    // 专业select组件
    var SelectMajor = React.createClass({
        getInitialState: function () {
            return {collegeId: this.props.collegeId};
        },
        componentWillReceiveProps: function (nextProps) {
            console.log('SelectMajor', nextProps.collegeId);
            this.setState({collegeId: nextProps.collegeId});
        },
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>专业</label>
                    <MajorList url={serverpath + "student/majorList"} collegeId={this.state.collegeId} />
                </div>
                );
        }
    });

    // 学年select组件
    var SelectTermYear = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>学年</label>
                    <select onChange={this.props.setSelectTermYear}>
                        <option value="2011">2011~2012</option>
                        <option value="2012">2012~2013</option>
                        <option value="2013">2013~2014</option>
                        <option value="2014">2014~2015</option>
                    </select>
                </div>
            );
        }
    });

    // 学期select组件
    var SelectTerm = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>学期</label>
                    <select onChange={this.props.setSelectTerm}>
                        <option value="1">第一学期</option>
                        <option value="2">第二学期</option>
                    </select>
                </div>
            );
        }
    });

    // 课程号input组件
    var CourseNo = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>课程号</label>
                    <input type="text" placeholder="输入课程号"
                        onKeyDown={this.props.onKeyDown}
                        readOnly={this.props.readonly}
                        value={this.props.value}
                    />
                </div>
                );
        }
    });

    // 课程名input组件
    var CourseName = React.createClass({
        getInitialState: function() {
            return {value: this.props.value};
        },
        handleChange: function(event) {
            this.setState({value: event.target.value});
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({value: nextProps.value});
        },
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>课程名</label>
                    <input type="text" placeholder="输入课程名称"
                        onKeyDown={this.props.onKeyDown}
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </div>
            );
        }
    });

    // input组件公用
    var InputText = React.createClass({
        getInitialState: function() {
            return {value: this.props.value};
        },
        handleChange: function(event) {
            this.setState({value: event.target.value});
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState({value: nextProps.value});
        },
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>{this.props.labelName}</label>
                    <input type="text" placeholder={this.props.placeholderText}
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </div>
            );
        }
    });

    // 性别select组件
    var SelectSex = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>性别</label>
                    <select>
                        <option value="男">男</option>
                        <option value="女">女</option>
                    </select>
                </div>
            );
        }
    });

    // 课程号/名组件，搜索表单专用
    var CourseNoName = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>课程名/号</label>
                    <input type="text" placeholder="输入课程号或课程名"  onKeyDown={this.props.onKeyDown}/>
                </div>
                );
        }
    });

    // 教师号/名组件，搜索表单专用
    var TeacherNoName = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>教师名/号</label>
                    <input type="text" placeholder="输入教师名或教师号"  onKeyDown={this.props.onKeyDown}/>
                </div>
                );
        }
    });

    // 学生号/名组件，搜索表单专用
    var StudentNoName = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>学生名/号</label>
                    <input type="text" placeholder="输入学生姓名或学号"  onKeyDown={this.props.onKeyDown}/>
                </div>
                );
        }
    });

    // 年级
    var StudentGrade = React.createClass({
        render: function () {
            return (
                <div className={this.props.className}>
                    <label>年级</label>
                    <select onChange={this.props.onChange}>
                        <option value="2011">2011级</option>
                        <option value="2012">2012级</option>
                        <option value="2013">2013级</option>
                        <option value="2014">2014级</option>
                    </select>
                </div>
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
        SelectTermYear: SelectTermYear,
        SelectTerm: SelectTerm,
        CourseNo: CourseNo,
        CourseName: CourseName,
        InputText: InputText,
        SelectSex: SelectSex,
        CourseNoName: CourseNoName,
        TeacherNoName: TeacherNoName,
        StudentNoName: StudentNoName,
        StudentGrade: StudentGrade,
        checkSession: checkSession
    }

});

