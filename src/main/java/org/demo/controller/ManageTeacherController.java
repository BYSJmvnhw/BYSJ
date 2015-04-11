package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.HwUser;
import org.demo.service.ITeacherService;
import org.demo.tool.Page;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by peifeng on 2015/4/7.
 */
@Controller
@RequestMapping("/manageTeacher")
public class ManageTeacherController {
    private ITeacherService teacherService;
    @Resource
    public void setTeacherService(ITeacherService teacherService) {
        this.teacherService = teacherService;
    }

    private JSONObject jsonresult;

    /*
     * 教师管理
     * peifeng
     * 2015-3-15～16
     */
    //增添教师用户
    //int collegeId,int campusId,String teacherNo,String trueName,String sex,String mobile,String email
    @RequestMapping(value="/addTeacher")
    @ResponseBody
    public JSONObject addTeacher(String jsonObject,HttpServletRequest request) {
        jsonresult = new JSONObject();
        jsonresult.clear();
        JSONObject jo = JSONObject.fromObject(jsonObject);
        HwUser loginUser = (HwUser)request.getSession().getAttribute("loginUser");
        boolean result= teacherService.addTeacher(jo,loginUser);
        jsonresult.put("isSuccess",result);
        return jsonresult;
    }
    //删除教师用户
    @RequestMapping(value="/deleteTeacher")
    @ResponseBody
    public JSONObject deleteTeacher(int tid){
        jsonresult = new JSONObject();
        jsonresult.clear();
        boolean status = teacherService.deleteTeacher(tid);
        jsonresult.put("isSuccess",status);
        return jsonresult;
    }
    //修改教师用户
    //int collegeId,int campusId,int userId,int teacherId,String trueName,String sex,String email
    @RequestMapping(value="/updateTeacher")
    @ResponseBody
    public JSONObject updateTeacher(String jsonObject) {
        jsonresult = new JSONObject();jsonresult.clear();
        JSONObject jo = JSONObject.fromObject(jsonObject);
        boolean result = teacherService.updateTeacher(jo);
        jsonresult.put("isSuccess",result);
        return jsonresult;
    }
    //搜索老师
    @RequestMapping(value="/searchTeacher")
    @ResponseBody
    public Page<ViewTeacher> searchTeacher(Integer campusId, Integer collegeId, Integer majorId, String teacherNo, String name) {
        return teacherService.searchTeacher(campusId,collegeId,majorId,teacherNo,name);
    }
    //为老师添加课程
    @RequestMapping(value="/addCourseForTeacher")
    @ResponseBody
    public JSONObject addCourseForTeacher(int tid,int[] cids,int startYear,int schoolTerm) {
        teacherService.addTeacherSelectCourse(tid,cids,startYear,schoolTerm);
        jsonresult = new JSONObject();jsonresult.clear();
        jsonresult.put("isSuccess",true);
        return jsonresult;
    }
}
