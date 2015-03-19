package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.HwUser;
import org.demo.tool.Page;
import org.demo.service.*;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * Created by peifeng on 2015/3/15.
 */
@Controller
public class ManagerController {

    private JSONObject jsonresult;

    private ITeacherService teacherService;
    @Resource
    public void setTeacherService(ITeacherService teacherService) {
        this.teacherService = teacherService;
    }
    private ICampusService campusService;
    @Resource
    public void setCampusService(ICampusService campusService) {
        this.campusService = campusService;
    }
    private ICollegeService collegeService;
    @Resource
    public void setCollegeService(ICollegeService collegeService) {
        this.collegeService = collegeService;
    }
    private IMajorService majorService;
    @Resource
    public void setMajorService(IMajorService majorService) {
        this.majorService = majorService;
    }
    private ICourseService courseService;
    @Resource
    public void setCourseService(ICourseService courseService) {
        this.courseService = courseService;
    }


    /*
     * 教师管理
     * peifeng
     * 2015-3-15～16
     */
    //增添教师用户
    @RequestMapping(value="/addTeacher")
    @ResponseBody
    public JSONObject addTeacher(int collegeId,int majorId,String teacherNo,String trueName,String sex,String mobile,String email,HttpServletRequest request) {
        jsonresult = new JSONObject();
        jsonresult.clear();
        if(collegeId == 0 || majorId == 0 || teacherNo == null || teacherNo.isEmpty() || trueName == null || trueName.isEmpty()){
            jsonresult.put("isSuccess",false);jsonresult.put("message","信息不全");
            return jsonresult;
        }
        HwUser loginUser = (HwUser)request.getSession().getAttribute("loginUser");
        if(loginUser == null) {
            jsonresult.put("isSuccess",false);jsonresult.put("message","没有登录");
            return jsonresult;
        }
        int createId = loginUser.getId();
        String createName = loginUser.getTrueName();
        boolean result = teacherService.addTeacher(collegeId, majorId, teacherNo, trueName, sex, mobile, email, createId, createName);
        if(result == true) {
            jsonresult.put("isSuccess",result);jsonresult.put("message","添加成功");
        }else {
            jsonresult.put("isSuccess",result);jsonresult.put("message","添加失败");
        }
        return jsonresult;
    }
    //删除教师用户
    //分页查询教师用户（不分学院与专业）
    @RequestMapping(value="/getTeachers")
    @ResponseBody
    public Page<ViewTeacher> getTeachers() {
        Page<ViewTeacher> teacherList = teacherService.findTeacherList();
        return teacherList;
    }
    //修改教师用户
    @RequestMapping(value="/updateTeacher")
    @ResponseBody
    public JSONObject updateTeacher(int collegeId,int majorId,int userId,int teacherId,String trueName,String sex,String email) {
        jsonresult = new JSONObject();
        if(collegeId == 0 || majorId == 0 || userId == 0 || teacherId == 0 || trueName == null || trueName.isEmpty()){
            jsonresult.put("isSuccess",false);jsonresult.put("message","信息不全");
            return jsonresult;
        }
        boolean result = teacherService.updateTeacher(collegeId, majorId, userId, teacherId, trueName, sex, email);
        if(result == true) {
            jsonresult.put("isSuccess",result);jsonresult.put("message","修改成功");
        }else {
            jsonresult.put("isSuccess",result);jsonresult.put("message","修改失败");
        }
        return jsonresult;
    }
    //分页查询教师用户（按学院）
    @RequestMapping(value="/getTeachersByCollege")
    @ResponseBody
    public Page<ViewTeacher> getTeachersByCollege(Integer collegeId) {
        Page<ViewTeacher> teachers = teacherService.findTeacherByCollege(collegeId);
        return teachers;
    }
    //分页查询教师用户（按专业）
    @RequestMapping(value="/getTeachersByMajor")
    @ResponseBody
    public Page<ViewTeacher> getTeachersByMajor(Integer majorId) {
        Page<ViewTeacher> teachers = teacherService.findTeacherByMajor(majorId);
        return teachers;
    }
    /*
     *课程管理
     * peieng
     * 2015-3-16
     */
    //获得学校
    @RequestMapping(value="/getCampus")
    @ResponseBody
    public List<Map<String,Object>> getCampus() {
        return campusService.getAllCampus();
    }
    //增加学校
    @RequestMapping(value="/addCampus")
    @ResponseBody
    public void addCampus(String campusName) {
        campusService.addCampus(campusName);
    }
    //修改学校名
    @RequestMapping(value="/updateCampus")
    @ResponseBody
    public void updateCampus(int campusId,String campusName) {
        campusService.updateCampus(campusId,campusName);
    }
    //获得学院（根据学校）
    @RequestMapping(value="/getCollege")
    @ResponseBody
    public List<Map<String,Object>> getCollegeByCampus(int campusId) {
        return collegeService.getCollegeByCampus(campusId);
    }
    //增加学院
    @RequestMapping(value="/addCollege")
    @ResponseBody
    public void addCollege(int campusId,String collegeName) {
        collegeService.addCollege(campusId,collegeName);
    }
    //修改学院名和所属学校
    @RequestMapping(value="/updateCollege")
    @ResponseBody
    public void updateCollge(int collegeId,int campusId,String collegeName) {
        collegeService.updateCollege(collegeId, campusId, collegeName);
    }
    //获得专业（根据学院）
    @RequestMapping(value="/getMajor")
    @ResponseBody
    public List<Map<String,Object>> getMajorByCollege(int collegeId) {
        return majorService.getMajorByCollege(collegeId);
    }
    //增加专业
    @RequestMapping(value="/addMajor")
    @ResponseBody
    public void addMajor(int collegeId,String collegeName) {
        majorService.addMajor(collegeId,collegeName);
    }
    //修改专业名和所属学院
    @RequestMapping(value="/updateMajor")
    @ResponseBody
    public void updateMajor(int majorId,String majorName,int collegeId) {
        majorService.updateMajor(majorId,majorName,collegeId);
    }
    //获取课程（根据学院）
    @RequestMapping(value="/getCourse")
    @ResponseBody
    public List<Map<String,Object>> getCourseByCollege(int collegeId) {
        return courseService.getCourseByCollege(collegeId);
    }
    //增加课程
    @RequestMapping(value="/addCourse")
    @ResponseBody
    public void addCourse(int collegteId,String courseNo,String courseName) {
        courseService.addCourse(collegteId,courseNo,courseName);
    }
    //修改课程名、号和课程所属学院
    @RequestMapping(value="/updateCourse")
    @ResponseBody
    public void updateCourse(int courseId,String courseNo,String courseName,int collegeId) {
        courseService.updateCourse(courseId,courseNo,courseName,collegeId);
    }
}
