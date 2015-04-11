/**
 * Created by zqc on 2015/4/10.
 */

define(function(require, exports, module) {

    var React = require('React');
    var Backbone = require('Backbone');
    var $ = require('jquery');
    Backbone.$ = $;

    var Login = React.createClass({
        login: function (e) {
            console.log('登陆');
            this.hideLoginDiv();
        },
        hideLoginDiv: function () {
            $(React.findDOMNode(this.refs.loginDiv)).addClass('login-div-hide');
        },
        render: function () {
            return (
                <div className="login-div" ref="loginDiv">
                    <section className="l-up">
                        <div className="l-up-txt">
                            <div className="txt-img">
                                <img src="images/logo.png"></img>
                            </div>
                            <p>作业网后台管理平台</p>
                        </div>
                    </section>
                    <section className="l-middle">
                        <div className="l-input-wrap">
                            <div className="l-m-tip">登陆</div>
                            <div className="l-input">
                                <div className="lg-name">
                                    <input type="text" placeholder="请输入用户名"/>
                                </div>
                                <div className="lg-pw">
                                    <input type="password" placeholder="请输入密码"/>
                                </div>
                            </div>
                            <div className="l-login-btn">
                                <button onClick={this.login}>登陆</button>
                            </div>
                        </div>
                    </section>
                    <section className="l-down"></section>
                </div>
            );
        }
    });

    var AppRouter = Backbone.Router.extend({
        routes: {
            ':part(/:type/:bar)': 'jmpPart'
        },
        initialize: function () {
            var that = this;
            window.appNavigate = function (url, title, setting){
                that.navigate(url, setting); // 设置登录路由地址
                document.title = title;
            };
            appNavigate('login', '登陆作业网', {trigger:true}); // 设置登录路由地址
        },
        jmpPart: function (part, type, bar) {
            var that = this;
            if(part == 'login'){
                React.render(<Login />, document.getElementById('login-part'));
            }
            else if(part == 'main') {

            }
        }
    });

    module.exports.loginManage = function () {
        // 创建全局路由，控制器
        window.approuter =  new AppRouter;
        // 开启路由历史记录
        Backbone.history.start({
            pushState: true,
            root: '/mvnhk/manage/'
        });
    }

});
