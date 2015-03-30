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
<form action="addHomeworkInfo" method="post">
  <br/><br/>

  <input type="text" name="title"> <br/><br/>
  <input type="text" name="hwDesc"><br/><br/>
  <input type="text" name="deadline"><br/><br/>
  <input type="text" name=""><br/><br/>
  <%--<input type="submit" value="tiao"/>--%>
</form>
  <button  id="b1" value="提交" >提交</button>

<script>
    $("#b1").click(function(){
      alert("hahahah");
      $.ajax({

        type: 'POST',
        url: 'addHomeworkInfo',
/*        data: JSON.stringify(
         {
         title: "title1",
         email: "email",
         hwDesc: "hwDesc",

         courseName:"courseName",
         deadline: Date.parse(new Date()),
         createDate: Date.parse(new Date())
         }
         ),*/
        data: {
          jsonObject: JSON.stringify(
              {
                  title: "123",
                  hwDesc: "表示表示",
                  deadline: Date.parse(new Date()),
                  email: "623487211@qq.com",
                  courseName: "courseName",
                  cid: 1
              }
          )
        },
          //contentType: "application/json; charset=utf-8",
         //dataType: "json",
        success: function(result){
            alert( result );
            console.log(result);
            location.href = result;
        },
        error: function (e,r) {
          console.log(r);
        }
      });
    });
</script>
</body>
</html>
