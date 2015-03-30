<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/3/9 0009
  Time: 下午 3:43
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
  <title>My JSP 'editword.jsp' starting page</title>

  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="cache-control" content="no-cache">
  <meta http-equiv="expires" content="0">
  <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
  <meta http-equiv="description" content="This is my page">
  <!--
  <link rel="stylesheet" type="text/css" href="styles.css">
  -->

</head>

<body>
<!--**************   卓正 PageOffice 客户端代码开始    ************************-->
<script language="javascript" type="text/javascript">
  function SaveDocument() {
    document.getElementById("PageOfficeCtrl1").WebSave();
   console.log(document.getElementById("PageOfficeCtrl1").CustomSaveResult);
  }
  function ShowPrintDlg() {
    document.getElementById("PageOfficeCtrl1").ShowDialog(4);
  }
  function SetFullScreen() {
    document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
  }
  function AddSeal() {
    document.getElementById("PageOfficeCtrl1").ZoomSeal.AddSeal();
  }
  function AddHandSign() {
    document.getElementById("PageOfficeCtrl1").ZoomSeal.AddHandSign();
  }
  function VerifySeal() {
    try
    {
      document.getElementById("PageOfficeCtrl1").ZoomSeal.VerifySeal();
    }
    catch(e)
    {
    }
  }
  function ShowPageOfficeName() {
    alert(document.getElementById("PageOfficeCtrl1").Caption);//显示PageOffice标题
  }
  //document.getElementById("PageOfficeCtrl1").JsFunction_AfterDocumentSaved = "aaa()";
  function aaa(){
    alert("!!!");
  }
</script>
<!--**************   卓正 PageOffice 客户端代码结束    ************************-->
<div style="width:80%; height:600px;">
  <po:PageOfficeCtrl id="PageOfficeCtrl1" />
</div>
</body>
</html>

