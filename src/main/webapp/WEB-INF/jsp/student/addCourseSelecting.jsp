<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/3/17 0017
  Time: 下午 10:43
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <script src="${pageContext.request.contextPath}/resources/jquery-2.1.3.js"></script>
    <title></title>
</head>
<body>
<label>添加任教关系</label><br/>

<button id="submit" value="提交" >提交</button>

<script>
  $("#submit").click(function(){
    $.ajax({
      method: "POST",
      url: "addCourseSelecting",
      data:{
        json: JSON.stringify(
                [
                  {
                    cid: 10,
                    sid: 13
                  },
                  {
                    cid: 9,
                    sid: 13
                  }
                ]
        )
      },
      success:function(data){
        console.log(data);
      },
      error:function(e){
        console.log(e);
      }
    })
  });
</script>
</body>
</html>
