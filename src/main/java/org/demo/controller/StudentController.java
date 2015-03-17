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

    private ICourseSelectingService courseSelectingService;
    private ICourseTeachingService courseTeachingService;
    private IHomeworkInfoService homeworkInfoService;
    private IHomeworkService homeworkService;
    private ICollegeService collegeService;
    private IMajorService majorService;
    private IStudentService studentService;
    private IUserService userService;
    /**
     *
     * @param //cid 教师授课关系 courseTeaching id
     * @return 学生选课关系json分页，包含学生信息
     */
    @RequestMapping(value = "/studentList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject studentList(Integer cid) {
        Page<HwCourseSelecting> cs = courseSelectingService.selectingCoursePage(cid);
        JsonConfig jsonConfig = new JsonConfig();
        /**过滤简单属性*/
        jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler"/*"hwCourseTeaching",*//*",hwStudent"*/});
        /**过滤复杂属性 hwStudent*/
        jsonConfig.registerJsonValueProcessor(HwStudent.class,
                new ObjectJsonValueProcessor(new  String[] {"id","studentNo","name"},
                        HwStudent.class));
        /**过滤复杂属性 hwCourseTeaching*/
        jsonConfig.registerJsonValueProcessor(HwCourseTeaching.class,
                new ObjectJsonValueProcessor(new  String[] {"id"},
                        HwCourseTeaching.class));
        return JSONObject.fromObject(cs, jsonConfig);
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
        JsonConfig jsonConfig = new JsonConfig();
        /**过滤简单属性*/
        jsonConfig.setExcludes(new String[] {"hibernateLazyInitializer", "handler","hwCourse","hwStudent",
                "hwTeacher","hwHomeworkInfo"});
        /**过滤复杂属性 hwHomeworkInfo*/
        jsonConfig.registerJsonValueProcessor(HwHomeworkInfo.class,
                new ObjectJsonValueProcessor(new String[]{"id","title","deadline","createDate","overtime"}, HwHomework.class));
        /**自解析Timestamp属性，避免JsonObject自动解析 */
        jsonConfig.registerJsonValueProcessor(Timestamp.class,new DateJsonValueProcessor("yyyy-MM-dd"));
        //System.out.println(JSONObject.fromObject(homeworkService.homeworkPage(cid, sid),jsonConfig));
        return JSONObject.fromObject(homeworkService.homeworkPage(cid, sid),jsonConfig);
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
        if( createUser == null) {
            String result = "{'result':'请先登录'}";
            return JSONObject.fromObject(result);
        }

        JSONObject jo = JSONObject.fromObject(jsonObject);
        HwStudent st = studentService.findStudent(jo.getString("studentNo"));
        if( st != null) {
            String result = "{'result':'该学生已存在'}";
            return JSONObject.fromObject(result);
        }

        HwStudent student = new HwStudent();
        student.setStudentNo(jo.getString("studentNo"));
        student.setName(jo.getString("name"));
        student.setSex(jo.getString("sex"));
        student.setClass_(jo.getString("cla"));
        //student.setEmail(jo.getString("email"));
        student.setGrade(jo.getString("grade"));
        student.setHwCollege(collegeService.load(jo.getInt("collegeId")));
        student.setHwMajor(majorService.load(jo.getInt("majorId")));
        student.setDeleteFlag(false);
        studentService.add(student);

        HwUser user = new HwUser();
        user.setUsername(jo.getString("studentNo"));
        user.setPassword(jo.getString("studentNo"));
        user.setTrueName(jo.getString("name"));
        //user.setSex(jo.getString("sex"));
        user.setCreateDate(new java.sql.Timestamp(System.currentTimeMillis()));
        user.setUserType(UserType.STUDENT);
        user.setTypeId(student.getId());
        user.setCreateId(createUser.getId());
        user.setCreateUsername(createUser.getUsername());
        user.setDeleteFlag(false);
        userService.add(user);
        String result = "{'result':'success'}";
        return JSONObject.fromObject(result);
    }

    @RequestMapping("/deleteStudent")
    @ResponseBody
    public JSONObject deleteStudent(Integer id) {
        studentService.deleteStudnet(id);
        String result = "{'result' : '添加删除标记成功'}";
        return JSONObject.fromObject(result);
    }



    public ICourseSelectingService getCourseSelectingService() {
        return courseSelectingService;
    }

    @Resource
    public void setCourseSelectingService(ICourseSelectingService courseSelectingService) {
        this.courseSelectingService = courseSelectingService;
    }

    public ICourseTeachingService getCourseTeachingService() {
        return courseTeachingService;
    }

    @Resource
    public void setCourseTeachingService(ICourseTeachingService courseTeachingService) {
        this.courseTeachingService = courseTeachingService;
    }

    public IHomeworkInfoService getHomeworkInfoService() {
        return homeworkInfoService;
    }

    @Resource
    public void setHomeworkInfoService(IHomeworkInfoService homeworkInfoService) {
        this.homeworkInfoService = homeworkInfoService;
    }

    public IHomeworkService getHomeworkService() {
        return homeworkService;
    }

    @Resource
    public void setHomeworkService(IHomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }

    public ICollegeService getCollegeService() {
        return collegeService;
    }

    @Resource
    public void setCollegeService(ICollegeService collegeService) {
        this.collegeService = collegeService;
    }

    public IMajorService getMajorService() {
        return majorService;
    }

    @Resource
    public void setMajorService(IMajorService majorService) {
        this.majorService = majorService;
    }

    public IStudentService getStudentService() {
        return studentService;
    }

    @Resource
    public void setStudentService(IStudentService studentService) {
        this.studentService = studentService;
    }

    public IUserService getUserService() {
        return userService;
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }
}
