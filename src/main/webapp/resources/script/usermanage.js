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
    var UserManage = React.createClass({displayName: "UserManage",
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
            this.loadUserData(searchdata[0].value, parseInt(searchdata[1].value) || '', searchdata[1].value.replace(/\d+/g, ''));
        },
        keyDownSearchUser: function (e) {
            (e.keyCode || e.which) == 13 && this.searchUser();
        },
        updateUser: function (e) {
            console.log('修改用户');
            var $cur=$(e.target).parent(), userId=$cur.attr('data-userid'), index=$cur.attr('data-index');
            React.render(
                React.createElement(Dialog, {
                title: "修改用户密码", 
                body: "UpdateUserDialogBody", 
                url: serverpath + 'user/updateUser', 
                userId: userId}
            ), dialog_el);
        },
        componentWillMount: function () {
            this.loadUserData();
        },
        render: function () {
            var that = this;
            var userNode = this.state.data.map(function (user, index) {
                return (
                    React.createElement("tr", {className: "t-hover"}, 
                        React.createElement("td", null, user.username), 
                        React.createElement("td", null, user.trueName), 
                        React.createElement("td", null, user.userType), 
                        React.createElement("td", null, user.createDate.replace(/:\d\d$/, '')), 
                        React.createElement("td", null, user.mobile), 
                        React.createElement("td", {className: "cs-manage-op", "data-userid": user.userId, "data-index": index}, 
                            React.createElement("button", {className: "cs-manage-change", onClick: that.updateUser}, "修改密码")
                        )
                    )
                    );
            });
            return (
                React.createElement("div", {className: "cs-manage"}, 
                    React.createElement("div", {className: "cs-manage-search box-style", ref: "searchData"}, 
                        React.createElement(SelectUsertype, null), 
                        React.createElement(InputText, {labelName: "帐户名/姓名", placeholderText: "输入账户名/真实姓名", onKeyDown: this.keyDownSearchUser}), 
                        React.createElement("div", {className: "cs-search-btn"}, 
                            React.createElement("button", {onClick: this.searchUser}, "搜索用户")
                        )
                    ), 
                    React.createElement("table", {className: "cs-manage-table"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "账户"), 
                                React.createElement("th", null, "姓名"), 
                                React.createElement("th", null, "账户类型"), 
                                React.createElement("th", null, "创建时间"), 
                                React.createElement("th", null, "联系电话"), 
                                React.createElement("th", null, "操作")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            userNode
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
        UserManage: UserManage
    }

});

