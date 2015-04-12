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
import org.springframework.web.bind.annotation.*;
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
    private ICollegeService collegeService;
    private ICourseService courseService;
    private IMajorService majorService;
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
    public Object homeworkInfoList(Integer ctId, Integer sId) {
        try{
            return homeworkService.homeworkList(ctId, sId);
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
    @RequestMapping(value = "/appendStudent",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject appendStudent(Integer ctId, @RequestParam("sId[]") Integer[] sId) {
        try {
            studentService.addStudent(ctId, sId);
            return getSuccessResultJsonObject();
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据校区id，学院id，专业id，学生学号关键字，学生姓名关键字搜索学生列表
     * @param campusId 校区id
     * @param collegeId 学院id
     * @param majorId 专业id
     * @param studentNo 学生学号关键字
     * @param name 学生姓名关键字
     * @return
     */
    @RequestMapping(value = "/searchStudent", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject searchStudent(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name, String grade) {
        try{
            return studentService.searchStudent(campusId, collegeId, majorId, studentNo, name, grade);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    ///////////////////////////////////////管理员功能///////////////////////////////////////


    @RequestMapping(value = "/addStudent", method = RequestMethod.GET)
    public String addStudent() {
        return "student/addStudent";
    }

    /**
     * 管理员添加学生
     * @param jsonObject 前端学生基本数据序列化成的字符串
     * @param request HttpServletRequest 获取当前登录管理员，用于 createId
     * @return JsonObject 结果
     */
    @RequestMapping(value = "/addStudent", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addStudent(String jsonObject, HttpServletRequest request) {
        try {
            //获取的当前登录用户
            HwUser createUser =  ((HwUser)request.getSession().getAttribute("loginUser"));
            JSONObject jo = JSONObject.fromObject(jsonObject);
            return studentService.addStrdentAndUser(jo, createUser);
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 管理员删除学生
     * @param sId 欲删除的学生id
     */
    @RequestMapping(value = "/deleteStudent", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject deleteStudent(Integer sId) {
        try {
            studentService.deleteStudnetAndUser(sId);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 更新学生以及对应用户信息的接口
     * @param jsonObject 前端学生基本数据序列化成的字符串
     */
    @RequestMapping(value = "/updateStudent", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject updateStudent(String jsonObject) {
        try {
            studentService.updateStudnetAndUser(jsonObject);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据学生id，学年，学期查看该生所选课程
     * @param studentId 学生id
     * @param startYear 学年
     * @param schoolTerm 学期
     * @return
     */
    @RequestMapping(value = "/courseList", method = RequestMethod.GET)
    @ResponseBody
    public Object courseSelectingList(Integer studentId, Integer startYear, Integer schoolTerm){
        try{
            return courseService.courseList(studentId, startYear, schoolTerm);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据各种条件筛选授课关系
     * @param campusId 校区id
     * @param collegeId 学院id
     * @param majorId 专业id
     * @param startYear 年份
     * @param schoolTerm 学期
     * @param courseName 课程名
     * @param teacherName 教师id
     * @return
     */
    @RequestMapping("/searchCourseTeaching")
    @ResponseBody
    public Object searchCourseTeaching(Integer campusId, Integer collegeId, Integer majorId,
                                       Integer startYear, Integer schoolTerm, String courseName, String teacherName) {
        try {
            return courseService.searchCourseTeaching(campusId, collegeId, majorId, startYear, schoolTerm, courseName, teacherName);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

//    @RequestMapping(value = "/addCourseSelecting", method = RequestMethod.GET)
//    public String addCourseSelecting() {
//        return "student/addCourseSelecting";
//    }

    /**
     * 根据学生id，授课关系id数组，为学生增加选课关系
     * @param sId 学生id
     * @param ctId 授课关系id数组
     * @return
     */
    @RequestMapping(value = "/addCourseSelecting", method = RequestMethod.POST)
    @ResponseBody
     public JSONObject addCourseSelecting(Integer sId, @RequestParam("ctId[]") Integer[] ctId) {
         try {
             studentService.addCourseSelecting(sId, ctId);
             return getSuccessResultJsonObject();
         }catch (Exception e){
             e.printStackTrace();
             return getFailResultJsonObject();
         }
     }



    /**
     * 获取每个校区  所有学院组成的数组
     * @return
     */
    @RequestMapping("/collegeList")
    @ResponseBody
    public Object collegeList(){
        try{
            return collegeService.allCollege();
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据学院id 获取 专业列表
     * @param collegeId 学院id
     * @return
     */
    @RequestMapping("/majorList")
    @ResponseBody
    public Object majorList(Integer collegeId){
        try{
            return majorService.getMajorByCollege(collegeId);
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

    public ICollegeService getCollegeService() {
        return collegeService;
    }

    @Resource
    public void setCollegeService(ICollegeService collegeService) {
        this.collegeService = collegeService;
    }

    public ICourseService getCourseService() {
        return courseService;
    }

    @Resource
    public void setCourseService(ICourseService courseService) {
        this.courseService = courseService;
    }

    public IMajorService getMajorService() {
        return majorService;
    }

    @Resource
    public void setMajorService(IMajorService majorService) {
        this.majorService = majorService;
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
