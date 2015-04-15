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
        InputText = cellComponent.InputText,
        SelectUsertype = cellComponent.SelectUsertype,
        CourseName = cellComponent.CourseName,
        CourseNoName = cellComponent.CourseNoName,
        TeacherNoName = cellComponent.TeacherNoName,
        StudentNoName = cellComponent.StudentNoName,
        StudentGrade = cellComponent.StudentGrade,
        Dialog = manageDialog.Dialog;

    // 用户管理组件
    var UserManage = React.createClass({
        getInitialState: function () {
            return {
                data: []
            };
        },
        loadUserData: function (userType, username, trueName) {
            $.ajax({
                url: this.props.url,
                data: {userType: userType, username: username, trueName: trueName},
                dataType: 'json',
                success: function(data) {
                    console.log('用户管理', data);
                    this.setState({data: data.data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        searchUser: function () {
            console.log('搜索用户');
            var searchdata = $(this.refs.searchData.getDOMNode()).find('input, select');
            this.loadUserData(searchdata[0].value, parseInt(searchdata[1].value), searchdata[1].value.replace(/\d+/g, ''));
        },
        keyDownSearchUser: function (e) {
            (e.keyCode || e.which) == 13 && this.searchUser();
        },
        updateUser: function (e) {
            console.log('修改用户');
            var $cur=$(e.target), userId=$cur.attr('data-userid'), index=$cur.attr('data-index');
            React.render(
                <Dialog
                title='修改用户密码'
                body='UpdateUserDialogBody'
                userId={userId}
                />, dialog_el);
        },
        componentWillMount: function () {
            this.loadUserData();
        },
        render: function () {
            var that = this;
            var userNode = this.state.data.map(function (user, index) {
                return (
                    <tr className="t-hover">
                        <td>{user.username}</td>
                        <td>{user.trueName}</td>
                        <td>{user.userType}</td>
                        <td>{user.createDate.replace(/:\d\d$/, '')}</td>
                        <td>{user.mobile}</td>
                        <td className="cs-manage-op"  data-userid={user.userId} data-index={index}>
                            <button className="cs-manage-change" onClick={that.updateUser}>修改密码</button>
                        </td>
                    </tr>
                    );
            });
            return (
                <div className="cs-manage">
                    <div className="cs-manage-search box-style" ref="searchData">
                        <SelectUsertype />
                        <InputText labelName='帐户名/姓名' placeholderText='输入账户名/真实姓名' onKeyDown={this.keyDownSearchUser}/>
                        <div className="cs-search-btn">
                            <button onClick={this.searchUser}>搜索用户</button>
                        </div>
                    </div>
                    <table className="cs-manage-table">
                        <thead>
                            <tr>
                                <th>账户</th>
                                <th>姓名</th>
                                <th>账户类型</th>
                                <th>创建时间</th>
                                <th>联系电话</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userNode}
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
        UserManage: UserManage
    }

});

