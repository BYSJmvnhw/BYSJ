package org.demo.controller;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.demo.model.*;
import org.demo.service.IStudentService;
import org.demo.service.ITeacherService;
import org.demo.tool.ObjectJsonValueProcessor;
import org.demo.tool.UserType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/3/20 0020.
 */
@Controller
@RequestMapping("/user")
public class UserController {

    private IStudentService studentService;
    private ITeacherService teacherService;
    @RequestMapping("/info")
    @ResponseBody
    public JSONObject userInfo(HttpServletRequest request) {

        /**获取登录用户信息*/
        HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
        UserType userType = (UserType)request.getSession().getAttribute("userType");

        JsonConfig userConfig = new JsonConfig();
        userConfig.setExcludes(new String[]{"password","createId",
                "createUsername","createDate", "typeId","hwRoles","deleteFlag"});

        /*JSONArray jsonArray = new JSONArray();
        jsonArray.add(user, userConfig);*/

        /**根据用户类型获取登录学生或者老师的其他个人信息*/
        JSONObject jsonObject;
        if( userType == UserType.STUDENT ) {
            //Object student = request.getSession().getAttribute("loginStudent");
            JsonConfig jsonConfig = new JsonConfig();
            jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler",
                    "hwCourseSelectings", "hwHomeworks", "deleteFlag"});
            jsonConfig.registerJsonValueProcessor(HwMajor.class,
                    new ObjectJsonValueProcessor(new String[]{"name"}, HwMajor.class));
            jsonConfig.registerJsonValueProcessor(HwCollege.class,
                    new ObjectJsonValueProcessor(new String[]{"collegeName"}, HwCollege.class));
            jsonConfig.registerJsonValueProcessor(HwCampus.class,
                    new ObjectJsonValueProcessor(new String[]{"name"},HwCampus.class));
            HwStudent student = studentService.load(user.getTypeId());
            jsonObject = JSONObject.fromObject(student, jsonConfig);
            //jsonArray.add(student, jsonConfig);
        } else{
            JsonConfig jsonConfig = new JsonConfig();
            jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler",
                    "hwHomeworks", "hwCourseTeachings", "deleteFlag"});
            jsonConfig.registerJsonValueProcessor(HwMajor.class,
                    new ObjectJsonValueProcessor(new String[]{"name"}, HwMajor.class));
            jsonConfig.registerJsonValueProcessor(HwCollege.class,
                    new ObjectJsonValueProcessor(new String[]{"collegeName"}, HwCollege.class));
            jsonConfig.registerJsonValueProcessor(HwCampus.class,
                    new ObjectJsonValueProcessor(new String[]{"name"},HwCampus.class));
            HwTeacher teacher = teacherService.load(user.getTypeId());
            jsonObject = JSONObject.fromObject(teacher,jsonConfig);
            //jsonArray.add(teacher, jsonConfig);
        }
        return jsonObject;
        //return  jsonArray;
    }

    public IStudentService getStudentService() {
        return studentService;
    }

    @Resource
    public void setStudentService(IStudentService studentService) {
        this.studentService = studentService;
    }

    public ITeacherService getTeacherService() {
        return teacherService;
    }

    @Resource
    public void setTeacherService(ITeacherService teacherService) {
        this.teacherService = teacherService;
    }
}
