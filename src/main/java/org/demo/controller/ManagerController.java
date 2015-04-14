package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.HwUser;
import org.demo.tool.Page;
import org.demo.service.*;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * Created by peifeng on 2015/3/15.
 */
@Controller
@RequestMapping("/manager")
public class ManagerController {

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
     *课程管理
     * peieng
     * 2015-3-16
     */
    //获得学校
    @RequestMapping(value="/getCampus",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,Object>> getCampus() {
        return campusService.getAllCampus();
    }
    //增加学校
    @RequestMapping(value="/addCampus",method = RequestMethod.POST)
    @ResponseBody
    public void addCampus(String campusName) {
        campusService.addCampus(campusName);
    }
    //修改学校名
    @RequestMapping(value="/updateCampus",method = RequestMethod.POST)
    @ResponseBody
    public void updateCampus(int campusId,String campusName) {
        campusService.updateCampus(campusId,campusName);
    }
    //获得学院（根据学校）
    @RequestMapping(value="/getCollege",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,Object>> getCollegeByCampus(int campusId) {
        return collegeService.getCollegeByCampus(campusId);
    }
    //增加学院
    @RequestMapping(value="/addCollege",method = RequestMethod.POST)
    @ResponseBody
    public void addCollege(int campusId,String collegeName) {
        collegeService.addCollege(campusId,collegeName);
    }
    //修改学院名和所属学校
    @RequestMapping(value="/updateCollege",method = RequestMethod.POST)
    @ResponseBody
    public void updateCollge(int collegeId,int campusId,String collegeName) {
        collegeService.updateCollege(collegeId, campusId, collegeName);
    }
    //获得专业（根据学院）
    @RequestMapping(value="/getMajor",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,Object>> getMajorByCollege(int collegeId) {
        return majorService.getMajorByCollege(collegeId);
    }
    //增加专业
    @RequestMapping(value="/addMajor",method = RequestMethod.POST)
    @ResponseBody
    public void addMajor(int collegeId,String majorName) {
        majorService.addMajor(collegeId,majorName);
    }
    //修改专业名和所属学院
    @RequestMapping(value="/updateMajor",method = RequestMethod.POST)
    @ResponseBody
    public void updateMajor(int majorId,String majorName,int collegeId) {
        majorService.updateMajor(majorId,majorName,collegeId);
    }
    //获取课程（根据学院）
    @RequestMapping(value="/getCourse",method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,Object>> getCourseByCollege(int collegeId) {
        return courseService.getCourseByCollege(collegeId);
    }
    //增加课程
    @RequestMapping(value="/addCourse",method = RequestMethod.POST)
    @ResponseBody
    public void addCourse(int collegteId,String courseNo,String courseName) {
        courseService.addCourse(collegteId,courseNo,courseName);
    }
    //修改课程名、号和课程所属学院
    @RequestMapping(value="/updateCourse",method = RequestMethod.POST)
    @ResponseBody
    public void updateCourse(int courseId,String courseNo,String courseName,int collegeId) {
        courseService.updateCourse(courseId,courseNo,courseName,collegeId);
    }
}
