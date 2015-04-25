/**
 * Created by 郑权才 on 15-4-13.
 */

define(function (require, exports, module) {

    var React = require('React');
    var manageDialog = require('managedialog');
    var $ = require('jquery');

    var serverpath = 'http://localhost:8080/mvnhk/',
        dialog_el = document.getElementById('dialog-wrap'),
        Dialog = manageDialog.Dialog;

    // 用户管理组件
    var ThreadManage = React.createClass({
        getInitialState: function () {
            return {
                data: []
            };
        },
        loadThreadData: function () {
            $.ajax({
                url: this.props.url,
                data: null,
                dataType: 'json',
                success: function(data) {
                    console.log('线程管理', data);
                    this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        updateThread: function (e) {
            console.log('修改线程');
            var $cur=$(e.target).parent(), threadId=$cur.attr('data-threadid'), index=$cur.attr('data-index');
            React.render(
                <Dialog
                title='修改线程启动时间'
                body='UpdateThreadDialogBody'
                url={serverpath + 'Email/modifyThreadTime'}
                threadId={threadId}
            />, dialog_el);
        },
        componentWillMount: function () {
            this.props.url != '' && this.loadThreadData();
        },
        componentWillReceiveProps: function (nextProps) {
            this.props.url = nextProps.url;
            nextProps.url == '' ? this.setState({data: []}) : this.loadThreadData();
        },
        render: function () {
            var that = this;
            var userNode = this.state.data.map(function (thread, index) {
                return (
                    <tr className="t-hover">
                        <td>{thread.name}</td>
                        <td>{thread.hour}</td>
                        <td>{thread.lastModifyDate}</td>
                        <td className="cs-manage-op"  data-threadid={thread.id} data-index={index}>
                            <button className="cs-manage-change" onClick={that.updateThread}>修改线程</button>
                        </td>
                    </tr>
                    );
            });
            return (
                <div className="cs-manage">
                    <table className="cs-manage-table">
                        <thead>
                            <tr>
                                <th>线程名</th>
                                <th>线程每天启动时间</th>
                                <th>最后一次修改时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userNode}
                        </tbody>
                    </table>
                </div>
                );
        }
    });

    module.exports = {
        ThreadManage: ThreadManage
    }

});

