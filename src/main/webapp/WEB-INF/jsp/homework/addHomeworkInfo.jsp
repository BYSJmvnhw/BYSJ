<%--
  Created by IntelliJ IDEA.
  User: jzchen
  Date: 2015/2/15 0015
  Time: 下午 9:08
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
  <script src="../resources/jquery-2.1.3.js"></script>
</head>
<body>
<form>
  <br/><br/>

  <input type="text" name="title"> <br/><br/>
  <input type="text" name="hwDesc"><br/><br/>
  <input type="text" name="deadline"><br/><br/>
  <input type="text" name=""><br/><br/>
</form>
  <button  id="b1" value="提交" >提交</button>

<script>
    $("#b1").click(function(){
      alert("hahahah");
      data =$.ajax({
        type: 'POST',
        url: "addHomeworkInfo" ,
        data: {
          //id:4,
          title: "title1",
          //hwDesc: "hwDesc1",
          deadline: Date.parse(new Date()),
            email:"email",
            createDate: Date.parse(new Date()),
            //overtime:false,
          //courseName: "courseName1"

        } ,
          contentType: "application/json; charset=gbk",
          dataType: "json",
        success: function(){
          alert("成功");
        }
      });
    });
</script>
</body>
</html>
