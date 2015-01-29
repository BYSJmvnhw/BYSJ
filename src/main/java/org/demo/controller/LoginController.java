package org.demo.controller;

import org.demo.model.*;
import org.demo.service.IRoleService;
import org.demo.service.IStudentService;
import org.demo.service.ITeacherService;
import org.demo.service.IUserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
    private IRoleService roleService;
    private IStudentService studentService;
    private ITeacherService teacherService;
    /*  枚举用户类型 */

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpServletRequest request) {
        request.getSession().removeAttribute("loginUser");
        request.getSession().removeAttribute("userType");
        request.getSession().removeAttribute("loginTeacher");
        request.getSession().removeAttribute("loginStudent");
        return "redirect:/login/loginInput";
    }

    @RequestMapping( value = "/loginInput", method = RequestMethod.GET)
    public String login() {
        System.out.println("enter login_page!");
        return "login/loginInput";
    }

    @RequestMapping( value = "/login", method = RequestMethod.POST)
    public String login(String username, String password, Model model, HttpServletRequest request) {
        HwUser user = userService.findUser(username);

        if( user != null ) {
            if( user.getPassword().equals( password) ) {
                /* 在session中存入登录用户 */
                request.getSession().setAttribute("loginUser", user);
                /*  获取角色集合 */
                Set<HwRole> roleSet = user.getHwRoles();
                //System.out.println(roleSet);
                //List<HwRole> roleList = new ArrayList<HwRole>(roleSet);
                /*  判断登录用户类型， */
                UserType userType = UserType.STUDENT;
                for( HwRole r : roleSet) {
                    System.out.println( "进入 for " + r.getRoleName());
                    if ( r.getId().equals(1) )
                        userType = UserType.STUDENT;
                    else
                        userType = UserType.TEACHER;
                }
               if( userType == UserType.TEACHER ) {
                    System.out.println("角色：教师");
                    request.getSession().setAttribute("userType", UserType.TEACHER);
                    HwTeacher teacher = teacherService.findTeacher(user.getUsername());
                    System.out.println(teacher);
                    request.getSession().setAttribute("loginTeacher", teacher);
                }
               else if( userType == UserType.STUDENT ) {
                   System.out.println("角色：学生");
                   request.getSession().setAttribute("userType", UserType.STUDENT);
                   HwStudent student = studentService.findStudent(user.getUsername());
                   System.out.println(student);
                   request.getSession().setAttribute("loginStudent", student);
               }

                model.addAttribute("msg", "登录成功！！！！！！！！！！");
                return "login/welcome";
            }else {
                model.addAttribute("msg", "密码错误");
                return "login/loginInput";
            }
        }else {
            model.addAttribute("msg", "用户名不存在");
            return "login/loginInput";
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

    public IRoleService getRoleService() {
        return roleService;
    }
    @Resource
    public void setRoleService(IRoleService roleService) {
        this.roleService = roleService;
    }
}
