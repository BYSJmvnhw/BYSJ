package org.demo.controller;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.demo.model.HwUser;
import org.demo.service.ICourseService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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
     * 根据学年，学期和登录教师获取任教课程的邮箱。
     * @param startYear 学年
     * @param schoolTerm 学期
     * @return
     */
    //邮箱设置返回课程名和邮箱的接口
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
     * @return
     */
    @RequestMapping(value = "/updateEmail", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject updateEmail(Integer ctId, String email) {
        return courseService.updateEmail(email, ctId);
    }

    /**
     * 第一次
     * @param ctId 授课关系id
     * @param email 新邮箱
     * @param checkNumber 验证码
     * @return
     */
    @RequestMapping(value = "/checkEmail", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject checkEmail(Integer ctId, String email, String checkNumber) {
        return courseService.updateAndcheckEmail(ctId, email, checkNumber);
    }

    /**
     * 根据各种条件筛选课程
     * @param campusId 校区id
     * @param collegeId 学院id
     * @param majorId 专业id
     * @param courseName 课程名
     * @return
     */
    @RequestMapping("/searchCourse")
    @ResponseBody
    public Object searchCourse(Integer campusId, Integer collegeId, Integer majorId, String courseNo, String courseName) {
        try {
            return courseService.searchCourse(campusId, collegeId, majorId, courseNo, courseName);
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
