package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.*;
//import org.demo.service.IRoleService;
import org.demo.service.ILoginService;
import org.demo.service.IStudentService;
import org.demo.service.ITeacherService;
import org.demo.service.IUserService;
import org.demo.tool.UserType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Set;

/**
 * Created by jzchen on 2015/1/25.
 */

@Controller
@RequestMapping("/login")
public class LoginController {

    private IUserService userService;
    private IStudentService studentService;
    private ITeacherService teacherService;
    private ILoginService loginService;
    /*  枚举用户类型 */

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject logout(HttpServletRequest request) {
        JSONObject result = new JSONObject();
        try{
            request.getSession().removeAttribute("urlList");
            request.getSession().removeAttribute("loginUser");
            request.getSession().removeAttribute("userType");
            request.getSession().removeAttribute("roleList");
            result.put("msg","success");
            return result;
        }catch (Exception e) {
            result.put("msg","fail");
            return result;
        }
    }

    @RequestMapping( value = "/loginInput", method = RequestMethod.GET)
    public String login() {
        //System.out.println("enter login_page!");
        return "login/loginInput";
    }

/*    @RequestMapping( value = "/login", method = RequestMethod.POST)
    public String login(String username, String password, Model model, HttpServletRequest request) {
        if( loginService.login(username,password,request) ) {
            model.addAttribute("msg","成功");
        } else {
            model.addAttribute("msg","失败");
        }
        return "login/welcome";
    }*/

    @RequestMapping( value = "/logincheck", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject login(String username, String password,HttpServletRequest request) {
        JSONObject jsonObject = new JSONObject();
        if( loginService.login(username,password,request) ) {
            jsonObject.put("msg","success");
            jsonObject.put("userType",request.getSession().getAttribute("userType"));
            jsonObject.put("trueName",((HwUser)request.getSession().getAttribute("loginUser")).getTrueName());
            System.out.println(request.getSession().getAttribute("userType"));
            return jsonObject;
        }else {
            jsonObject.put("msg","fail");
            return jsonObject;
        }
    }

    public IUserService getUserService() {
        return userService;
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
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

    public ILoginService getLoginService() {
        return loginService;
    }

    @Resource
    public void setLoginService(ILoginService loginService) {
        this.loginService = loginService;
    }
}
