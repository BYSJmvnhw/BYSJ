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

    //邮箱设置返回课程名和邮箱的接口
    @RequestMapping(value = "/email", method = RequestMethod.GET)
    @ResponseBody
    public Object email(Integer startYear, Integer schoolTerm, HttpServletRequest request){
        HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
        try{
            return JSONArray.fromObject(courseService.emailList(startYear, schoolTerm, user));
        } catch (Exception e){
            e.printStackTrace();
            JSONObject result = new JSONObject();
            result.put("msg","fail");
            return result;
        }
    }

    @RequestMapping("/updateEmail")
    @ResponseBody
    public JSONObject updateEmail(Integer ctId, String email) {
        return courseService.updateEmail(email, ctId);
    }

    @RequestMapping("/checkEmail")
    @ResponseBody
    public JSONObject checkEmail(Integer ctId, String email, String checkNumber) {
        return courseService.updateAndcheckEmail(ctId, email, checkNumber);
    }

    public ICourseService getCourseService() {
        return courseService;
    }

    @Resource
    public void setCourseService(ICourseService courseService) {
        this.courseService = courseService;
    }
}
