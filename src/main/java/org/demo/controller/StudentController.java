package org.demo.controller;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import org.demo.model.*;
import org.demo.service.*;
import org.demo.tool.DateJsonValueProcessor;
import org.demo.tool.ObjectJsonValueProcessor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.AbstractJsonpResponseBodyAdvice;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;

/**
 * Created by jzchen on 2015/3/12 0012.
 */
@Controller
@RequestMapping("/student")
public class StudentController {
    /**
     * 用于解决Jsonp跨域问题
     */
    @ControllerAdvice
    private static class JsonpAdvice extends AbstractJsonpResponseBodyAdvice {
        public JsonpAdvice() {
            super("callback");
        }
    }

    private IHomeworkService homeworkService;
    private IStudentService studentService;
    //private IUserService userService;
    /**
     *
     * @param //cid 教师授课关系 courseTeaching id
     * @return 学生选课关系json分页，包含学生信息
     */
    @RequestMapping(value = "/studentList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject studentList(Integer cid) {
        return studentService.studentPage(cid);
}

    /**
     *
     * @param cid 授课关系 courseTeaching id
     * @param sid 学生 id
     * @return
     */
    @RequestMapping(value = "/homeworkInfoList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject homeworkInfoList(Integer cid, Integer sid) {
        return homeworkService.homeworkPage(cid, sid);
    }


    /********************************* 管理员功能 ***********************************
     *
     * @return
     */
    @RequestMapping(value = "/addStudent", method = RequestMethod.GET)
    public String addStudent() {
        return "student/addStudent";
    }

    @RequestMapping(value = "/addStudent", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addStudent( String jsonObject, HttpServletRequest request) {
        /**判登录*/
        HwUser createUser =  ((HwUser)request.getSession().getAttribute("loginUser"));
        JSONObject jo = JSONObject.fromObject(jsonObject);
        HwStudent st = studentService.findStudent(jo.getString("studentNo"));
        if( st != null) {
            String result = "{'result':'该学生已存在'}";
            return JSONObject.fromObject(result);
        }
        studentService.addStrdentAndUser(jo, createUser);
        String result = "{'result':'添加学生成功'}";
        return JSONObject.fromObject(result);
    }

    @RequestMapping("/deleteStudent")
    @ResponseBody
    public JSONObject deleteStudent(Integer sid) {
        studentService.deleteStudnetAndUser(sid);
        String result = "{'result' : '添加删除标记成功'}";
        return JSONObject.fromObject(result);
    }

    public IHomeworkService getHomeworkService() {
        return homeworkService;
    }

    @Resource
    public void setHomeworkService(IHomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }

    public IStudentService getStudentService() {
        return studentService;
    }

    @Resource
    public void setStudentService(IStudentService studentService) {
        this.studentService = studentService;
    }

/*    public IUserService getUserService() {
        return userService;
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }*/
}
