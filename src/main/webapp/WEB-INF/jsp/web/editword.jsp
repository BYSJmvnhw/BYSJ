<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/3/9 0009
  Time: 下午 3:43
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="org.demo.model.HwHomeworkInfo" %>
<%@ page import="org.demo.tool.MarkType" %>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<!DOCTYPE html>
<html lang="zn">
    <head>
        <title>作业批改</title>
        <meta charset="UTF-8">
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="cache-control" content="no-cache">
        <meta http-equiv="expires" content="0">
        <script type="text/javascript" src="${pageContext.request.contextPath}/resources/lib/jquery-1.11.2.js"></script>
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
                color: #333;
                background-color: #e4eef2;
                font-family: "Helvetica Neue",Helvetica,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;
            }
            .editwork-wrap {
                width: 1310px;
                position: absolute;
                left: 0;
                right: 0;
                margin: 0 auto;
            }
            .editwork-wrap>section {
                display: inline-block;
                margin-top: 10px;
            }
            .editwork {
                width: 900px;
            }
            .work-wrap {
                position: absolute;
                top: 0;
                width: 400px;
                line-height: 30px;
                margin-left: 20px;
                background-color: #fff;
            }
            .workinfo, .mark-work {
                padding: 8px;
            }
            .workinfo>div>label:first-child, .mark-work>div>label:first-child {
                display: inline-block;
                width: 80px;
                text-align: right;
                margin-right: 10px;
                font-weight: bold;
            }
            .work-desc>label:nth-child(2) {
                margin-left: 90px;
                float: right;
                margin-top: -30px;
                width: 290px;
            }
            .workinfo-title, .markinfo-title {
                height: 40px;
                line-height: 40px;
                margin: 10px 15px 0 -15px;
                padding-left: 20px;
                position: relative;
                color: white;
                background-color: #009ee5;
            }
            .workinfo-title:after, .markinfo-title:after {
                content: '';
                border-left: 15px solid transparent;
                border-top: 8px solid #01638f;
                position: absolute;
                left: 0;
                bottom: -8px;
            }
            .work-desc>label:last-child {
                color: #337AB7;
            }
            .work-deadline>label:last-child {
                color: #D9534F;
            }
            .mark-comment, .mark {
                overflow: hidden;
                zoom: 1;
                margin-bottom: 10px;
                position: relative;
            }
            .mark-comment>textarea {
                width: 355px;
                height: 100px;
                border: 1px solid #BABABA;
                font-size: 18px;
                padding: 5px;
                margin-top: 10px;
                margin-left: 15px;
            }
            .mark-comment>textarea:focus {
                border-color: #009ee5;
            }
            .textarea-shade {
                width: 367px;
                height: 212px;
                z-index: 1;
                position: absolute;
                right: 0;
                top: 51px;
                cursor: text;
            }
            .select0-shade {
                width: 288px;
                height: 30px;
                position: absolute;
                top: 0;
                right: 0;
            }
            .mark>select, .mark-comment>select {
                border: 1px solid #BABABA;
                width: 150px;
                padding: 4px;
                font-size: 14px;
                background-color: #FFF;
                outline: 0 none;
                text-align: center;
            }
            .mark-comment>select {
                width: 288px;
            }
            .mark>select:focus, .mark-comment>select:focus {
                border-color: #009ee5;
            }
            .select-shade {
                height: 30px;
                width: 150px;
                position: absolute;
                top: 0;
                left: 94px;
            }
            .mark-btn {
                text-align: right;
                padding-right: 30px;
                margin-bottom: 10px;
            }
            .mark-btn>button {
                background-color: #5cb85c;
                border: 1px #4cae4c solid;
                line-height: 30px;
                color: #fff;
                width: 100px;
                font-weight: bold;
                font-size: 16px;
                display: inline-block;
                text-align: center;
                cursor: pointer;
            }
            .mark-btn>button:hover {
                background-color: #449d44;
                border-color: #398439;
            }
            .dialog-shade {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(100,100,100,0.5);
                z-index: 100;
            }
            .dialog-shade2 {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgb(100,100,100);
                opacity: 0.5;
            }
            .dialog-wrap {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto auto;
                height: 150px;
                width: 200px;
                background-color: #fff;
                padding: 8px 15px;
            }
            .dialog-title {
                padding-bottom: 10px;
                border-bottom: 1px #eee solid;
            }
            .dialog-body p>span{
                color: #D43F3A;
            }
            .dialog-footer {
                text-align: right;
            }
            .dialog-footer>button {
                line-height: 30px;
                color: #fff;
                /*width: 100px;*/
                font-weight: bold;
                font-size: 16px;
                display: inline-block;
                text-align: center;
                cursor: pointer;
            }
            .close-after {
                margin-right: 15px;
                background-color: #f0ad4e;
                border-color: #eea236;
            }
            .close-after:hover {
                background-color: #ec971f;
                border-color: #d58512;
            }
            .close-now {
                background-color: #d9534f;
                border-color: #d43f3a;
            }
            .close-now:hover {
                background-color: #c9302c;
                border-color: #ac2925;
            }
        </style>
    </head>
    <body>
        <div class="editwork-wrap">
            <section id="editwork" class="editwork">
                <po:PageOfficeCtrl id="PageOfficeCtrl1"/>
            </section>
            <section id="work-wrap" class="work-wrap">
                <div class="workinfo-title">
                    <strong>作业信息</strong>
                </div>
                <div class="workinfo">
                    <div class="stu-name">
                        <label>学生姓名</label>
                        <label>${requestScope.student.name}</label>
                    </div>
                    <div class="stu-no">
                        <label>学号</label>
                        <label>${requestScope.student.studentNo}</label>
                    </div>
                    <div class="course-title">
                        <label>课程名</label>
                        <label>${requestScope.hwInfo.courseName}</label>
                    </div>
                    <div class="work-title">
                        <label>作业名</label>
                        <label>${requestScope.hwInfo.title}</label>
                    </div>
                    <div class="work-desc">
                        <label>作业描述</label>
                        <label>${requestScope.hwInfo.hwDesc}</label>
                    </div>
                    <div class="work-deadline">
                        <label>截止时间</label>
                        <label>${requestScope.hwInfo.deadline}</label>
                    </div>
                </div>
                <div class="markinfo-title">
                    <strong>作业评估</strong>
                </div>
                <div class="mark-work">
                    <div class="mark-comment">
                        <label>作业评语</label>
                        <select id="select-comment">
                            <option>做得非常好7</option>
                            <option>做得非常好8</option>
                            <option>做得非常好9</option>
                            <option>做得非常好0</option>
                        </select>
                        <div id="select0-shade" class="select0-shade"></div>
                        <textarea id="work-comment" placeholder="请填写作业评语">做得非常好，继续加油！</textarea>
                        <div id="textarea-shade" class="textarea-shade"></div>
                    </div>
                    <div class="mark">
                        <label>作业评分</label>
                        <%--<% if(${requestScope.hwInfo.markType} == 'LEVEL'){%>--%>
                        <% HwHomeworkInfo hwInfo = (HwHomeworkInfo)request.getAttribute("hwInfo");
                            if(hwInfo.getMarkType() == MarkType.CHINESE_LEVEL){%>
                        <select id="select-mark">
                            <option selected>优秀</option>
                            <option>良好</option>
                            <option>一般</option>
                            <option>差</option>
                        </select>
                        <%}
                        else if (hwInfo.getMarkType() == MarkType.CHAR_LEVEL) {%>
                        <select id="select-mark">
                            <option selected>A+</option>
                            <option>A</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B</option>
                            <option>B-</option>
                            <option>C+</option>
                            <option>C</option>
                            <option>C-</option>
                        </select>
                        <%}
                        else if (hwInfo.getMarkType() == MarkType.HUNDRED) {%>
                        <select id="select-mark">
                            <option selected>100分</option>
                            <%for(int i = 99; i >= 0; i--){%>
                            <option><%=i%>分</option>
                            <%}%>
                        </select>
                        <%}
                        else if (hwInfo.getMarkType() == MarkType.FIVE) {%>
                        <select id="select-mark">
                            <option selected>5分</option>
                            <option>4分</option>
                            <option>3分</option>
                            <option>2分</option>
                            <option>1分</option>
                            <option>0分</option>
                        </select>
                        <%}
                        else if (hwInfo.getMarkType() == MarkType.TEN) {%>
                        <select id="select-mark">
                            <option selected>10分</option>
                            <%for(int i = 9; i >= 0; i--){%>
                            <option><%=i%>分</option>
                            <%}%>
                        </select>
                        <%}
                        else {%>
                        <select id="select-mark">
                            <option selected>合格</option>
                            <option>不合格</option>
                        </select>
                        <%}%>
                        <div id="select-shade" class="select-shade"></div>
                    </div>
                    <div class="mark-btn">
                        <button id="mark-sure">确认</button>
                    </div>
                </div>
            </section>
        </div>
        <%--<section class="dialog-shade">--%>
            <%--<div class="dialog-shade2"></div>--%>
            <%--<div class="dialog-wrap">--%>
                <%--<div class="dialog-title">提示信息</div>--%>
                <%--<div class="dialog-body">--%>
                    <%--<p>批改完成，<span>10秒</span>后自动关闭窗口。</p>--%>
                <%--</div>--%>
                <%--<div class="dialog-footer">--%>
                    <%--<button id="close-now" class="close-now">现在就关闭</button>--%>
                    <%--<button id="close-after" class="close-after">不，稍后我自己关闭</button>--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</section>--%>
        <script language="javascript" type="text/javascript">
            var editWork = {
                $editwork: $('#editwork'),
                edit: $("#PageOfficeCtrl1")[0],
                hwId: '${requestScope.hw.id}',
                init: function () {
                    this.$editwork.css('height', (window.innerHeight - 15) + 'px');
                    this.edit.Caption = "${requestScope.hwInfo.title}";
                    this.edit.OfficeVendor = "MSOffice";
                    this.edit.JsFunction_AfterDocumentSaved = "saveWord()";
                    this.bindEvent();
                },
                bindEvent: function () {
                    var that = this;
                    $('#textarea-shade, #select-shade, #select0-shade').click(function (e) {
                        that.myFocus($(e.target));
                    });
                    $('#select-comment').change(function () {
                        $(this).siblings('textarea').val(this.value);
                    });
                    $('#mark-sure').click(function () {
                        that.edit.WebSave();
                    });
                },
                sendMark: function () {
                    var mark = $('#select-mark').val(),
                            comment = $('#work-comment').val();
                    $.ajax({
                        type: 'post',
                        url: 'http://localhost:8080/mvnhk/homework/markHomework',
                        data: {hwId: this.hwId, mark: mark, comment: comment},
                        dataType: 'json',
                        success: function (data) {
                            console.log(data);
                            if(confirm('批改成功！点击确认关闭窗口。'))
                                window.close();
                        },
                        error: function () {

                        }
                    });
                },
                myFocus: function ($el) {
                    $el.prev().focus();
                    $el.remove();
                },
                saveWord: function () {
                    // 保存文档成功后再发送教师评分
                    if(this.edit.CustomSaveResult == 'success')
                        this.sendMark();
                    else
                        alert('保存文档失败，请检查您的网络问题！');
                }
            };
            function saveWord () {
                editWork.saveWord();
            }
            editWork.init();
        </script>
    </body>
</html>

