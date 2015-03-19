package org.demo.controller;


import net.sf.json.JSONObject;
import org.demo.model.*;
import org.demo.service.*;
import org.demo.tool.UserType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.AbstractJsonpResponseBodyAdvice;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.SimpleDateFormat;

/**
 * Created by jzchen on 2015/1/25.
 */
@Controller
@RequestMapping("/homework")
public class HomeworkController {
    /**
     * 用于解决Jsonp跨域问题
     */
    @ControllerAdvice
    private static class JsonpAdvice extends AbstractJsonpResponseBodyAdvice {
        public JsonpAdvice() {
            super("callback");
        }
    }

    private String homeworkBaseDir;
    private IHomeworkService homeworkService;
    private IStudentService studentService;

    private SimpleDateFormat sdf = new SimpleDateFormat("YYYY");


    /**************************************************************************************************
     * 请求课程列表jsp页面
     * */
    @RequestMapping(value = "/showCourses", method = RequestMethod.GET)
    public String showCourse() {
        return "homework/showCourses";
    }

    /**
     * 异步请求课程列表分页 json数据
     *
     * @param startYear 选课年份
     * @param schoolTerm 选课学期
     * @param request http请求
     * @return 学生返回选课列表，教师返回授课列表Json分页
     */
    @RequestMapping(value = "/courseList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject courseList(Integer startYear, Integer schoolTerm, HttpServletRequest request) {
        /** 获取用户类型，学生返回选课列表，教师返回授课列表*/
        UserType userType = (UserType) request.getSession().getAttribute("userType");

        /** 学生返回选课列表 */
        if( userType == UserType.STUDENT ) {
            HwStudent student = (HwStudent) request.getSession().getAttribute("loginStudent");
            /**查找选课关系*/
            return homeworkService.courseSelectingPage(student, startYear, schoolTerm);
        }

        /** 教师返回授课列表 */
        else {
            HwTeacher teacher = (HwTeacher)request.getSession().getAttribute("loginTeacher");
            return  homeworkService.courseTeachingPage(teacher, startYear, schoolTerm);
        }
    }

    /************************************************************************************************
     *  请求某一课程已布置作业jsp页面
     * */
    @RequestMapping(value = "/showHomeworkInfo", method = RequestMethod.GET)
    public String showHomeworkInfo() {
        return "homework/showAssignedHomework";
    }

    /**
     * @param cid 教师为授课关系id
     * @param request http请求
     * @return  学生返回布置作业列表，教师返回布置作业列表Json分页
     * */
    @RequestMapping(value = "/homeworkInfoList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject homeworkInfoList(Integer cid, HttpServletRequest request)  {
        return homeworkService.homeworListInfoPage(cid);
    }

    /*************************************************************************************************
     * 请求作业要求详细信息jsp页面
     * */
    @RequestMapping(value = "/showHomeworkInfoDetail", method = RequestMethod.GET)
    public String showHomeworkInfoDetail() {
        return "homework/showHomeworkInfoDetail";
    }
     /**
     *  @param hwInfoId 作业信息 id
     *  @return Json 作业要求详细信息
     * */
    @RequestMapping(value = "/homeworkInfoDetail", method = RequestMethod.GET)
    @ResponseBody
     public JSONObject homeworkInfoDetail(Integer hwInfoId) {
        return homeworkService.homeworkInfoDetail(hwInfoId);
    }

    /*************************************************************************************************
     *  请求某次作所有学生作业jsp页面
     * */

    @RequestMapping(value = "/showHomework",  method = RequestMethod.GET)
    public String showHomework() {
        return "homework/showHomework";
    }

    /**
     * 策略：每次布置信作业都将初始化该次作业的n条记录，url为空，提交作业后在更新url，通过url筛选
     * @param hwInfoId 作业要求 id
     * @param submited 是否已经提交
     * @return Json 某次作业所有学生作业
     * */
    @RequestMapping(value = "/homeworkList",  method = RequestMethod.GET)
    @ResponseBody
    public JSONObject homeworkList(Integer hwInfoId,boolean submited) {
        return homeworkService.submittedHomeworkPage(hwInfoId, submited);
    }
    /**
     * 请求布置作业,添加作业信息 jsp页面
     *
     */
    @RequestMapping(value = "/addHomeworkInfo" ,method = RequestMethod.GET)
    public String addHomeworkInfoPage() {
        return "homework/addHomeworkInfo";
    }

    /**
     * @param jsonObject 封装了参数信息Json字符串
     * 前端必须传递JSON字符串而不能传递JSON对象，SpringMVC注解负责解析字符串
     * */

     @RequestMapping(value = "/addHomeworkInfo", method = RequestMethod.POST)
     @ResponseBody
    public String addHomeworkInfo(String jsonObject, HttpServletRequest request) {

            /** 从Session获取当前登陆用户类型 */
         HwTeacher teacher  = (HwTeacher) request.getSession().getAttribute("loginTeacher");
         if( teacher == null ){
             //登陆类型不是教师或者未登陆，返回登陆页面
             return "../login/loginInput";
         }
        homeworkService.addHomeworkInfo(jsonObject, teacher);
         return "showHomeworkInfoDetail";
    }

    /**
     * 删除了
     * @param id 需要删除的作业信息id
     * */
    @RequestMapping(value = "/deleteHomeworkInfo", method = RequestMethod.GET)
    public String deleteHomeworkInfo(Integer id) {
        homeworkService.deleteHomeworkInfo(id);
        /**同时将级联删除该次作业信息对应的所有学生作业*/
        return "redirect:showHomeworkInfo";
    }

    @RequestMapping(value = "/markHomework", method = RequestMethod.POST)
    public JSONObject markHomework(Integer hwid, String mark, String comment) {
        homeworkService.markHomework(hwid, mark, comment);
        String result = "{'result' : '批改作业成功'}";
        return JSONObject.fromObject(result);
    }

    /**
    *  学生作业上传 Controller
    * */
    @RequestMapping(value = "/upload", method = RequestMethod.GET)
    public String upload() {
        return "homework/upload";
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public String upload(@RequestParam MultipartFile hw, Integer hwinfoId, HttpServletRequest request) throws IOException {
        /**从session中获取当前登录的学生*/
        HwStudent student = (HwStudent) request.getSession().getAttribute("loginStudent");
        if(student == null) {
           return "redirect:/login/loginInput";
        }
        /**备用目录*/
        String backupPath = request.getServletContext().getRealPath("/doc");
        homeworkService.upload(hw, hwinfoId, student, backupPath);
        return "redirect:showHomework";
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
}
