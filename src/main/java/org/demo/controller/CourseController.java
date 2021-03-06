package org.demo.controller;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwUser;
import org.demo.service.ICourseService;
import org.demo.tool.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.persistence.OneToMany;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by jzchen on 2015/3/27 0027.
 */
@Controller
@RequestMapping("/course")
public class CourseController {

    private ICourseService courseService;

    /**
     * 根据学年，学期和登录教师获取任教课程的课程名和邮箱。
     * @param startYear 学年
     * @param schoolTerm 学期
     * @return 失败{"status","fail"}
     */
    //邮箱设置返回
    @RequestMapping(value = "/email", method = RequestMethod.GET)
    @ResponseBody
    public Object email(Integer startYear, Integer schoolTerm, HttpServletRequest request){
        HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
        try{
            return JSONArray.fromObject(courseService.emailList(startYear, schoolTerm, user));
        } catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 第一次请求更改邮箱，若邮箱已经验证，则直接修改成功
     * 若邮箱未验证，将返回提示信息
     * @param ctId 授课关系id
     * @param email 新邮箱
     * @param password 邮箱密码
     * @return 成功{"status","success"} 失败{"status","fail"}
     */
    @RequestMapping(value = "/updateEmail", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject updateEmail(Integer ctId, String email, String password) {
        try {
            return courseService.updateEmail(email, password, ctId);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 验证邮箱的接口，
     * @param ctId 授课关系id
     * @param email 新邮箱
     * @param password 邮箱密码
     * @param checkNumber 验证码
     * @return
     */
    @RequestMapping(value = "/checkEmail", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject checkEmail(Integer ctId, String email, String password, String checkNumber) {
        try {
            return courseService.updateAndcheckEmail(ctId, email, password, checkNumber);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据各种条件筛选课程
     * @param campusId 校区id
     * @param collegeId 学院id
     * @param majorId 专业id
     * @param courseNo 课程号
     * @param courseName 课程名
     * @return
     */
    @RequestMapping(value = "/searchCourse", method = RequestMethod.GET)
    @ResponseBody
    public Object searchCourse(Integer campusId, Integer collegeId, Integer majorId, String courseNo, String courseName) {
        try {
            return courseService.searchCourse(campusId, collegeId, majorId, courseNo, courseName);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 管理员接口
     * 根据参数增加课程
     * @param campusId 校区id
     * @param collegeId 学院id
     * @param majorId 专业id
     * @param courseNo 课程编号
     * @param courseName 课程名
     * @return
     */
    @RequestMapping(value = "/addCourse", method = RequestMethod.POST)
    @ResponseBody
    public Object addCourse(Integer campusId, Integer collegeId, Integer majorId, String courseNo, String courseName){
        try {
            return courseService.addCourse(campusId ,collegeId, majorId, courseNo, courseName);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 管理员接口
     * 根据课程id将课程标记为删除
     * @param courseId 课程id
     * @return
     */
    @RequestMapping(value = "/deleteCourse", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject deleteCourse(Integer courseId){
        try{
            courseService.deleteCourse(courseId);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据课程id查看课程详细信息
     * @param courseId 课程id
     * @return
     */
    @RequestMapping(value = "/courseDetail",method = RequestMethod.GET)
    @ResponseBody
    public Object courseDetail(Integer courseId){
        try {
            return courseService.courseDetail(courseId);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 更新课程信息（不可更改课程课程号，若需要修改课程号，需要删除后再添加）
     * @param courseId 课程id
     * @param campusId 校区id
     * @param collegeId 学院id
     * @param majorId 专业id
     * @param courseName 课程名
     * @return
     */
    @RequestMapping(value = "/updateCourse", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject updateCourse(Integer courseId, Integer campusId, Integer collegeId, Integer majorId, String courseName){
        try{
            courseService.updateCourse(courseId, campusId, collegeId, majorId, courseName);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }
    //------------------------------------- 管理员教师部分 --------------------------------------------

    /**
     * 管理员接口
     * 根据课程id，学年，学期查询任教该课程的教师列表
     * @param courseId 课程id
     * @param startYear 学年
     * @param schoolTerm 学期
     * @return
     */
    @RequestMapping(value = "/teacherList", method = RequestMethod.GET)
    @ResponseBody
    public Object courseTeachingList(Integer courseId, Integer startYear, Integer schoolTerm){
        try{
            return courseService.courseTeachingList(courseId, startYear, schoolTerm );
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    //搜索教师接口 采用 peifeng 的
    //搜索教师接口 采用 peifeng 的
    //搜索教师接口 采用 peifeng 的
    //搜索教师接口 采用 peifeng 的
    //搜索教师接口 采用 peifeng 的


    /**
     * 根据课程id，和教师id数组为教师增加授课关系
     * @param courseId 课程id
     * @param teacherId 教师id数组
     * @param startYear 学年
     * @param schoolTerm 学期
     * @return
     */
    @RequestMapping(value = "/addCourseTeaching", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addCourseTeaching(Integer courseId, @RequestParam("teacherId[]")Integer[] teacherId,
                                        Integer startYear, Integer schoolTerm){
        try {
            courseService.addCourseTeaching(courseId,teacherId, startYear, schoolTerm);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据授课关系id删除对应的授课关系
     * @param ctId 授课关系id
     * @return
     */
    @RequestMapping(value = "/deleteCourseTeaching",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject deleteCourseTeaching(Integer ctId){
        try {
            courseService.deleteCourseTeaching(ctId);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    //------------------------------------- 管理员学生部分 --------------------------------------------


    /**
     *
     * @param campusId 校区id
     * @param collegeId 学院id
     * @param majorId 专业id
     * @param startYear 学年
     * @param schoolTerm 学期
     * @param teacherNo 教师号
     * @param teacherName 教师名
     * @param courseNo 课程号
     * @param courseName 课程名
     * @return
     */
    @RequestMapping(value = "/courseTeachingList",method = RequestMethod.GET)
    @ResponseBody
    public Object courseTeachingList(Integer campusId, Integer collegeId, Integer majorId,
            Integer startYear, Integer schoolTerm, String teacherNo, String teacherName, String courseNo, String courseName){
        try {
            return courseService.searchCourseTeaching(campusId, collegeId, majorId, startYear, schoolTerm,
                    teacherNo, teacherName, courseNo, courseName);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据授课id查询选修该课程的学生列表
     * @param ctId 授课关系id
     * @return
     */
    @RequestMapping(value = "/studentList", method = RequestMethod.GET)
    @ResponseBody
    public Object studentList(Integer ctId){
        try{
            return courseService.studentList(ctId);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据选课关系id，删除对应的选课关系
     * @param csId 选课关系id
     * @return
     */
    @RequestMapping(value = "/deleteCourseSelecting",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject deleteCourseSelecting(Integer csId){
        try {
            courseService.deleteCourseSelecting(csId);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据课程id，学年，学期搜索对应的任教关系，供管理员为学生选课用
     * @param courseId 课程id
     * @param startYear 学年
     * @param schoolTerm 学期
     * @return
     */
    @RequestMapping(value = "/searchCourseTeaching", method = RequestMethod.GET)
    @ResponseBody
    public Object searchCourseTeaching(Integer courseId, Integer startYear, Integer schoolTerm){
        try{
            return courseService.searchCourseTeaching(courseId, startYear, schoolTerm);
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据学生id，教师授课关系id数组，为学生增加选课关系
     * @param sId 学生id数组
     * @param ctId 任教关系
     */
    @RequestMapping(value = "/addCourseSelecting", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject addCourseSelecting(Integer ctId, @RequestParam("sId[]")Integer[] sId) {
        try {
            courseService.addCourseSelecting(ctId, sId);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    public ICourseService getCourseService() {
        return courseService;
    }

    @Resource
    public void setCourseService(ICourseService courseService) {
        this.courseService = courseService;
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
