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

    /*** 用于解决Jsonp跨域问题*/
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
     *  根据教师授课关系id返回选课学生列表的接口
     * @param ctId 教师授课关系 courseTeaching id
     * @return 学生选课关系json分页，包含学生信息
     */
    @RequestMapping(value = "/studentList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject studentList(Integer ctId) {
        try{
            return studentService.studentPageByCTId(ctId);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
}

    /**
     *  根据受授课关系id和学生id，返回选课学生的所有作业列表的接口
     * @param ctId 授课关系 courseTeaching id
     * @param sId 学生 id
     * @return
     */
    @RequestMapping(value = "/homeworkList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject homeworkInfoList(Integer ctId, Integer sId) {
        try{
            return homeworkService.homeworkPage(ctId, sId);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据学生id返回学生详细信息
     * @param sId 学生id
     * @return
     */
    @RequestMapping(value = "/studentDetail", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject studentDetail(Integer sId) {
        try {
            return studentService.studentDetail(sId);
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据授课关系id和学生id，为课程补选学生。
     * @param ctId 授课关系id
     * @param sId 学生关系id
     */
    @RequestMapping("/appendStudent")
    @ResponseBody
    public JSONObject appendStudent(Integer ctId, Integer sId) {
        try {
            studentService.addStudent(ctId, sId);
            return getSuccessResultJsonObject();
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
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

    @RequestMapping(value = "/deleteStudent", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject deleteStudent(Integer sid) {
        studentService.deleteStudnetAndUser(sid);
        String result = "{'result' : '添加删除标记成功'}";
        return JSONObject.fromObject(result);
    }

    @RequestMapping(value = "/updateStudent", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject updateStudent(String json) {
        studentService.updateStudnetAndUser(json);
        String result = "{'result' : '更新学生信息成功'}";
        return JSONObject.fromObject(result);
    }

    @RequestMapping(value = "/addCourseSelecting", method = RequestMethod.GET)
    public String addCourseSelecting() {
        return "student/addCourseSelecting";
    }

    @RequestMapping(value = "/addCourseSelecting", method = RequestMethod.POST)
    @ResponseBody
     public JSONObject addCourseSelecting(String json) {
         studentService.addCourseSelecting(json);
         String result = "{'result' : 'chenggong'}";
         return JSONObject.fromObject(result);
     }

    @RequestMapping(value = "/searchStudent", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject searchStudent(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name) {
        try{
            return studentService.studentPage(campusId, collegeId, majorId, studentNo, name);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
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

    private JSONObject getFailResultJsonObject(){
        JSONObject result = new JSONObject();
        result.put("status","fail");
        return result;
    }
    private JSONObject getSuccessResultJsonObject(){
        JSONObject result = new JSONObject();
        result.put("status","success");
        return result;
    }
}
